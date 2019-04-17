import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exchange } from './exchange.entity';

@Injectable()
export class DatabaseService{
  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepo: Repository<Exchange>
  ){  }

  async create(ex:Exchange):Promise<Exchange>{
    return await this.exchangeRepo.save(ex);
  }

  async findOne(user:string, id:number):Promise<Exchange>{
    return await this.exchangeRepo.findOne({user, id})
  }

  async delete(user: string, id:number):Promise<Boolean>{
    const result = await this.exchangeRepo.delete({user,id});
    return result.affected > 0;
  }

  async update(id:number, apikey: string, apisecret: string):Promise<Boolean>{
    const exchange = await this.exchangeRepo.findOne(id);
    if(exchange == null)throw new Error("no exchange");
    exchange.apikey = apikey;
    exchange.secret = apisecret;
    const result = await this.exchangeRepo.update(id, exchange)
    return result.raw > 0
  }

  list():Promise<Exchange[]>{
    return this.exchangeRepo.find();
  }

  /**
   * list all by user
   * @param user user param
   */
  listByUser(user:string):Promise<Exchange[]>{
    return this.exchangeRepo.find({ user })
  }




}