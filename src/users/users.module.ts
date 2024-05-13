import { Module } from '@nestjs/common';
import { LocalStrategy } from './local/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./jwtAuth/jwt.strategy";
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserScheme } from './models/User';
import { UserService } from './users.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from 'src/users/telegram.service';
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService)=>({
        secret: await configService.get('SECRET_KEY'),
        global: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserScheme },
    ]),
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService)=>({
        token: await configService.get('TELEGRAM_TOKEN'),
      }),
      inject: [ConfigService],
    }),

  ],
  providers: [LocalStrategy, JwtStrategy, UserService, TelegramService],
  controllers: [UserController],
  exports: [UserService, TelegramService]
})
export class UserModule {}