import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "@nestjs/mongoose";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsISO8601 } from "class-validator";
import { HydratedDocument } from "mongoose";


@Schema({versionKey: false})
export class Portfolio{

  @ApiProperty({ type: String })
  @Prop({ required: true })
  @IsString()
  userId: string


  @ApiProperty({ type: String })
  _id: string


  @ApiProperty({ type: String, required: false })
  @Prop({ default: '' })
  @IsString()
  description: string = ''

  @ApiProperty({ type: String, required: true })
  @Prop({ required: true })
  @IsString()
  name: string

}

export class PortfolioCreateDTO extends OmitType(Portfolio, ['_id']){}
export class PortfolioChangeDTO extends OmitType(Portfolio, ['_id', 'userId']){}

export type PortfolioModel = HydratedDocument<Portfolio>
export const PortfolioScheme = SchemaFactory.createForClass(Portfolio);