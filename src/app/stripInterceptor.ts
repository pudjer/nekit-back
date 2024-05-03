import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { DECORATORS } from "@nestjs/swagger/dist/constants"
import { map, tap } from "rxjs";
import { striper } from "../helpers/stripper";

@Injectable()
export class stripInterceptor implements NestInterceptor{
    constructor(private tostrip: readonly string[]){}
    intercept(context: ExecutionContext, next: CallHandler<any>){
        return next.handle().pipe(
            map(striper(this.tostrip))
            )
    }
}

