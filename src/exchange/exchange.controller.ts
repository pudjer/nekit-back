import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiResponseProperty } from '@nestjs/swagger';
import axios from 'axios';
import { Token } from './model/Token';
import { Currency } from './model/Currency';



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



@Controller('exchange')
export class ExchangeController {
  constructor(){
    this.setRates()
    this.setTokens()
  }
  availableTokens: Token[] = []
  exchangeRates: Currency[] = []
  @Get('currencies')
  @ApiResponseProperty({type: [Currency]})
  async getAvailableCurrencies(): Promise<Currency[]> {
    return this.exchangeRates
  }

  @Get('tokens')
  @ApiResponseProperty({type: [Token]})
  async getAvailableTokens(): Promise<Token[]> {
    return this.availableTokens
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async setRates() {
    const response = await axios.get('https://v6.exchangerate-api.com/v6/82ccc802c3969e6d757f5519/latest/USD')
    const data = response.data.conversion_rates;
    const exchangeRates = []
    for(const name in currencies){
      if(name in data){
        const cur = new Currency()
        cur.name = currencies[name]
        cur.symbol = name
        cur.exchangeRateToUsd = data[name]
        exchangeRates.push(cur)
      }
    }
    this.exchangeRates = exchangeRates
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async setTokens(){
    this.availableTokens = (await (axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"))).data;
  }
}