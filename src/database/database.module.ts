import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Exchange])],
  providers: [DatabaseService],
  controllers: [DatabaseController]
})
export class DatabaseModule {}