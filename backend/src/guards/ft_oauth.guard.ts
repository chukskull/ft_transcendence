import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthStrategy } from 'src/auth/auth.strategy';

@Injectable()
export class FtOauthGuard extends AuthGuard('42') {
  // constructor( )
}