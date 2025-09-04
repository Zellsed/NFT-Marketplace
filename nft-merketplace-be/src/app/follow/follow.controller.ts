import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { Request } from 'express';
import { FollowDto } from './dto/follow.dto';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow-user')
  @UseGuards(AuthGuard)
  async followUser(@Req() req: Request, @Body() accountFollowing: FollowDto) {
    return await this.followService.followUser(req.user.id, accountFollowing);
  }

  @Get('follow-status')
  @UseGuards(AuthGuard)
  async followStatus(@Req() req: Request, @Query('account') account: any) {
    return await this.followService.followStatus(req.user.id, account);
  }

  @Get('list-following')
  @UseGuards(AuthGuard)
  async getListFollow(@Req() req: Request) {
    return await this.followService.getListFollow(req.user.id);
  }

  @Get('list-follower')
  @UseGuards(AuthGuard)
  async getListFollower(@Req() req: Request) {
    return await this.followService.getListFollower(req.user.id);
  }
}
