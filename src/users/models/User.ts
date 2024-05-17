import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiPropertyOptional, IntersectionType, OmitType, PickType , PartialType} from "@nestjs/swagger"
import { IsBoolean, IsEmail, IsISO8601, IsNumber, IsOptional, IsString, IsStrongPassword, Matches, Max, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { privateAttributesWithoutPassword } from "../../config/variables";




@Schema({ versionKey: false })
export class User{

    @MaxLength(25)
    @ApiProperty({type: String, maxLength: 25})
    @Prop({ type:  String, required: true, unique: true})
    @IsString()
    @Matches(/^[A-Za-z0-9]*$/)
    username: string

    @ApiPropertyOptional({ type: String })
    @Prop({ type: String, unique: true, required: false, sparse: true})
    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty({ type: String })
    _id: string

    @ApiProperty({type: Boolean})
    @IsBoolean()
    @Prop({ type: Boolean, default: false })
    blocked: boolean

    @ApiProperty({type: Boolean})
    @IsBoolean()
    @Prop({ type: Boolean, default: false })
    isAdmin: boolean

    @ApiProperty({type: Date})
    @Prop({ type: Date, default: () => new Date() })
    @IsISO8601()
    date_registered: Date


    @IsString()
    @Prop({ type: String, required: true })
    hashedPassword: string
    
    @ApiProperty({ type: Date })
    @IsISO8601()
    @Prop({ type: Date, default: () => new Date(0) })
    valid_since: Date

    @ApiPropertyOptional({ type: Number })
    @Prop({ type: Number, required: false, unique: false})
    @IsOptional()
    tgId?: number

    @Prop({ type: Number, required: false })
    tgPassword?: number


    @ApiProperty({ type: [String], required: false })
    @Prop({ type: [String], default: []})
    favoritePortfolios: string[]

}

export class UserSelfDTO extends OmitType(
    User,
    [...privateAttributesWithoutPassword] as const
    ) {}


export class UserPublicDTO extends OmitType(
    UserSelfDTO,
    [] as const
    ) {}

export class UserCreateDTO extends PickType(
    UserSelfDTO,
    ['username','email'] as const
    ) {

    @IsStrongPassword()
    @ApiProperty({ type: String})
    @IsString()
    @MaxLength(200)
    password: string

}

export class UserChangeDTO extends PartialType(UserCreateDTO){}
export class UserAdminCreateDTO extends IntersectionType(
    UserCreateDTO,
    OmitType(User, ['hashedPassword', '_id'])
) {}

export class UserLoginDTO extends PickType(
    UserCreateDTO,
    ['username', 'password'] as const
) {}

export class UserHashedDTO extends IntersectionType(
    PickType(User, ['hashedPassword']),
    OmitType(UserCreateDTO, ['password'])
    ) {}


export type UserModel = HydratedDocument<User>
export const UserScheme = SchemaFactory.createForClass(User);