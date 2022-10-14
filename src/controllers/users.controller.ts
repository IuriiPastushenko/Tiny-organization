/* eslint-disable indent */
import { Router, Request, Response } from 'express';
import { dbConnect } from '../../main';
import { Logger } from '../../main';
import {
	IUser,
	IUserAuthenticate,
	IUserDepartment,
	IUserLogin,
} from './interfaces/users.interfaces';
import * as jwt from 'jsonwebtoken';
import { authenticateToken } from '../midlleware/auth.middleware';
import * as dotenv from 'dotenv';
dotenv.config();

export class UsersRouter {
	public router = Router();

	constructor() {
		this.usersrouts();
	}

	usersrouts(): void {
		// Registration
		this.router.post('/registration', async (req: Request, res: Response) => {
			const dataForDB: IUser = req.body;
			const resultWriteToDB = await dbConnect.userRegistrationWriteToDB(
				dataForDB,
			);
			if (resultWriteToDB === 'success') {
				Logger.log('Registration is sucessful');
				res.sendStatus(201);
			} else {
				Logger.error('Registration is not sucessful\n', resultWriteToDB);
				res.sendStatus(406);
			}
			res.sendStatus(201);
		});

		// Login
		this.router.post('/login', async (req: Request, res: Response) => {
			const dataForLogin: IUserLogin = req.body;
			const userFromDB = await dbConnect.userLoginExchangeDB(dataForLogin);
			if (typeof userFromDB !== 'string') {
				Logger.log('Login is sucessful');
				const userAuth: IUserAuthenticate = {
					id_employee: userFromDB.id_employee,
					department: userFromDB.department,
					jobtitle: userFromDB.jobtitle,
				};
				const token = jwt.sign(userAuth, 'process.env.TOKEN_SECRET as string', {
					expiresIn: '10h',
				});
				res.status(201).json({ userFromDB, token });
			} else {
				Logger.error('Login is not sucessful\n', userFromDB);
				res.sendStatus(401);
			}
			// }
		});

		// Return list of users
		this.router.get(
			'/list',
			authenticateToken,
			async (
				req: Request & { user?: IUserAuthenticate },
				res: Response,
			): Promise<void> => {
				const listusersFromDB = await dbConnect.listOfUssers(
					req.user as IUserAuthenticate,
				);
				if (typeof listusersFromDB !== 'string') {
					Logger.log('List of users');
					res.status(201).json(listusersFromDB);
				} else {
					Logger.error('List of users is not available\n', listusersFromDB);
					res.sendStatus(400);
				}
			},
		);

		// Change user's boss
		this.router.patch(
			'/changedepartment',
			authenticateToken,
			async (
				req: Request & { user?: IUserAuthenticate },
				res: Response,
			): Promise<void> => {
				const dataForDB: IUserDepartment = req.body;
				const resultWriteToDB = await dbConnect.userChangeBossWriteToDB(
					req.user as IUserAuthenticate,
					dataForDB,
				);
				if (resultWriteToDB === 'success') {
					Logger.log('Change user_s boss is sucessful');
					res.sendStatus(201);
				} else {
					Logger.error(
						'Change user_s boss is not sucessful\n',
						resultWriteToDB,
					);
					res.sendStatus(403);
				}
			},
		);
	}
}
