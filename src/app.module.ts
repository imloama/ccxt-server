import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestModule } from './rest/rest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forRoot(), DatabaseModule, RestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
