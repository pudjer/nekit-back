import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "@nestjs/mongoose";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types"
import { IsString, IsNotEmpty, IsISO8601, IsOptional } from "class-validator";
import { HydratedDocument } from "mongoose";


@Schema({versionKey: false})
export class FuturesPosition{

  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true })
  @IsString()
  portfolioId: string;


  @ApiProperty({ type: String })
  _id: string

  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true })
  @IsString()
  symbol: string;

  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true })
  currency: string;

  @ApiProperty({ type: Number, required: true })
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ type: Number, required: true })
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  margin: number;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: true, default: 1 })
  leverage: number;

  @ApiProperty({ type: Date, required: true })
  @Prop({ type: Date, required: true, default: ()=> new Date() })
  @IsISO8601()
  timestamp: Date;

  @ApiProperty({ type: Number, required: true })
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  initialPrice: number;

  @ApiProperty({ type: Number, required: true })
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  initialCurrencyPrice: number;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: false })
  stopLoss: number;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: false })
  takeProfit: number;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: false })
  exitPrice?: number;


  @ApiProperty({ type: Date, required: false })
  @Prop({ type: Date, required: false})
  @IsISO8601()
  @IsOptional()
  exitTimestamp?: Date;

}




export class changeFuturesPositionDTO extends PartialType(OmitType(FuturesPosition, ['_id', 'portfolioId'])){}
export class FuturesPositionWithoutId extends OmitType(FuturesPosition, ['_id']){}
export type FuturesPositionModel = HydratedDocument<FuturesPosition>
export const FuturesPositionScheme = SchemaFactory.createForClass(FuturesPosition);