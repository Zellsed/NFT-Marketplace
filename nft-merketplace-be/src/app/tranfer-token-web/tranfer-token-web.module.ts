import { Module } from '@nestjs/common';
import { TranferTokenWebService } from './tranfer-token-web.service';

@Module({
  providers: [TranferTokenWebService]
})
export class TranferTokenWebModule { }
