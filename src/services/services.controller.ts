import { Router, Request, Response, NextFunction } from 'express';
import { HttpException } from '../errors/httpexception';
import { mongooseConnects, typeOrmConnects } from '../../main';
import { Logger } from '../../main';
import { authenticateToken } from '../midlleware/auth.middleware';
import { getWeather } from './weather/weather_api_sevices';
import { IUserAuthenticate } from '../users/users.interfaces';
import { WeatherDto } from './weather/dto/weather.dto';
import { validationMiddleware } from '../midlleware/validate.middleware';
import { CoordinatsDto } from './weather/dto/coordinats.dto';
import { IPlaceCoordinats } from './weather/interfaces/place.coordinats.interface';
import { Long } from 'typeorm';
import { IGetCoordinats } from './weather/interfaces/getcoordinats.interface';

export class ServicesRouter {
  public router = Router();

  constructor() {
    this.servicesrouts();
  }

  servicesrouts(): void {
    this.router.get(
      '/weather/search',
      authenticateToken,
      validationMiddleware(WeatherDto),
      async (
        req: Request & { user?: IUserAuthenticate },
        res: Response,
        next: NextFunction,
      ) => {
        try {
          const place = req.query.place as string;
          const dataFromDB = await typeOrmConnects.dbGetCoordinats(
            place,
            req.user as IUserAuthenticate,
          );
          if (dataFromDB && dataFromDB.length !== 0) {
            const resultWeather = await getWeather(dataFromDB[0], place);
            Logger.log('Weather is received');
            res.status(201).json(resultWeather);
          } else {
            throw Error('Jobplace is undefined');
          }
        } catch (err) {
          next(new HttpException(401, 'Error service', err as string));
        }
      },
    );

    this.router.post(
      '/weather/write',
      authenticateToken,
      validationMiddleware(CoordinatsDto),
      async (
        req: Request & { user?: IUserAuthenticate },
        res: Response,
        next: NextFunction,
      ) => {
        try {
          const dataForDB: IPlaceCoordinats = req.body;
          await mongooseConnects.addCoordinats(dataForDB);
          res.status(201).json('Write to BD(Mongoose) successful');
        } catch (err) {
          next(
            new HttpException(401, 'Error write to DB(MongoDB)', err as string),
          );
        }
      },
    );

    this.router.get(
      '/weather/searchnew',
      authenticateToken,
      validationMiddleware(WeatherDto),
      async (
        req: Request & { user?: IUserAuthenticate },
        res: Response,
        next: NextFunction,
      ) => {
        try {
          const place = req.query.place as string;
          const dataFromMongo = await mongooseConnects.getCoordinats(place);
          const dataFromPostgreSQL = await typeOrmConnects.getEmployee(
            req.user as IUserAuthenticate,
          );
          const dataFromDB: IGetCoordinats = {
            lat: dataFromMongo?.lat,
            lon: dataFromMongo?.lon,
            firstname: dataFromPostgreSQL?.firstname,
            lastname: dataFromPostgreSQL?.lastname,
          };
          if (dataFromDB && Object.keys(dataFromDB).length === 4) {
            const resultWeather = await getWeather(dataFromDB, place);
            Logger.log('Weather is received');
            res.status(201).json(resultWeather);
          } else {
            throw Error('Jobplace or employee is undefined');
          }
        } catch (err) {
          next(new HttpException(401, 'Error service', err as string));
        }
      },
    );
  }
}
