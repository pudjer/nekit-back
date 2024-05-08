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
import { ExchangeModule } from 'src/exchange/exchange.module';
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
    ExchangeModule
  ],
  providers: [LocalStrategy, JwtStrategy, UserService],
  controllers: [UserController],
})
export class UserModule {}