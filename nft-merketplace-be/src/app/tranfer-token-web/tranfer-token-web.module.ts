import { Module } from '@nestjs/common';
import { TranferTokenWebService } from './tranfer-token-web.service';
import { TranferTokenWebListenerService } from './tranfer-token-web-listener.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranferTokenWebEntity } from 'src/core/lib/database/entities';
import { TranferTokenWebController } from './tranfer-token-web.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TranferTokenWebEntity])],
  providers: [TranferTokenWebService, TranferTokenWebListenerService],
  controllers: [TranferTokenWebController]
})
export class TranferTokenWebModule { }
