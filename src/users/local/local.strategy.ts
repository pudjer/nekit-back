import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {BadRequestException, HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserSelfDTO} from "../models/User";
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({global: true});
    }


    async validate(username: string, password: string): Promise<any> {
        const user = await this.userService.validateAndGetUser({username, password});
        return user
    }

}
