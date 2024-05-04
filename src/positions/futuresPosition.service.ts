import { Injectable } from '@nestjs/common';
import { FuturesPosition, changeFuturesPositionDTO } from './model/FuturesPosition';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FuturesPositionService {
  constructor(
    @InjectModel(FuturesPosition.name) private positionModel: Model<FuturesPosition>,
  ){}


  async createPosition(position: FuturesPosition){
    return await this.positionModel.create(position)
  }
  async getPositionsById(id: string){
    return await this.positionModel.findById(id)
  }
  async getPositionsByUserId(userId: string){
    return await this.positionModel.find({ userId })
  }

  async deletePositionById(id: string){
    return await this.positionModel.findByIdAndDelete({_id: id})
  }

  async change(id: string, newPos: changeFuturesPositionDTO){
    const pos = await this.positionModel.findById(id)
    Object.assign(pos, newPos)
    await pos.save()
    return pos
  }
}