import { Body, Controller, Delete, Get, Patch, Post, Response, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { Response as ExpressResponse } from 'express';
import { UserParamDecorator } from './decorators/UserDecorator';
import { User, UserAdminCreateDTO, UserChangeDTO, UserCreateDTO, UserLoginDTO, UserModel, UserSelfDTO } from './models/User';
import { AccessToken } from './models/Tokens';
import { TOKEN_NAME } from './jwtAuth/jwt.strategy';
import { ApiBody, ApiNoContentResponse, ApiResponse } from '@nestjs/swagger';
import { AuthRequired } from './decorators/AuthRequired';
import { UserService } from './users.service';
import { AdminRequired } from './admin/AdminDecorator';
import { ConfigService } from '@nestjs/config';

function createDateFromString(str: string) {
  // Extract the numerical value and unit from the string
  const value = parseInt(str);
  const unit = str.slice(-1); // Get the last character of the string
  
  // Create a new Date object
  const currentDate = new Date();

  // Calculate the milliseconds to add based on the unit
  let millisecondsToAdd;
  switch(unit) {
      case 'd':
          millisecondsToAdd = value * 24 * 60 * 60 * 1000; // Convert days to milliseconds
          break;
      default:
          throw new Error('Invalid unit provided');
  }

  // Calculate the new date by adding milliseconds to the current date
  const newDate = new Date(currentDate.getTime() + millisecondsToAdd);

  return newDate;
}

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    ) { }

  @UseGuards(LocalAuthGuard)
  @ApiResponse({type: AccessToken})
  @Post('login')
  @ApiBody({ type: UserLoginDTO })
  async login(
    @UserParamDecorator() user: UserModel,
    @Response({passthrough: true}) res: ExpressResponse
    ){
    const { refresh_token, access_token } = await this.userService.getTokens(user);
    res.cookie(TOKEN_NAME, refresh_token, {httpOnly: true, expires: createDateFromString(this.userService.refreshExpTime)})
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
  


  @ApiResponse({type: User})
  @Post("admin")
  @AdminRequired
  async adminCreate(@Body() user: UserAdminCreateDTO): Promise<User> {    
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
  async change(@UserParamDecorator() user: UserModel, @Body() toChange: UserChangeDTO) {
    return await this.userService.change(user.id, toChange)
  }

  @ApiResponse({ type: UserSelfDTO })
  @AuthRequired
  @Patch("invalidate")
  async invalidateByTime(@UserParamDecorator() user: UserModel) {
    user.valid_since = new Date()
    return await user.save()
  }



  
}

