import { Router, Request, Response } from 'express';
import { dbConnect } from '../../main';
import { Logger } from '../../main';
import { authenticateToken } from '../midlleware/auth.middleware';
import { getWeather } from '../services/weather/weather_api_sevices';
import { IGetCoordinats } from './interfaces/services.interfaces';
import { IUserAuthenticate } from './interfaces/users.interfaces';

export class ServicesRouter {
	public router = Router();

	constructor() {
		this.servicesrouts();
	}

	servicesrouts(): void {
		this.router.get(
			'/weather/search',
			authenticateToken,
			async (req: Request & { user?: IUserAuthenticate }, res: Response) => {
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
					//res.sendStatus(201);
					res.status(201).json(resultWeather);
				} else {
					res.sendStatus(403);
				}
			},
		);
	}
}
