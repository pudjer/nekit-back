import { Body, Controller, Delete, Get, Patch, Post, Response, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { UserParamDecorator } from './decorators/UserDecorator';
import { User, UserAdminCreateDTO, UserChangeDTO, UserCreateDTO, UserLoginDTO, UserModel, UserSelfDTO } from './models/User';
import { AccessToken } from './models/Tokens';
import { ApiBody, ApiNoContentResponse, ApiResponse } from '@nestjs/swagger';
import { AuthRequired } from './decorators/AuthRequired';
import { UserService } from './users.service';
import { AdminRequired } from './admin/AdminDecorator';


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
    ): Promise<AccessToken>{
    return await this.userService.getToken(user);
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

