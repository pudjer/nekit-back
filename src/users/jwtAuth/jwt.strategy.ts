import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UserSelfDTO} from "../models/User";
import {Request} from "express";
import { UserService } from '../users.service';

export const TOKEN_NAME = 'refresh_token'
const cookieExtractor = (req: Request) =>{
    if('cookies' in req){
        return req.cookies[TOKEN_NAME]
    }
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: true,
            secretOrKey: configService.get('SECRET_KEY'),
            global: true,
        });
    }

    async validate(cookie: UserSelfDTO & {iat: number, exp: number}) {
        const {iat, exp, ...userFromCookie} = cookie
        const user = await this.userService.validateAndGetUser(userFromCookie, {password: false})
        const valid_since = Math.floor(user.valid_since.getTime() / 1000)
        if(user.valid_since && (valid_since > iat)){
            throw new HttpException('Suspicious request detected.', HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}