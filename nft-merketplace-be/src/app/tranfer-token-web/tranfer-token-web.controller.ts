import { Controller, Get } from '@nestjs/common';
import { TranferTokenWebService } from './tranfer-token-web.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('tranfer-token-web')
export class TranferTokenWebController {
  constructor(private readonly tranferTokenWebService: TranferTokenWebService) { }

  @ApiBearerAuth()
  @Get('history')
  async getTranferTokenWebHistory() {
    return this.tranferTokenWebService.getTranferTokenWebHistory();
  }
}
