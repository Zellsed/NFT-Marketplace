import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { Request } from 'express';
import { likeUserDto } from './dto/likeUser.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('like-user')
  @UseGuards(AuthGuard)
  async likeNft(@Req() req: Request, @Body() body: likeUserDto) {
    return await this.likeService.likeNft(req.user.id, Number(body.nftId));
  }

  @Get('like-status')
  @UseGuards(AuthGuard)
  async likeStatus(@Req() req: Request, @Query('id') id: any) {
    return await this.likeService.likeStatus(req.user.id, id);
  }

  @Get('nft-likes')
  async getNftLikes(@Query('id') id: any) {
    return await this.likeService.getNftLikes(id);
  }

  @Get('list-nft-like')
  @UseGuards(AuthGuard)
  async getListNftLike(@Req() req: Request) {
    return await this.likeService.getListNftLike(req.user.id);
  }
}
