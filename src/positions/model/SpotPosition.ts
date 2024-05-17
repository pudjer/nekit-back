import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "@nestjs/mongoose";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types"
import { IsString, IsNotEmpty, IsISO8601, IsOptional } from "class-validator";
import { HydratedDocument } from "mongoose";


@Schema({versionKey: false})
export class SpotPosition{
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  @IsString()
  portfolioId: string;


  @ApiProperty({ type: String })
  _id: string

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  @IsString()
  symbol: string;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, required: true, default: ()=> new Date() })
  @IsISO8601()
  timestamp: Date;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  initialPrice: number;

  

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: false })
  exitPrice?: number;


  @ApiProperty({ type: Date, required: false })
  @Prop({ type: Date, required: false})
  @IsISO8601()
  @IsOptional()
  exitTimestamp?: Date;

}
export class SpotPositionWithoutId extends OmitType(SpotPosition, ['_id']){}
export class changeSpotPositionDTO extends PartialType(OmitType(SpotPosition, ['_id', 'portfolioId'])){}

export type SpotPositionModel = HydratedDocument<SpotPosition>
export const SpotPositionScheme = SchemaFactory.createForClass(SpotPosition);