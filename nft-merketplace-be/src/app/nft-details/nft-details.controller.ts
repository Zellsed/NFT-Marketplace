import { Controller, Get, Param, Query } from '@nestjs/common';
import { NftDetailsService } from './nft-details.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('nft-details')
export class NftDetailsController {
  constructor(private readonly nftDetailsService: NftDetailsService) { }

  @ApiParam({ name: 'id', type: String })
  @Get('bid-history/:id')
  async getBidHistory(@Param('id') id: any) {
    return await this.nftDetailsService.getBidHistory(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('bid-history-nft1155/:id')
  async getBidHistorynft1155(@Param('id') id: any) {
    console.log('id', id);
    return await this.nftDetailsService.getBidHistorynft1155(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('provenance/:id')
  async getProvenance(@Param('id') id: any) {
    return await this.nftDetailsService.getProvenance(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('provenance-nft1155/:id')
  async getProvenanceNFT1155(@Param('id') id: any) {
    console.log('id', id);
    return await this.nftDetailsService.getProvenanceNFT1155(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('owner/:id')
  async getOwner(@Param('id') id: any) {
    return await this.nftDetailsService.getOwner(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('owner-nft1155/:id')
  async getOwnerNFT1155(@Param('id') id: any) {
    return await this.nftDetailsService.getOwnerNFT1155(id);
  }
}
