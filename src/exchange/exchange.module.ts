import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyMark, CurrencyMarkSchema } from 'src/positions/model/CurrencyMark';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CurrencyMark.name, schema: CurrencyMarkSchema }
    ])
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService]
})
export class ExchangeModule {}
