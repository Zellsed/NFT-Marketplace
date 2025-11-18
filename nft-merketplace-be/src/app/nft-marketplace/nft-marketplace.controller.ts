import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NftMarketplaceService } from './nft-marketplace.service';
import { Request } from 'express';
import { getNFTDto } from './dto/getNft.dto';
import { Role } from 'src/core/decorators/roles.decorator';
import { Roles } from 'src/common/enum';
import { AdminJwtAuthGuard } from 'src/core/strategy/admin-jwt.strategy';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('nft-marketplace')
export class NftMarketplaceController {
  constructor(private readonly nftMarketplaceService: NftMarketplaceService) { }

  @ApiBearerAuth()
  @Get('all-nft-marketplace')
  async getAllNfts(@Req() req: Request, @Query() body: getNFTDto) {
    return await this.nftMarketplaceService.getAllNfts(req.requestTime, body);
  }

  @ApiBearerAuth()
  @Get('slider-data')
  async getSliderData(@Req() req: Request) {
    return await this.nftMarketplaceService.getSliderData(req.requestTime);
  }

  @Get('total-transaction-marketplace-all')
  async getTotalTransactionMarketplaceAll() {
    return await this.nftMarketplaceService.getTotalTransactionMarketplaceAll();
  }

  @Get('nfts')
  async getListNfts(@Req() req: Request, @Query() body: getNFTDto) {
    return await this.nftMarketplaceService.getListNfts(req.requestTime, body);
  }

  @Get('top-5-nfts')
  async getTop5Nfts() {
    const page = 1;
    const limit = 5;
    const sort = '-ratingsAverage,price';
    const body = { page, limit, sort };

    return await this.nftMarketplaceService.getAllNfts(null, body);
  }

  @Get('nft-stats')
  async getNftStats() {
    return await this.nftMarketplaceService.getNftStats();
  }

  @Get('nft/:id')
  async getSingleNFT(@Param('id') id: number) {
    return await this.nftMarketplaceService.getSingleNFT(id);
  }

  @Get('monthly-plan/:year')
  async getMonthlyPlan(@Param('year') year: number) {
    return await this.nftMarketplaceService.getMonthlyPlan(year);
  }

  @Get('category-nft')
  async getCategoryNFT() {
    return await this.nftMarketplaceService.getCategoryNFT();
  }

  @Get('top-creators')
  async getTopCreators() {
    return await this.nftMarketplaceService.getTopCreatorsByTotalSales();
  }

  @Get('user-nft')
  async getUserNft(@Query('id') id: any) {
    return await this.nftMarketplaceService.getUserNft(Number(id));
  }
}
