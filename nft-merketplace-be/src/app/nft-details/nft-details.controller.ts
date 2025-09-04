import { Controller, Get, Query } from '@nestjs/common';
import { NftDetailsService } from './nft-details.service';

@Controller('nft-details')
export class NftDetailsController {
  constructor(private readonly nftDetailsService: NftDetailsService) {}

  @Get('bid-history')
  async getBidHistory(@Query('id') id: any) {
    return await this.nftDetailsService.getBidHistory(id);
  }

  @Get('provenance')
  async getProvenance(@Query('id') id: any) {
    return await this.nftDetailsService.getProvenance(id);
  }

  @Get('owner')
  async getOwner(@Query('id') id: any) {
    return await this.nftDetailsService.getOwner(id);
  }
}
