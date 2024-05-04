import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FuturesPosition, FuturesPositionScheme } from './model/FuturesPosition';
import { SpotPosition, SpotPositionScheme } from './model/SpotPosition';
import { FuturesPositionService } from './futuresPosition.service';
import { SpotPositionService } from './spotPosition.service';

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
  ],
  providers: [FuturesPositionService, SpotPositionService]
})
export class PositionsModule {

  
}
