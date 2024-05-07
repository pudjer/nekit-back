import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UserSelfDTO} from "../models/User";
import {Request} from "express";
import { UserService } from '../users.service';

const authExtractor = (req: Request) =>{
    return req.headers.authorization
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService) {
        super({
            jwtFromRequest: authExtractor,
            ignoreExpiration: true,
            secretOrKey: configService.get('SECRET_KEY'),
            global: true,
        });
    }

    async validate(auth: UserSelfDTO & {iat: number, exp: number}) {
        const {iat, exp, ...userFromCookie} = auth
        const user = await this.userService.validateAndGetUser(userFromCookie, {password: false})
        const valid_since = Math.floor(user.valid_since.getTime() / 1000)
        if((exp < (new Date()).getTime() / 1000) || (user.valid_since && (valid_since > iat))){
            throw new UnauthorizedException();
        }
        return user;
    }
}

