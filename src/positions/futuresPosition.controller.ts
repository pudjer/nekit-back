import { Body, Controller, Delete, Get, Param, Patch, UnauthorizedException } from "@nestjs/common";
import { FuturesPositionService } from "./futuresPosition.service";
import { FuturesPosition, changeFuturesPositionDTO } from "./model/FuturesPosition";
import { ApiNoContentResponse, ApiResponse } from "@nestjs/swagger";
import { AuthRequired } from "src/users/decorators/AuthRequired";
import { UserParamDecorator } from "src/users/decorators/UserDecorator";
import {  UserModel } from "src/users/models/User";

@Controller("futures")
export class FuturesPositionController{
  constructor(
    private positionService: FuturesPositionService
  ){}

  @AuthRequired
  @ApiResponse({ type: [FuturesPosition] })
  @Get()
  async getPositions(@UserParamDecorator() user: UserModel): Promise<FuturesPosition[]> {
    return this.positionService.getPositionsByUserId(user._id)
  }

  @ApiNoContentResponse()
  @AuthRequired
  @Delete(':id')
  async delete(@UserParamDecorator() user: UserModel, @Param('id') id) {
    const pos = await this.positionService.getPositionsById(id)
    if(pos._id !== user._id){
      throw new UnauthorizedException("it's not yours position")
    }
    await this.positionService.deletePositionById(id)
  }
  
  @ApiResponse({ type: FuturesPosition  })
  @AuthRequired
  @Patch(':id')
  async change(@UserParamDecorator() user: UserModel, @Body() toChange: changeFuturesPositionDTO, @Param('id') id): Promise<FuturesPosition> {
    const pos = await this.positionService.getPositionsById(id)
    if(pos._id !== user._id){
      throw new UnauthorizedException("it's not yours position")
    }
    return await this.positionService.change(id, toChange)
  }

}