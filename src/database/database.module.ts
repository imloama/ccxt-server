import { Module, Global, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

@Global()
@Module({
  imports: [CacheModule.register(),TypeOrmModule.forFeature([Exchange])],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService]
})
export class DatabaseModule {}