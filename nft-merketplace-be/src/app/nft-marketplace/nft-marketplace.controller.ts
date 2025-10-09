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
import { createNFTDto } from './dto/createNft.dto';
import { updateNFTDto } from './dto/updateNft.dto';
// import { RolesGuardAdmin } from 'src/core/guard/rolesAdmin.guard';
import { Role } from 'src/core/decorators/roles.decorator';
import { Roles } from 'src/common/enum';
import { AdminJwtAuthGuard } from 'src/core/strategy/admin-jwt.strategy';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { buyNFTDto, resellNFTDto } from './dto/buyNft.dto';

@Controller('nft-marketplace')
export class NftMarketplaceController {
  constructor(private readonly nftMarketplaceService: NftMarketplaceService) {}

  @Get('all-nfts')
  async getAllNfts(@Req() req: Request, @Query() body: getNFTDto) {
    return await this.nftMarketplaceService.getAllNfts(req.requestTime, body);
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

  @Post('create-nft')
  @UseGuards(AuthGuard)
  async createNft(@Req() req: Request, @Body() body: createNFTDto) {
    return await this.nftMarketplaceService.createNft(req.user.id, body);
  }

  @Post('buy-nft')
  @UseGuards(AuthGuard)
  async buyNft(@Req() req: Request, @Body() body: buyNFTDto) {
    return await this.nftMarketplaceService.buyNft(req.user.id, body);
  }

  @Post('resell-nft')
  @UseGuards(AuthGuard)
  async resellNft(@Req() req: Request, @Body() body: resellNFTDto) {
    return await this.nftMarketplaceService.resellNft(req.user.id, body);
  }

  @Get('nft/:id')
  async getSingleNFT(@Param('id') id: number) {
    return await this.nftMarketplaceService.getSingleNFT(id);
  }

  @Patch('update-nft/:id')
  async updateNFT(@Param('id') id: number, @Body() body: updateNFTDto) {
    return await this.nftMarketplaceService.updateNFT(id, body);
  }

  @Delete('delete-nft/:id')
  @UseGuards(AdminJwtAuthGuard)
  @Role(Roles.ADMIN, Roles.GUIDE)
  async deleteNFT(@Param('id') id: number) {
    return await this.nftMarketplaceService.deleteNFT(id);
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
