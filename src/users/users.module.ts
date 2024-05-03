import { Module } from '@nestjs/common';
import { LocalStrategy } from './local/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./jwt/jwt.strategy";
import { UserController } from './users.controller';
import { messagePattern } from '../config/variables';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserScheme } from './models/User';
import { UserService } from './users.service';
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
    ])
  ],
  providers: [LocalStrategy, JwtStrategy, UserService,
  {
    useValue: (token: string)=>{
      return messagePattern + ' '+ token
    },
    provide: 'EMAIL_FUNC'
  }
  ],
  controllers: [UserController],
})
export class UserModule {}