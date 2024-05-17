import { Ctx, InjectBot, Start, Update as Upd  } from "nestjs-telegraf";
import { UserService } from "src/users/users.service";
import { Context, Telegraf } from "telegraf";


interface StartUpdate extends Context{
  startPayload?: string
}

@Upd()
export class TelegramService {
  constructor(
    private userService: UserService,
    @InjectBot() public bot: Telegraf
  ){}
  @Start()
  async start(@Ctx() ctx: StartUpdate) {
    const userTgId = ctx.from.id
    const userId = ctx.startPayload;
    if(!userId)ctx.reply("Добро пожаловать!")
    try{
      await this.userService.addTg(userId, userTgId)
    }catch(e){
      ctx.reply("Не получилось привезать аккаунт")
    }
    ctx.reply("Аккаунт успешно привязан!")
    
  }


}