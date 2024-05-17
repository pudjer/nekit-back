import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';


@Schema()
export class CurrencyMark {
  @ApiProperty({ type: Date })
  @Prop({ type: ()=>Date, default: ()=> new Date() })
  timestamp: Date;

  
  @Prop({ type: Map, of: Number })
  currencies: Map<string, number>;

    
  @Prop({ type: Map, of: Number })
  tokens: Map<string, number>;
}
export type CurrencyMarkModel = HydratedDocument<CurrencyMark>
export const CurrencyMarkSchema = SchemaFactory.createForClass(CurrencyMark);