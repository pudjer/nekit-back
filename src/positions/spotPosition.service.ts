import { Injectable } from '@nestjs/common';
import { SpotPosition, SpotPositionWithoutId, changeSpotPositionDTO } from './model/SpotPosition';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SpotPositionService {
  constructor(
    @InjectModel(SpotPosition.name) private positionModel: Model<SpotPosition>,
  ){}

  async createPosition(position: SpotPositionWithoutId){
    return await this.positionModel.create(position)
  }

  async getPositionsByPortfolioId(portfolioId: string){
    return await this.positionModel.find({ portfolioId: portfolioId })
  }
  async getPositionById(id: string){
    return await this.positionModel.findById(id)
  }
  async deletePositionById(id: string){
    return await this.positionModel.findByIdAndDelete({_id: id})
  }
  async change(id: string, newPos: changeSpotPositionDTO){
    const pos = await this.positionModel.findById(id)
    Object.assign(pos, newPos)
    await pos.save()
    return pos
  }
}