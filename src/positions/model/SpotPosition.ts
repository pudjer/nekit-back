import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "@nestjs/mongoose";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types"
import { IsString, IsNotEmpty, IsISO8601 } from "class-validator";
import { HydratedDocument } from "mongoose";


@Schema({versionKey: false})
export class SpotPosition{
  @ApiProperty({ type: String })
  @Prop({ required: true })
  @IsString()
  userId: string;

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

  @ApiProperty({ type: Date })
  @Prop({ required: true, default: ()=> new Date() })
  @IsISO8601()
  typestamp: Date;

  @ApiProperty({ type: Number })
  @Prop({ required: true })
  @IsNotEmpty()
  initialPrice: number;

}
export class SpotPositionWithoutId extends OmitType(SpotPosition, ['_id']){}
export class changeSpotPositionDTO extends PartialType(OmitType(SpotPosition, ['_id', 'userId'])){}

export type SpotPositionModel = HydratedDocument<SpotPosition>
export const SpotPositionScheme = SchemaFactory.createForClass(SpotPosition);