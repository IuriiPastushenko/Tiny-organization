import mongoose from 'mongoose';
import { IPlaceCoordinats } from '../../services/weather/interfaces/place.coordinats.interface';
const { Schema, model } = mongoose;

const CoordinatsSchema = new Schema<IPlaceCoordinats>({
  place: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

const CoordinatsModel = model<IPlaceCoordinats>('coordinats', CoordinatsSchema);
export { CoordinatsModel };
