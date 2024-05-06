import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioChangeDTO, PortfolioCreateDTO } from './Portfolio';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
  ){}


  async createPortfolio(portfolio: PortfolioCreateDTO){
    return await this.portfolioModel.create(portfolio)
  }
  async getPortfolioById(id: string){
    return await this.portfolioModel.findById(id)
  }
  async getPortfoliosByUserId(userId: string){
    return await this.portfolioModel.find({ userId })
  }

  async deletePortfolioById(id: string){
    return await this.portfolioModel.findByIdAndDelete({_id: id})
  }

  async change(id: string, newPortf: PortfolioChangeDTO){
    const portf = await this.portfolioModel.findById(id)
    Object.assign(portf, newPortf)
    await portf.save()
    return portf
  }
}