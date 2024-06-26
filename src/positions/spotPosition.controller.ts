import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, UnauthorizedException } from "@nestjs/common";
import { SpotPositionService } from "./spotPosition.service";
import { SpotPosition, SpotPositionWithoutId, changeSpotPositionDTO } from "./model/SpotPosition";
import { ApiNoContentResponse, ApiResponse } from "@nestjs/swagger";
import { AuthRequired } from "src/users/decorators/AuthRequired";
import { UserParamDecorator } from "src/users/decorators/UserDecorator";
import { UserChangeDTO, UserModel, UserSelfDTO } from "src/users/models/User";
import { PortfolioController } from "src/portfolio/portfolio.controller";

@Controller("spot")
export class SpotPositionController{
  constructor(
    private positionService: SpotPositionService,
    private portfolioController: PortfolioController,
  ){}

  @ApiResponse({ type: [SpotPosition] })
  @Get('all')
  async getPositionsByPortfolioId(@Query('portfolioId') portfolioId: string): Promise<SpotPosition[]> {
    if(!portfolioId) throw new BadRequestException('specify profileId')
    return await this.positionService.getPositionsByPortfolioId(portfolioId)
  }


  @ApiNoContentResponse()
  @AuthRequired
  @Delete(':id')
  async delete(@UserParamDecorator() user: UserModel, @Param('id') id) {
    await this.checkAuthority(id, user)
    await this.positionService.deletePositionById(id)
  }
  
  @ApiResponse({ type: SpotPosition  })
  @AuthRequired
  @Patch(':id')
  async change(@UserParamDecorator() user: UserModel, @Body() toChange: changeSpotPositionDTO, @Param('id') id): Promise<SpotPosition> {
    await this.checkAuthority(id, user)
    return await this.positionService.change(id, toChange)
  }

  @ApiResponse({ type: SpotPosition  })
  @AuthRequired
  @Post()
  async create(@UserParamDecorator() user: UserModel, @Body() pos: SpotPositionWithoutId): Promise<SpotPosition> {
   await  this.portfolioController.checkAuthority(pos.portfolioId, user)
    return await this.positionService.createPosition(pos)
  }

  @ApiResponse({ type: [SpotPosition] })
  @Get(':id')
  async getPositionById(@Param('id') id: string): Promise<SpotPosition> {
    return await this.positionService.getPositionById(id)
  }
  
  async checkAuthority(id: string, user: UserModel){
    const pos = await this.positionService.getPositionById(id)
    if(!pos){
      throw new NotFoundException()
    }
    await this.portfolioController.checkAuthority(pos.portfolioId, user)
  }

}