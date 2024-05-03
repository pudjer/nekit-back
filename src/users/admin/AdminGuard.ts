import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Assuming you have a property like 'isAdmin' on your user object
    const isAdmin = request.user.isAdmin;

    if (!isAdmin) {
      throw new UnauthorizedException('You are not authorized as an admin');
    }

    return true;
  }
}