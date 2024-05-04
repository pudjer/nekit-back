import { Body, Controller, Delete, Get, Param, Patch, UnauthorizedException } from "@nestjs/common";
import { SpotPositionService } from "./SpotPosition.service";
import { SpotPosition, changeSpotPositionDTO } from "./model/SpotPosition";
import { ApiNoContentResponse, ApiResponse } from "@nestjs/swagger";
import { AuthRequired } from "src/users/decorators/AuthRequired";
import { UserParamDecorator } from "src/users/decorators/UserDecorator";
import { UserChangeDto, UserModel, UserSelfDTO } from "src/users/models/User";

@Controller("spot")
export class SpotPositionController{
  constructor(
    private positionService: SpotPositionService
  ){}

  @AuthRequired
  @ApiResponse({ type: [SpotPosition] })
  @Get()
  async getPositions(@UserParamDecorator() user: UserModel): Promise<SpotPosition[]> {
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
  
  @ApiResponse({ type: SpotPosition  })
  @AuthRequired
  @Patch(':id')
  async change(@UserParamDecorator() user: UserModel, @Body() toChange: changeSpotPositionDTO, @Param('id') id): Promise<SpotPosition> {
    const pos = await this.positionService.getPositionsById(id)
    if(pos._id !== user._id){
      throw new UnauthorizedException("it's not yours position")
    }
    return await this.positionService.change(id, toChange)
  }

}