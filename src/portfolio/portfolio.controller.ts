import { Controller, Get, Delete, Param, UnauthorizedException, Patch, Body, Post } from "@nestjs/common"
import { ApiResponse, ApiNoContentResponse } from "@nestjs/swagger"
import { AuthRequired } from "src/users/decorators/AuthRequired"
import { UserParamDecorator } from "src/users/decorators/UserDecorator"
import { UserModel } from "src/users/models/User"
import { Portfolio, PortfolioChangeDTO, PortfolioCreateDTO } from "./Portfolio"
import { PortfolioService } from "./portfolio.service"

@Controller("portfolios")
export class PortfolioController{
  constructor(
    private portfolioService: PortfolioService
  ){}

  @AuthRequired
  @ApiResponse({ type: [Portfolio] })
  @Get()
  async getPortfolios(@UserParamDecorator() user: UserModel): Promise<Portfolio[]> {
    return this.portfolioService.getPortfoliosByUserId(user._id)
  }

  
  @AuthRequired
  @ApiResponse({ type: [Portfolio] })
  @Get(':id')
  async getPortfolioById(@UserParamDecorator() user: UserModel, @Param('id') id): Promise<Portfolio> {
    return this.portfolioService.getPortfolioById(id)
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
    const pos = await this.portfolioService.getPortfolioById(id)
    if(pos._id !== user._id){
      throw new UnauthorizedException("it's not yours portfolio")
    }
  }

}