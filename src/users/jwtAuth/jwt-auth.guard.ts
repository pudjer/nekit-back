import {ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}