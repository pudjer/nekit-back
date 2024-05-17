import { Injectable, NotFoundException } from '@nestjs/common';
import { SpotPosition, SpotPositionWithoutId, changeSpotPositionDTO } from './model/SpotPosition';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExchangeController } from 'src/exchange/exchange.controller';

@Injectable()
export class SpotPositionService {
  constructor(
    @InjectModel(SpotPosition.name) private positionModel: Model<SpotPosition>,
  ){}

  async createPosition(position: SpotPositionWithoutId){
    return await this.positionModel.create(position)
  }

  async getPositionsByPortfolioId(portfolioId: string){
    const res = await this.positionModel.find({ portfolioId: portfolioId })
    return res
  }

  async getPositionById(id: string){
    const res =  await this.positionModel.findById(id)
    if(!res)throw new NotFoundException()
    return res
  }
  async deletePositionById(id: string){
    return await this.positionModel.findByIdAndDelete({_id: id})
  }
  async change(id: string, newPos: changeSpotPositionDTO){
    const pos = await this.positionModel.findById(id)
    if(!pos)throw new NotFoundException()
    Object.assign(pos, newPos)
    await pos.save()
    return pos
  }
}