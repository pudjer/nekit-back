import { ApiProperty } from "@nestjs/swagger"


export type Tokens = {

    access_token: string
    refresh_token: string
}
export class AccessToken{

    @ApiProperty({type: String})
    access_token: string

}