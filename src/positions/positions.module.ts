import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FuturesPosition, FuturesPositionScheme } from './model/FuturesPosition';
import { SpotPosition, SpotPositionScheme } from './model/SpotPosition';
import { FuturesPositionService } from './futuresPosition.service';
import { FuturesPositionController } from './futuresPosition.controller';
import { SpotPositionController } from './spotPosition.controller';
import { SpotPositionService } from './SpotPosition.service';
import { PortfolioModule } from 'src/portfolio/portfolio.module';

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
      }
    ]),
    PortfolioModule
  ],
  providers: [ SpotPositionService, FuturesPositionService ],
  controllers: [SpotPositionController, FuturesPositionController ]
})
export class PositionsModule {}
