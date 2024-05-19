import { Injectable, NotFoundException } from '@nestjs/common';
import { FuturesPosition, FuturesPositionWithoutId, changeFuturesPositionDTO } from './model/FuturesPosition';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelegramService } from 'src/users/telegram.service';
import { UserService } from 'src/users/users.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { ConfigService } from '@nestjs/config';
import { Portfolio } from 'src/portfolio/Portfolio';
import { ExchangeService } from 'src/exchange/exchange.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FuturesPositionService {
  constructor(
    @InjectModel(FuturesPosition.name) private positionModel: Model<FuturesPosition>,
    private exchange: ExchangeService,
    private telegram: TelegramService,
    private userService: UserService,
    private portfolioService: PortfolioService,
    private configService: ConfigService
  ){
  }


  async createPosition(position: FuturesPositionWithoutId){
    return await this.positionModel.create(position)
  }
  async getPositionById(id: string){
    const res =  await this.positionModel.findById(id)
    if(!res)throw new NotFoundException()
    return res
  }
  async getPositionsByPortfolioId(portfolioId: string){
    return await this.positionModel.find({ portfolioId })
  }

  async deletePositionById(id: string){
    return await this.positionModel.findByIdAndDelete({_id: id})
  }

  async change(id: string, newPos: changeFuturesPositionDTO){
    const pos = await this.positionModel.findById(id)
    if(!pos)throw new NotFoundException()
    Object.assign(pos, newPos)
    await pos.save()
    return pos
  }


  
  @Cron(CronExpression.EVERY_10_SECONDS)
  async updatePositionsAndNotify(){
    
    const poses = await this.positionModel.find()
    const date = new Date()
    const toNotify: MaybeCanceledPositions[] = []
    for(const pos of poses){
      let tokenPrice = this.exchange.tokensMap.get(pos.symbol)?.current_price 
      const currencyRate = this.exchange.currenciesMap.get(pos.currency)?.exchangeRateToUsd
      if(!tokenPrice || ! currencyRate)continue
      tokenPrice = tokenPrice * currencyRate


      let notifiedNow = false
      let priceNow
      if(pos.quantity>0){
        if((pos.takeProfit || NaN) < tokenPrice){
          if(!pos.notified)toNotify.push({pos, what: "Take Profit", currentPrice: tokenPrice})
          notifiedNow = true
          priceNow = pos.takeProfit
        }
        if((pos.stopLoss || NaN) > tokenPrice){
          if(!pos.notified)toNotify.push({pos, what: "Stop Loss", currentPrice: tokenPrice})
          notifiedNow = true
          priceNow = pos.stopLoss
        }
      }else{
        if((pos.takeProfit || NaN) > tokenPrice){
          if(!pos.notified)toNotify.push({pos, what: "Take Profit", currentPrice: tokenPrice})
          notifiedNow = true
          priceNow = pos.takeProfit

        }
        if((pos.stopLoss || NaN) < tokenPrice){
          if(!pos.notified)toNotify.push({pos, what: "Stop Loss", currentPrice: tokenPrice})
          notifiedNow = true
          priceNow = pos.stopLoss
        }
      }
      const value = pos.margin + (tokenPrice * pos.quantity - pos.initialPrice * pos.quantity)
      if(value < 0){
        if(!pos.notified)toNotify.push({pos, what: "Ликвидация", currentPrice: pos.initialPrice-(pos.margin /pos.quantity)})
        notifiedNow = true
        priceNow = pos.initialPrice - (pos.margin / pos.quantity)
      }
      if(pos.notified!==notifiedNow){
        pos.notified = notifiedNow
        if(priceNow){
          pos.exitPrice = priceNow
          pos.exitTimestamp = date
        }
        pos.save()
      }
    }
    const userMap = new Map<number, {notion: string, portfolio: Portfolio, pos: FuturesPosition}[]>()
    for(const posCanceled of toNotify){
      try{
        const portfolio  = await this.portfolioService.getPortfolioById(posCanceled.pos.portfolioId)
        const userTgId = portfolio && (await this.userService.getUserById(portfolio.userId)).tgId
        if(!userTgId)continue
        const notions = userTgId && userMap.get(userTgId)
        const [currentPrice, cur] = [posCanceled.currentPrice, posCanceled.pos.currency]
        const [exitPrice, currency] = posCanceled.what !== "Ликвидация"  ? [posCanceled.what==="Take Profit" ? posCanceled.pos.takeProfit : posCanceled.pos.stopLoss, posCanceled.pos.currency] : [undefined, undefined]
        const notion = `Актив: ${posCanceled.pos.symbol}
        ${posCanceled.what} ${(exitPrice && currency) ? exitPrice+" "+currency : ""}
        Текущая цена: ${currentPrice.toLocaleString()} ${cur}
        Текущая прибыль: ${((currentPrice * posCanceled.pos.quantity) - (posCanceled.pos.initialPrice * posCanceled.pos.quantity)).toLocaleString()} ${cur}
        Портфель: ${portfolio.name}
        
        `;
        const res = {notion, portfolio, pos: posCanceled.pos}
        notions ? notions.push(res) : userMap.set(userTgId, [res])
      }catch(e){
        console.log(e)
      }
    }
    for(const [userTgId, notions] of userMap.entries()){
      this.telegram.bot.telegram.sendMessage(userTgId, notions.reduce((a, e)=>e.notion+'\n' ,"Закртыты позиции:\n"))
    }
  }
}
interface MaybeCanceledPositions{
  pos: FuturesPosition, what: "Ликвидация" | "Take Profit" | "Stop Loss", currentPrice: number
}

