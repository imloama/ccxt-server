import { Controller, Get, Param, Post, Body, UseInterceptors, CacheInterceptor, Delete } from '@nestjs/common';
import { DatabaseService } from './database.service'
import { Exchange } from './exchange.entity';
import { APIResult, ok, fail } from '../vms';
import { exchanges } from 'ccxt';
import { isNull } from '../utils';

@UseInterceptors(CacheInterceptor)
@Controller('db')
export class DatabaseController {

  constructor(
    private readonly service:DatabaseService
  ){}

  /** 
   * all exchange names
   * @return String[]
   */
  // @Get('ex')
  // async list():Promise<APIResult>{
  //   const exchanges = await this.service.list()
  //   const names = exchanges.map(ex => {
  //     return {id: ex.id, name: ex.name, memo: ex.memo}
  //   })
  //   return ok(null, names)
  // }

  @Get('ex/:user')
  async listByUser(@Param("user") user: string):Promise<APIResult>{
    const exchanges = await this.service.listByUser(user);
    const names = exchanges.map(ex => {
      return {id: ex.id, name: ex.name, memo: ex.memo,
        enableRateLimit: ex.enableRateLimit}
    })
    return ok(null, names)
  }

  /**
   * create exchange
   * @param exchange Exchange exchange parameters
   */
  @Post('ex')
  async create(@Body() exchange: Exchange):Promise<APIResult> {
    // validate params
    if(isNull(exchange.name) || isNull(exchange.apikey) || isNull(exchange.secret)){
      return fail('request error')
    }
    if(!exchanges.includes(exchange.name)){
      return fail(`no exchange named: ${exchange.name}`)
    }
    console.log(exchange)
    const ex = await this.service.create(exchange);
    console.log(ex)
    return ok(null, {id: ex.id, name: ex.name, memo: ex.memo,
      enableRateLimit: ex.enableRateLimit})
  }

  @Get('ex/:user/:id')
  async getOne(@Param("user") user: string ,@Param("id") id: number):Promise<APIResult>{
    const ex = await this.service.findOne(user, id);
    return ok(null, {
      id: ex.id,
      name: ex.name,
      memo: ex.memo,
      enableRateLimit: ex.enableRateLimit
    })
  }
  @Delete('ex/:user/:id')
  async deleteOne(@Param("user") user: string ,@Param("id") id: number):Promise<APIResult>{
    const bool = await this.service.delete(user,id)
    return bool ? ok() : fail()
  }


}