import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiResponseProperty } from '@nestjs/swagger';
import { Token } from './model/Token';
import { Currency } from './model/Currency';
import { ExchangeService } from './exchange.service';



const currencies = {
  BTC: "Биткоин",
  ETH: "Эфириум",
  LTC: "Лайткоин",
  BCH: "Биткоин Кэш",
  BNB: "Binance Coin",
  EOS: "EOS",
  XRP: "Рипл",
  XLM: "Стеллар",
  LINK: "Chainlink",
  DOT: "Полка Дот",
  YFI: "Yearn.finance",
  USD: "Доллар США",
  AED: "Дирхам ОАЭ",
  ARS: "Аргентинское песо",
  AUD: "Австралийский доллар",
  BDT: "Бангладешская така",
  BHD: "Бахрейнский динар",
  BMD: "Бермудский доллар",
  BRL: "Бразильский реал",
  CAD: "Канадский доллар",
  CHF: "Швейцарский франк",
  CLP: "Чилийское песо",
  CNY: "Китайский юань",
  CZK: "Чешская крона",
  DKK: "Датская крона",
  EUR: "Евро",
  GBP: "Фунт стерлингов",
  GEL: "Грузинский лари",
  HKD: "Гонконгский доллар",
  HUF: "Венгерский форинт",
  IDR: "Индонезийская рупия",
  ILS: "Израильский шекель",
  INR: "Индийская рупия",
  JPY: "Японская иена",
  KRW: "Южнокорейская вона",
  KWD: "Кувейтский динар",
  LKR: "Шри-ланкийская рупия",
  MMK: "Мьянманский кьят",
  MXN: "Мексиканское песо",
  MYR: "Малайзийский ринггит",
  NGN: "Нигерийская найра",
  NOK: "Норвежская крона",
  NZD: "Новозеландский доллар",
  PHP: "Филиппинское песо",
  PKR: "Пакистанская рупия",
  PLN: "Польский злотый",
  RUB: "Российский рубль",
  SAR: "Саудовский риял",
  SEK: "Шведская крона",
  SGD: "Сингапурский доллар",
  THB: "Таиландский бат",
  TRY: "Турецкая лира",
  TWD: "Новый тайваньский доллар",
  UAH: "Украинская гривна",
  VEF: "Венесуэльский боливар",
  VND: "Вьетнамский донг",
  ZAR: "Южноафриканский рэнд",
  XDR: "СДР",
  XAG: "Серебро",
  XAU: "Золото",
}


type Glob = {
  "eth_dominance": number,
  "btc_dominance": number,
  "total_market_cap": number,
  "total_volume_24h": number,
}
@Controller('exchange')
export class ExchangeController {
  constructor(
    private exchangeService: ExchangeService,
  ){  }
  @Get('currencies')
  @ApiResponseProperty({type: [Currency]})
  async getAvailableCurrencies(): Promise<Currency[]> {
    return this.exchangeService.currencies
  }

  @Get('tokens')
  @ApiResponseProperty({type: [Token]})
  async getAvailableTokens(): Promise<Token[]> {
    return this.exchangeService.availableTokens
  }

  
  @Get("global")
  async getGlobal(){
    //d1783754-3852-4484-8452-d5efef86a644
    return this.exchangeService.global
  }


  @Get("marks")
  @ApiQuery({
    name: "since",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "until",
    type: String,
    required: false
  })
  async getMarks(@Query('since') since?: string, @Query('until') until?: string) {
    return await this.exchangeService.getMarks({ since, until });
  }
 
}