import { MongooseModule } from "@nestjs/mongoose";
import { Portfolio, PortfolioScheme } from "./Portfolio";
import { Module } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { PortfolioController } from "./portfolio.controller";
import { ExchangeModule } from "src/exchange/exchange.module";
import { UserModule } from "src/users/users.module";

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Portfolio.name,
        schema: PortfolioScheme
      }
    ]),
    ExchangeModule,
    UserModule
  ],
  providers: [PortfolioService, PortfolioController],
  controllers: [PortfolioController],
  exports: [ PortfolioController, PortfolioService]
})
export class PortfolioModule {

  
}
