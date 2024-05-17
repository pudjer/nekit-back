import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FuturesPosition, FuturesPositionScheme } from './model/FuturesPosition';
import { SpotPosition, SpotPositionScheme } from './model/SpotPosition';
import { FuturesPositionService } from './futuresPosition.service';
import { FuturesPositionController } from './futuresPosition.controller';
import { SpotPositionController } from './spotPosition.controller';
import { SpotPositionService } from './SpotPosition.service';
import { PortfolioModule } from 'src/portfolio/portfolio.module';
import { ExchangeModule } from 'src/exchange/exchange.module';
import { UserModule } from 'src/users/users.module';
import { CurrencyMark, CurrencyMarkSchema } from './model/CurrencyMark';
import { PositionService } from './positions.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: FuturesPosition.name,
        schema: FuturesPositionScheme
      },
      {
        name: SpotPosition.name,
        schema: SpotPositionScheme
      },
      
    ]),
    PortfolioModule,
    ExchangeModule,
    UserModule,
  ],
  providers: [ SpotPositionService, FuturesPositionService, PositionService ],
  controllers: [SpotPositionController, FuturesPositionController ]
})
export class PositionsModule {}
