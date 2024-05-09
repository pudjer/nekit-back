import { Injectable, NotFoundException } from '@nestjs/common';
import { FuturesPosition, FuturesPositionWithoutId, changeFuturesPositionDTO } from './model/FuturesPosition';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FuturesPositionService {
  constructor(
    @InjectModel(FuturesPosition.name) private positionModel: Model<FuturesPosition>,
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
}