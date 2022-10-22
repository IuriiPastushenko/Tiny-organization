import { Router, Request, Response, NextFunction } from 'express';
import { HttpException } from '../ errors/httpexception';
import { dbConnect } from '../../main';
import { Logger } from '../../main';
import { authenticateToken } from '../midlleware/auth.middleware';
import { getWeather } from './weather/weather_api_sevices';
import { IGetCoordinats } from './services.interfaces';
import { IUserAuthenticate } from '../users/users.interfaces';
import { WeatherDto } from './weather/dto/weather.dto';
import { validationMiddleware } from '../midlleware/validate.middleware';

export class ServicesRouter {
	public router = Router();

	constructor() {
		this.servicesrouts();
	}

	servicesrouts(): void {
		this.router.get(
			'/weather/search',
			authenticateToken,
			//validationMiddleware(WeatherDto),
			async (
				req: Request & { user?: IUserAuthenticate },
				res: Response,
				next: NextFunction,
			) => {
				try {
					const place = req.query.place as string;
					const dataFromDB = await dbConnect.dbGetCoordinats(
						place,
						req.user as IUserAuthenticate,
					);
					if (dataFromDB && dataFromDB.length !== 0) {
						const resultWeather = await getWeather(
							dataFromDB as unknown as IGetCoordinats,
							place,
						);
						Logger.log('Weather is received');
						res.status(201).json(resultWeather);
					} else {
						throw Error('Jobplace is undifined');
					}
				} catch (err) {
					if (err instanceof Error) {
						next(new HttpException(401, err.message, 'Error service'));
					}
				}
			},
		);
	}
}
