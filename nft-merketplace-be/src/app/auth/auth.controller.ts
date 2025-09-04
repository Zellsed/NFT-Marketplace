import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createAuthDto } from './dto/createAuth.dto';
import { loginAuthDto } from './dto/loginAuth.dto';
import { forgetPasswordDto } from './dto/forgetPassword.dto';
import { Request } from 'express';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { updatePasswordDto } from './dto/updatePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: createAuthDto) {
    return await this.authService.singup(body);
  }

  @Post('login')
  async login(@Body() body: loginAuthDto) {
    return await this.authService.login(body);
  }

  @Post('forget-password')
  async forgetPassword(@Req() req: Request, @Body() body: forgetPasswordDto) {
    return await this.authService.forgetPassword(req, body);
  }

  @Patch('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: resetPasswordDto,
  ) {
    return await this.authService.resetPassword(token, body);
  }

  @Patch('update-password')
  @UseGuards(AuthGuard)
  async updatePassword(@Req() req: Request, @Body() body: updatePasswordDto) {
    return await this.authService.updatePassword(req.user.id, body);
  }
}
