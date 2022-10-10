/* eslint-disable indent */
import { Router, Request, Response } from 'express';
import { DBConnect } from '../dbconnection/db.connect';
import { Logger } from '../../main';
import {
	IUser,
	IUserAuthenticate,
	IUserDepartment,
	IUserLogin,
} from './user.interface';
import * as jwt from 'jsonwebtoken';
import { authenticateToken } from '../midlleware/auth.middleware';
import * as dotenv from 'dotenv';
dotenv.config();

export class UserRouter {
	public router = Router();
	private dbConnect: DBConnect;

	constructor(dbConnect: DBConnect) {
		this.dbConnect = dbConnect;
		this.usersrouts();
	}

	// Routing users

	// Registration
	usersrouts(): void {
		this.router.post(
			'/users/registration',
			async (req: Request, res: Response) => {
				const dataForDB: IUser = req.body;
				const resultWriteToDB = await this.dbConnect.userRegistrationWriteToDB(
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
			},
		);

		// Login
		this.router.post('/users/login', async (req: Request, res: Response) => {
			const dataForLogin: IUserLogin = req.body;
			const userFromDB = await this.dbConnect.userLoginExchangeDB(dataForLogin);
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
			'/users/list',
			authenticateToken,
			async (
				req: Request & { user?: IUserAuthenticate },
				res: Response,
			): Promise<void> => {
				const listusersFromDB = await this.dbConnect.listOfUssers(
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
			'/users/changedepartment',
			authenticateToken,
			async (
				req: Request & { user?: IUserAuthenticate },
				res: Response,
			): Promise<void> => {
				const dataForDB: IUserDepartment = req.body;
				const resultWriteToDB = await this.dbConnect.userChangeBossWriteToDB(
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
