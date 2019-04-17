/**
 * exchange rest api
 */
import { Controller, Get, Param, CACHE_MANAGER, Inject, 
  Query, Request, Post, Body, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'
import * as ccxt from 'ccxt';
import { APIResult, ok, fail } from '../vms';
import { isNull } from 'src/utils';
import { ModuleRef } from '@nestjs/core';
import { CcxtService } from './ccxt.service';
import { ApiOperation } from '@nestjs/swagger';
const HttpsProxyAgent = require('https-proxy-agent');
import { Order } from './rest.interface'

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
    const proxy = process.env.PROXY ? process.env.PROXY : null
    const agent = proxy ? new HttpsProxyAgent(proxy) : null;
    ex =  new ccxt[config.name]({
        httpsAgent: agent, 
        apiKey: config.apikey, 
        secret: config.secret, 
        'verbose': false
    });
    await this.cacheManager.set(key, ex)
    return ex
  }

  @ApiOperation({ title: 'get markets' })
  @Get(':user/:id/markets')
  async markets(@Param("user") user: string ,@Param("id") id: number){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchMarkets()
    return ok(null, result)
  }

  @ApiOperation({ title: 'get orderbook of symbol' })
  @Get(':user/:id/orderBook')
  async orderBook(@Param("user") user: string ,@Param("id") id: number,
    @Query("symbol") symbol: string, @Query("limit") limit?: number){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchOrderBook(symbol, limit)
    return ok(null, result)
  }


  @ApiOperation({ title: 'get trades from symbol' })
  @Get(':user/:id/trades')
  async trades(@Param("user") user: string ,@Param("id") id: number,
    @Query("symbol") symbol: string, 
    @Query("since") since?: number, 
    @Query("limit") limit?: number){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchTrades(symbol, since, limit)
    return ok(null, result)
  }

  /**
   * get ticket 
   * @param user {string} user
   * @param id {number} exchange id
   * @param symbol {string} symbol from /markets api
   */
  @ApiOperation({ title: 'get ticker' })
  @Get(':user/:id/ticker')
  async ticker(@Param("user") user: string ,@Param("id") id: number,
    @Query("symbol") symbol: string){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchTicker(symbol)
    return ok(null, result)
  }

  /**
   * get all tickers
   * @param user {string} user
   * @param id {number} exchange id
   * @param symbols {string[]} all symbols from /markets api
   */
  @ApiOperation({ title: 'get all tickers' })
  @Post(':user/:id/tickers')
  async tickers(@Param("user") user: string ,@Param("id") id: number,
    @Body() symbols: string[]){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchTickers(symbols)
    return ok(null, result)
  }

  @ApiOperation({ title: 'get user balance' })
  @Get(':user/:id/balance')
  async balance(@Param("user") user: string ,@Param("id") id: number){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchBalance()
    return ok(null, result)
  }

  @ApiOperation({ title: 'get user orders' })
  @Get(':user/:id/orders')
  async orders(@Param("user") user: string ,@Param("id") id: number){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchOrders()
    return ok(null, result)
  }

  @ApiOperation({ title: 'get user open orders' })
  @Get(':user/:id/openorders')
  async openOrders(@Param("user") user: string ,@Param("id") id: number){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchOpenOrders()
    return ok(null, result)
  }

  @ApiOperation({ title: 'get user trades' })
  @Get(':user/:id/mytrades')
  async fetchMyTrades(@Param("user") user: string ,@Param("id") id: number,
    @Query("symbol") symbol: string,
    @Query("since") since?: number,
    @Query("limit") limit?: number
    ){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchMyTrades(symbol, since, limit)
    return ok(null, result)
  }

  @ApiOperation({ title: 'create order' })
  @Post(':user/:id/order')
  async createOrder(@Param("user") user: string ,@Param("id") id: number,
    @Body() order: Order
    ){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.createOrder(order.symbol, order.type, order.side, order.amount, order.price)
    return ok(null, result)
  }

  @ApiOperation({ title: 'cancel order' })
  @Delete(':user/:id/order/:orderid')
  async deleteOrder(@Param("user") user: string ,@Param("id") id: number,
    @Param("orderid") orderid: string,
    @Query("symbol") symbol?: string
    ){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.cancelOrder(orderid, symbol)
    return ok(null, result)
  }

  
  @ApiOperation({ title: 'get order detail' })
  @Get(':user/:id/order/:orderid')
  async orderDetail(@Param("user") user: string ,@Param("id") id: number,
    @Param("orderid") orderid: string,
    @Query("symbol") symbol?: string){
    const exchange = await this._getExchangeInstance(user,id)
    const result = await exchange.fetchOrder(orderid, symbol);
    return ok(null, result)
  }








  
}
