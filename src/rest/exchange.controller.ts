/**
 * exchange rest api
 */
import { Controller, Get, Param, CACHE_MANAGER, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'
import * as ccxt from 'ccxt';
import { APIResult, ok, fail } from '../vms';
import { isNull } from 'src/utils';
import { ModuleRef } from '@nestjs/core';
import { CcxtService } from './ccxt.service';

@Controller('ex')
export class ExchangeController{
  constructor(
    private readonly service: CcxtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: any,
  ) {
    this.dbService = this.service.getService()
  }
  private dbService: DatabaseService;

  async _getExchangeInstance(user: string, id: number):Promise<ccxt.Exchange>{
    const config = await this.dbService.findOne(user, id)
    const key = `${user}:${id}:${config.name}`
    let ex = await this.cacheManager.get(key);
    if(!isNull(ex))return ex;
    ex =  new ccxt[config.name]();
    await this.cacheManager.set(key, ex)
    return ex
  }

  @Get(':user/:id/markets')
  async markets(@Param("user") user: string ,@Param("id") id: number){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchMarkets()
    return ok(null, result)
  }


  
}
