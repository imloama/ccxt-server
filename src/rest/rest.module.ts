import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangesController } from './exchanges.controller'
import { CcxtService } from './ccxt.service'
import { DatabaseModule } from '../database/database.module'


@Module({
  imports: [DatabaseModule],
  controllers: [ExchangeController, ExchangesController],
  providers: [CcxtService]
})
export class RestModule{

}