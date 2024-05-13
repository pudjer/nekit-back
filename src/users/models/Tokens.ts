import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"


export type Tokens = {

    access_token: string
    refresh_token: string
}
export class AccessToken{

    @ApiProperty({type: String, required: true})
    access_token: string

    @ApiProperty({type: Boolean, required: false})
    tgrequired?: true
}

export class TgPassword{
    @ApiProperty({type: String, maxLength: 25})
    @IsString()
    username: string
    @ApiProperty({type: Number, required: true})
    tgPassword: number
}