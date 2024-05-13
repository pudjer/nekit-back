import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeController],
  exports: [ExchangeController]
})
export class ExchangeModule {}
