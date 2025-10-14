import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

class RegisterDto {
  username!: string;
  email!: string;
  password!: string;
  branchName!: string;
  branchLocation!: string;
}

class LoginDto {
  username!: string; // or email
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
