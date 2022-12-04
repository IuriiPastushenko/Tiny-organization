import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Logger } from '../../main';
import { IPlaceCoordinats } from '../services/weather/interfaces/place.coordinats.interface';
import { CoordinatsModel } from './models/coordinats.model';
import { IGetCoordinats } from '../services/weather/interfaces/getcoordinats.interface';
dotenv.config();

const MONGO_PATH = `mongodb+srv://upas:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/@${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`;

export class MongooseConnects {
  async initialize(): Promise<void> {
    try {
      await mongoose.connect(MONGO_PATH as string);
      Logger.log('Connection to BD(Mongoose) successful');
      await Logger.write(Logger.dataForWrite);
    } catch (err) {
      Logger.error('Error connection to DB(Mongoose)');
      await Logger.write(Logger.dataForWrite);
      throw err;
    }
  }

  async addCoordinats(inputData: IPlaceCoordinats): Promise<void> {
    const coordinatsForSave = new CoordinatsModel(inputData);
    await coordinatsForSave.save();
    Logger.log('Write to BD(Mongoose) successful');
  }

  async getCoordinats(inputData: string): Promise<IGetCoordinats | null> {
    const dataFromDB = await CoordinatsModel.findOne({ place: `${inputData}` });
    return {
      lat: dataFromDB?.lat,
      lon: dataFromDB?.lon,
    };
  }
}
