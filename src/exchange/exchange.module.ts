import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [ExchangeController],
  imports: [

  ]
})
export class ExchangeModule {}
