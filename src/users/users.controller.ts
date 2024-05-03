import { Body, Controller, Delete, Get, Patch, Post, Response, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { Response as ExpressResponse } from 'express';
import { UserParamDecorator } from './decorators/UserDecorator';
import { UserCreateDTO, UserLoginDTO, UserModel, UserSelfDTO } from './models/User';
import { AccessToken } from './models/Tokens';
import { TOKEN_NAME } from './jwt/jwt.strategy';
import { ApiBody, ApiNoContentResponse, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AuthRequired } from './decorators/AuthRequired';
import { UserService } from './users.service';


@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
    ) {}

  @UseGuards(LocalAuthGuard)
  @ApiResponse({type: AccessToken})
  @Post('login')
  @ApiBody({ type: UserLoginDTO })
  async login(
    @UserParamDecorator() user: UserModel,
    @Response({passthrough: true}) res: ExpressResponse
    ){
    const { refresh_token, access_token } = await this.userService.getTokens(user);
    res.cookie(TOKEN_NAME, refresh_token, {httpOnly: true})
    return {access_token: access_token}
  }

  @AuthRequired
  @ApiResponse({ type: AccessToken })
  @Get('refresh')
  async refresh(
    @UserParamDecorator() user: UserModel,
    @Response({ passthrough: true }) res: ExpressResponse
    ){
    return this.login(user, res)
  }

  @ApiResponse({type: UserSelfDTO})
  @Post()
  async register(@Body() user: UserCreateDTO): Promise<UserSelfDTO> {    
    return await this.userService.register(user);
  }
  

  @AuthRequired
  @ApiResponse({ type: UserSelfDTO })
  @Get()
  async getProfile(@UserParamDecorator() user: UserModel) {
    return await this.userService.validateAndGetUser(user, { password: false })
  }

  @ApiNoContentResponse()
  @AuthRequired
  @Delete()
  async delete(@UserParamDecorator() user: UserModel) {
    await user.deleteOne()
  }

  @ApiResponse({ type: UserSelfDTO })
  @AuthRequired
  @Patch()
  async invalidateByTime(@UserParamDecorator() user: UserModel) {
    user.valid_since = new Date()
    return await user.save()
  }

  
}

