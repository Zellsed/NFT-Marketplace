import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { Request } from 'express';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('user-profile-details')
  async getUserProfile(@Query('account') account: any) {
    return await this.userProfileService.getUserProfile(account);
  }
}
