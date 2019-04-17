import { Controller, Get } from '@nestjs/common';
import { exchanges } from 'ccxt';
import { ok, fail } from '../vms'

@Controller('exchanges')
export class ExchangesController {
  constructor() {}

  @Get()
  all(){
    return ok(null, exchanges)
  }

  
}