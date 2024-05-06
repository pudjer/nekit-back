import { MongooseModule } from "@nestjs/mongoose";
import { Portfolio, PortfolioScheme } from "./Portfolio";
import { Module } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { PortfolioController } from "./portfolio.controller";

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Portfolio.name,
        schema: PortfolioScheme
      }
    ]),
  ],
  providers: [PortfolioService, PortfolioController],
  controllers: [PortfolioController],
  exports: [ PortfolioController]
})
export class PortfolioModule {

  
}
