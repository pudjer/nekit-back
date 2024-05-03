import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthRequired } from "../decorators/AuthRequired";
import { AdminGuard } from "./AdminGuard";

export const AdminRequired = applyDecorators(
  AuthRequired,
  UseGuards(AdminGuard)
)