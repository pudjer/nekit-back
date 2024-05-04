import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {UserCreateDTO, User, UserHashedDTO, UserModel, UserAdminCreateDTO, UserSelfDTO, UserChangeDto} from "./models/User";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { privateAttributesWithoutPassword } from '../config/variables';
import { striper } from '../helpers/stripper';
import { Tokens } from './models/Tokens';


@Injectable()
export class UserService {
    refreshExpTime: string
    accessExpTime: string
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.refreshExpTime = this.configService.get('JWT_REFRESH_EXPIRATION_TIME')
        this.accessExpTime = this.configService.get('JWT_ACCESS_EXPIRATION_TIME')
    }

    async findByUsername(username: string){
        const res = await this.userModel.findOne({ username }).exec();
        if (!res) throw new UnauthorizedException()
        return res
    }

    async create(user: UserHashedDTO){
        const createdUserDTO = new this.userModel(user);
        const res = await createdUserDTO.save();
        return res;
    }
    
    validateAndGetUser<T, J>(cred: T, options?: {password: J}): T extends Credentials ? Promise<UserModel> : T extends { username: string } ? J extends false ? Promise<UserModel> : never : never
    async validateAndGetUser(toValidate: {username: string, password?: string}, options?: {password: boolean}){
        const user = await this.findByUsername(toValidate.username);
        if(options?.password){
            if (!await bcrypt.compare(toValidate.password, user.hashedPassword)) {
               throw new UnauthorizedException() 
            } 
        }
        if(user.blocked) throw new ForbiddenException() 
        return user
    }



    async register(user: UserCreateDTO|UserAdminCreateDTO) {
        const hashedPassword = await bcrypt.hash(user.password, 4)
        const { password, ...userNoPassw } = user
        const toCreate: UserHashedDTO = {
            ...userNoPassw,
            hashedPassword,
        };

        return await this.create(toCreate)
    }

    async change(id: string, toChange: UserChangeDto): Promise<UserModel> {
        const user = await this.userModel.findById(id)
        const hashedPassword = await bcrypt.hash(toChange.password, 4)
        const { password, ...userNoPassw } = toChange
        for(const key in toChange){
            user[key] = toChange[key]
        }
        await user.save()
        return user
    }
    async getTokens(user: User): Promise<Tokens> {
        const userf = (await this.findByUsername(user.username)).toObject()
        const toCookie = striper(privateAttributesWithoutPassword)(userf)
        return {
            refresh_token: this.jwtService.sign(toCookie, { expiresIn: this.refreshExpTime }),
            access_token: this.jwtService.sign(toCookie, { expiresIn: this.accessExpTime })
        }
    }

}

type Map<T> = {
    [Property in keyof T]?: T[Property]
}
    
type Credentials = { password: string, username: string } 