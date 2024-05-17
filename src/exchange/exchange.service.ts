import { Controller, Get, Injectable, Query, UseInterceptors } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiResponseProperty } from '@nestjs/swagger';
import axios from 'axios';
import { Token } from './model/Token';
import { Currency } from './model/Currency';
import { CurrencyMark } from 'src/positions/model/CurrencyMark';
import { InjectModel } from '@nestjs/mongoose';
import { date } from 'joi';
import { Model } from 'mongoose';



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


@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(CurrencyMark.name) private marksModel: Model<CurrencyMark>,
  ){
    this.setCurrencies()
    this.setTokens()
    this.setGlobal()

  }
  availableTokens: Token[] = []
  currencies: Currency[] = []
  currenciesMap = new Map<string, Currency>()
  tokensMap = new Map<string, Token>()
  global: Glob

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async setCurrencies() {
    const response = await axios.get('https://v6.exchangerate-api.com/v6/82ccc802c3969e6d757f5519/latest/USD')
    const data = response.data.conversion_rates;
    const exchangeRates = []
    const map = new Map<string, Currency>()
    for(const symbol in currencies){
      if(symbol in data){
        const cur = new Currency()
        cur.name = currencies[symbol]
        cur.symbol = symbol
        cur.exchangeRateToUsd = data[symbol]
        map.set(cur.symbol, cur)
        exchangeRates.push(cur)
      }
    }
    this.currenciesMap = map
    this.currencies = exchangeRates
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async setTokens(){
    const tokens = (await (axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"))).data;
    this.availableTokens = tokens
    for(const token of tokens){
      this.tokensMap.set(token.symbol, token)
    }
  }
  convertFromUSD(price: number, currency: string | undefined): [number, string] {
    if(!currency)return [price, "USD"]
    const converted = this.currencies.find((e)=>currency===e.symbol)?.exchangeRateToUsd * price
    if(converted){
      return [converted, currency]
    }else{
      return [price, "USD"]
    }
  }
  @Cron(CronExpression.EVERY_10_MINUTES)
  async setGlobal(){
    const res = (await axios.get("https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY=d1783754-3852-4484-8452-d5efef86a644")).data.data;
    const global: Glob = {} as Glob
    global.eth_dominance = res.eth_dominance
    global.btc_dominance = res.btc_dominance
    global.total_market_cap = res.quote.USD.total_market_cap
    global.total_volume_24h = res.quote.USD.total_volume_24h
    this.global = global
  }


  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateMarks(date: Date){
    const curMap = new Map<string, number>()
    const tokenMap = new Map<string, number>()
    this.availableTokens.forEach(v=>tokenMap.set(v.symbol, v.current_price))
    this.currencies.forEach(v=>curMap.set(v.symbol, v.exchangeRateToUsd))
    const mark = new CurrencyMark()
    mark.currencies = curMap
    mark.timestamp = date
    mark.tokens = tokenMap
    curMap.size && tokenMap.size && this.marksModel.create(mark)
  }
  async getMarks({ since, until }: { since?: string; until?: string }) {
    const query: any = {};
    if (since) {
      const sinceDate = new Date(since);
      query.timestamp = query.timestamp || {};
      query.timestamp.$gte = sinceDate;
    }
    if (until) {
      const untilDate = new Date(until);
      query.timestamp = query.timestamp || {};
      query.timestamp.$lte = untilDate;
    }
    return this.marksModel.find(query);
  }
  
}