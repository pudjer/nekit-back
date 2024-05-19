import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class ValueMark{
  @ApiProperty({ type: Date })
  @Prop({ type: ()=>Date, default: ()=> new Date() })
  timestamp: Date;

  @ApiProperty({ type: Number })
  @Prop({ type: ()=>Number, required: false })
  value: number;

}