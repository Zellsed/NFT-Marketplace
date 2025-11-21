import { Controller, Get, Param, Query } from '@nestjs/common';
import { NftDetailsService } from './nft-details.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('nft-details')
export class NftDetailsController {
  constructor(private readonly nftDetailsService: NftDetailsService) { }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @Get('bid-history/:id')
  async getBidHistory(@Param('id') id: any) {
    return await this.nftDetailsService.getBidHistory(id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @Get('provenance/:id')
  async getProvenance(@Param('id') id: any) {
    return await this.nftDetailsService.getProvenance(id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @Get('owner/:id')
  async getOwner(@Param('id') id: any) {
    return await this.nftDetailsService.getOwner(id);
  }
}
