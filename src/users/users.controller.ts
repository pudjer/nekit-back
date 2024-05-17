
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Response, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { UserParamDecorator } from './decorators/UserDecorator';
import {  User, UserAdminCreateDTO, UserChangeDTO, UserCreateDTO, UserLoginDTO, UserModel, UserSelfDTO } from './models/User';
import { AccessToken, TgPassword } from './models/Tokens';
import { ApiBody, ApiNoContentResponse, ApiResponse } from '@nestjs/swagger';
import { AuthRequired } from './decorators/AuthRequired';
import { UserService } from './users.service';
import { AdminRequired } from './admin/AdminDecorator';
import { TelegramService } from 'src/users/telegram.service';


function generateRandomNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private telegram: TelegramService
    ) { }

  @UseGuards(LocalAuthGuard)
  @ApiResponse({type: AccessToken})
  @Post('login')
  @ApiBody({ type: UserLoginDTO })
  async login(
    @UserParamDecorator() user: UserModel,
    ): Promise<AccessToken>{
    if(user.tgId){
      user.tgPassword = generateRandomNumber()
      setTimeout(()=>{
        delete user.tgPassword
        user.save()
      }, 2*60*1000)
      await user.save()
      this.telegram.bot.telegram.sendMessage(user.tgId, `
Команда CoinTrackX рада приветствовать Вас 🎉

Для входа используйте одноразовый пароль:
\n`+user.tgPassword.toString())
      return {
        access_token: "",
        tgrequired: true
      }
    }
    return await this.userService.getToken(user);
  }

  @AuthRequired
  @Post("favorite/:id")
  async addFavoritePortfolio(@UserParamDecorator() user: UserModel, @Param('id') id: string){
    if(!user.favoritePortfolios.includes(id)){
      user.favoritePortfolios = [...user.favoritePortfolios, id]
      await user.save()
    }
  }

  
  @AuthRequired
  @Delete("favorite/:id")
  async deleteFavoritePortfolio(@UserParamDecorator() user: UserModel, @Param('id') id: string){
    user.favoritePortfolios = user.favoritePortfolios.filter(e=>e!==id)
    await user.save()
  }

  @Post('tgauth')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDTO })
  async loginByTgToken(
    @Body() tgPassword: TgPassword,
    @UserParamDecorator() user: UserModel
  ){
    if(tgPassword.tgPassword===user.tgPassword){
      delete user.tgPassword
      await user.save()
      return await this.userService.getToken(user);
    }else{
      throw new BadRequestException("не совпал одноразовый пароль")
    }
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

