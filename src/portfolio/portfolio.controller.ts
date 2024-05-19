import { Controller, Get, Delete, Param, UnauthorizedException, Patch, Body, Post, NotFoundException } from "@nestjs/common"
import { ApiResponse, ApiNoContentResponse } from "@nestjs/swagger"
import { AuthRequired } from "src/users/decorators/AuthRequired"
import { UserParamDecorator } from "src/users/decorators/UserDecorator"
import { UserModel } from "src/users/models/User"
import { Portfolio, PortfolioChangeDTO, PortfolioCreateDTO } from "./Portfolio"
import { PortfolioService } from "./portfolio.service"
import { TelegramService } from "src/users/telegram.service"
class Report{
  report: string
}
@Controller("portfolios")
export class PortfolioController{
  constructor(
    private portfolioService: PortfolioService,
    private telegram: TelegramService
  ){}

  @AuthRequired
  @ApiResponse({ type: [Portfolio] })
  @Get()
  async getPortfolios(@UserParamDecorator() user: UserModel): Promise<Portfolio[]> {
    return this.portfolioService.getPortfoliosByUserId(user._id)
  }

  



  @Get('public')
  async getPublicPorfolios(): Promise<Portfolio[]> {
    const res = await this.portfolioService.getPublicPortfolios()
    return res
  }
  @ApiResponse({ type: [Portfolio] })
  @Get(':id')
  async getPortfolioById( @Param('id') id): Promise<Portfolio> {
    const res =  this.portfolioService.getPortfolioById(id)
    if(!res)throw new NotFoundException()
    return res
  }

  @ApiNoContentResponse()
  @AuthRequired
  @Delete(':id')
  async delete(@UserParamDecorator() user: UserModel, @Param('id') id) {
    await this.checkAuthority(id, user)
    await this.portfolioService.deletePortfolioById(id)
  }
  
  @ApiResponse({ type: Portfolio  })
  @AuthRequired
  @Patch(':id')
  async change(@UserParamDecorator() user: UserModel, @Body() toChange: PortfolioChangeDTO, @Param('id') id): Promise<Portfolio> {
    await this.checkAuthority(id, user)
    return await this.portfolioService.change(id, toChange)
  }
  @ApiResponse({ type: Portfolio  })
  @AuthRequired
  @Post()
  async create(@UserParamDecorator() user: UserModel, @Body() portfolio: PortfolioChangeDTO): Promise<Portfolio> {
    const portf = new PortfolioCreateDTO()
    Object.assign(portf, portfolio)
    portf.userId = user._id
    return await this.portfolioService.createPortfolio(portf)
  }
  async checkAuthority(id: string, user: UserModel){
    const portf = await this.portfolioService.getPortfolioById(id)
    if(!portf){
      throw new NotFoundException() 
    }
    if(portf.userId.toString() !== user._id.toString()){
      throw new UnauthorizedException("it's not yours portfolio")
    }
  }

  @AuthRequired
  @Post("tgreport")
  async toTg(@UserParamDecorator() user: UserModel, @Body() portfolio: Report){
    const doc = {
      source: Buffer.from(portfolio.report),
      filename: "report.html"
    }
    user.tgId && this.telegram.bot.telegram.sendDocument(user.tgId, doc)
  }

}

