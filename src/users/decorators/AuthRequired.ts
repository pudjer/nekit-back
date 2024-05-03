import { UseGuards, applyDecorators } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../jwtAuth/jwt-auth.guard";

export const AuthRequired = applyDecorators(
    ApiCookieAuth('refresh_token'),
    UseGuards(JwtAuthGuard)
)