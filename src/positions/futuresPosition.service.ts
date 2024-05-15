import { Injectable, NotFoundException } from '@nestjs/common';
import { FuturesPosition, FuturesPositionWithoutId, changeFuturesPositionDTO } from './model/FuturesPosition';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExchangeController } from 'src/exchange/exchange.controller';
import { TelegramService } from 'src/users/telegram.service';
import { UserService } from 'src/users/users.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { ConfigService } from '@nestjs/config';
import { Portfolio } from 'src/portfolio/Portfolio';
import { Format, Markup } from 'telegraf';

@Injectable()
export class FuturesPositionService {
  constructor(
    @InjectModel(FuturesPosition.name) private positionModel: Model<FuturesPosition>,
    private exchange: ExchangeController,
    private telegram: TelegramService,
    private userService: UserService,
    private portfolioService: PortfolioService,
    private configService: ConfigService
  ){}


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

  async notifyClosingPositions(){
    
    const poses = await this.positionModel.find()
    const toNotify: MaybeCanceledPositions[] = []
    for(const pos of poses){
      const currentPrice = this.exchange.tokensMap.get(pos.symbol).current_price || NaN
      let notifiedNow = false
      let priceNow
      if(pos.quantity>0){
        if((pos.takeProfit || NaN) < currentPrice){
          if(!pos.notified)toNotify.push({pos, what: "Take Profit", currentPrice})
          notifiedNow = true
          priceNow = pos.takeProfit
        }
        if((pos.stopLoss || NaN) > currentPrice){
          if(!pos.notified)toNotify.push({pos, what: "Stop Loss", currentPrice})
          notifiedNow = true
          priceNow = pos.stopLoss
        }
      }else{
        if((pos.takeProfit || NaN) > currentPrice){
          if(!pos.notified)toNotify.push({pos, what: "Take Profit", currentPrice})
          notifiedNow = true
          priceNow = pos.takeProfit

        }
        if((pos.stopLoss || NaN) < currentPrice){
          if(!pos.notified)toNotify.push({pos, what: "Stop Loss", currentPrice})
          notifiedNow = true
          priceNow = pos.stopLoss
        }
      }
      if(pos.margin + (currentPrice * pos.quantity - pos.initialPrice * pos.quantity) < 0){
        if(!pos.notified)toNotify.push({pos, what: "Ликвидация", currentPrice})
        notifiedNow = true
        priceNow = pos.initialPrice - (pos.margin / pos.quantity)
      }
      if(pos.notified!==notifiedNow){
        pos.notified = notifiedNow
        pos.exitPrice = priceNow
        pos.save()
      }
    }
    const userMap = new Map<number, {notion: string, portfolio: Portfolio, pos: FuturesPosition}[]>()
    for(const posCanceled of toNotify){
      try{
        const portfolio  = await this.portfolioService.getPortfolioById(posCanceled.pos.portfolioId)
        const userTgId = portfolio && (await this.userService.getUserById(portfolio.userId)).tgId
        const notions = userTgId && userMap.get(userTgId)
        const [currentPrice, cur] = this.exchange.convertFromUSD(posCanceled.currentPrice, posCanceled.pos.currency)
        const [exitPrice, currency] = posCanceled.what !== "Ликвидация"  ? this.exchange.convertFromUSD(posCanceled.what==="Take Profit" ? posCanceled.pos.takeProfit : posCanceled.pos.stopLoss, posCanceled.pos.currency) : [undefined, undefined]
        const notion = `Актив: ${posCanceled.pos.symbol},
        ${posCanceled.what} ${(exitPrice && currency) ? exitPrice+" "+currency : ""},
        Текущая цена: ${currentPrice.toLocaleString()} ${cur},
        Текущая прибыль: ${((currentPrice * posCanceled.pos.quantity) - (posCanceled.pos.initialPrice * posCanceled.pos.quantity)).toLocaleString()} ${cur},
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

