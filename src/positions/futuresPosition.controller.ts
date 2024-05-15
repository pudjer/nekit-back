import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, UnauthorizedException } from "@nestjs/common";
import { FuturesPositionService } from "./futuresPosition.service";
import { FuturesPosition, FuturesPositionWithoutId, changeFuturesPositionDTO } from "./model/FuturesPosition";
import { ApiNoContentResponse, ApiResponse } from "@nestjs/swagger";
import { AuthRequired } from "src/users/decorators/AuthRequired";
import { UserParamDecorator } from "src/users/decorators/UserDecorator";
import {  UserModel } from "src/users/models/User";
import { PortfolioController } from "src/portfolio/portfolio.controller";
import { Cron, CronExpression } from "@nestjs/schedule";

@Controller("futures")
export class FuturesPositionController{
  constructor(
    private positionService: FuturesPositionService,
    private portfolioController: PortfolioController,
  ){
    setTimeout(this.notifyUsers.bind(this), 10000)
  }

  @ApiResponse({ type: [FuturesPosition] })
  @Get('all')
  async getPositionsByPortfolioId(@Query('portfolioId') portfolioId: string): Promise<FuturesPosition[]> {
    if(!portfolioId) throw new BadRequestException('specify profileId')
    return this.positionService.getPositionsByPortfolioId(portfolioId)
  }

  @ApiNoContentResponse()
  @AuthRequired
  @Delete(':id')
  async delete(@UserParamDecorator() user: UserModel, @Param('id') id) {
    this.checkAuthority(id, user)
    await this.positionService.deletePositionById(id)
  }
  
  @ApiResponse({ type: FuturesPosition  })
  @AuthRequired
  @Patch(':id')
  async change(@UserParamDecorator() user: UserModel, @Body() toChange: changeFuturesPositionDTO, @Param('id') id): Promise<FuturesPosition> {
    this.checkAuthority(id, user)
    return await this.positionService.change(id, toChange)
  }

  @ApiResponse({ type: FuturesPosition  })
  @AuthRequired
  @Post()
  async create(@UserParamDecorator() user: UserModel, @Body() pos: FuturesPositionWithoutId, @Param('id') id): Promise<FuturesPosition> {
    this.portfolioController.checkAuthority(pos.portfolioId, user)
    return await this.positionService.createPosition(pos)
  }

  @ApiResponse({ type: [FuturesPosition] })
  @Get(':id')
  async getPositionById(@Param('id') id: string): Promise<FuturesPosition> {
    return this.positionService.getPositionById(id)
  }
  async checkAuthority(id: string, user: UserModel){
    const pos = await this.positionService.getPositionById(id)
    if(!pos){
      throw new NotFoundException()
    }
    this.portfolioController.checkAuthority(pos.portfolioId, user)
  }


  @Cron(CronExpression.EVERY_10_SECONDS)
  async notifyUsers(){
    this.positionService.notifyClosingPositions()
  }


}