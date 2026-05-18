import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, StudioRegisterDto } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('studio-register')
  registerStudio(@Body() dto: StudioRegisterDto) {
    return this.authService.registerStudio(dto);
  }
}
