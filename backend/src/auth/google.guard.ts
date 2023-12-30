import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {}
