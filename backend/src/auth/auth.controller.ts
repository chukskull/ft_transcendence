import { Controller, Get, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator'


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
}
