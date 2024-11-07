import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

@Schema()
class City {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lon: number;
}

const CitySchema = SchemaFactory.createForClass(City);

@Schema()
export class User {
  _id

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [CitySchema], default: [] })
  cities: Types.Array<City>;

  @Prop({ type: Object, default: { unit: 'imperial' } })
  settings: {
    unit: string;
  };
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
