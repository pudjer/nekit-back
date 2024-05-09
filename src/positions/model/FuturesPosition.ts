import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "@nestjs/mongoose";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types"
import { IsString, IsNotEmpty, IsISO8601 } from "class-validator";
import { HydratedDocument } from "mongoose";


@Schema({versionKey: false})
export class FuturesPosition{

  @ApiProperty({ type: String })
  @Prop({ required: true })
  @IsString()
  portfolioId: string;


  @ApiProperty({ type: String })
  _id: string

  @ApiProperty({ type: String })
  @Prop({ required: true })
  @IsString()
  symbol: string;


  @ApiProperty({ type: Number })
  @Prop({ required: true })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ type: Number })
  @Prop({ required: true })
  @IsNotEmpty()
  margin: number;

  @ApiProperty({ type: Number })
  @Prop({ required: true, default: 1 })
  @IsNotEmpty()
  leverage: number;

  @ApiProperty({ type: Date })
  @Prop({ required: true, default: ()=> new Date() })
  @IsISO8601()
  timestamp: Date;

  @ApiProperty({ type: Number })
  @Prop({ required: true })
  @IsNotEmpty()
  initialPrice: number;

  @ApiProperty({ type: Number })
  @Prop({ required: false })
  @IsNotEmpty()
  stopLoss: number;

  @ApiProperty({ type: Number })
  @Prop({ required: false })
  @IsNotEmpty()
  takeProfit: number;
}


export class changeFuturesPositionDTO extends PartialType(OmitType(FuturesPosition, ['_id', 'portfolioId'])){}
export class FuturesPositionWithoutId extends OmitType(FuturesPosition, ['_id']){}
export type FuturesPositionModel = HydratedDocument<FuturesPosition>
export const FuturesPositionScheme = SchemaFactory.createForClass(FuturesPosition);