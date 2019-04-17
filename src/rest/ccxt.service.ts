import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CcxtService {
  constructor(
    private readonly service:DatabaseService
  ){}

  getService(){
    return this.service;
  }

}
