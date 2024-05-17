import { Injectable } from "@nestjs/common";
import { PortfolioService } from "src/portfolio/portfolio.service";
import { FuturesPositionService } from "./futuresPosition.service";
import { SpotPositionService } from "./SpotPosition.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ExchangeService } from "src/exchange/exchange.service";

@Injectable()
export class PositionService {
  constructor(
  ){}
}