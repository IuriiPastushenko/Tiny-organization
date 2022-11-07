import { Router, Request, Response, NextFunction } from 'express';
import { dbConnect, typeOrmConnects } from '../../main';
import { Logger } from '../../main';
import {
	IUser,
	IUserAuthenticate,
	IUserDepartment,
	IUserLogin,
} from './users.interfaces';
import * as jwt from 'jsonwebtoken';
import { authenticateToken } from '../midlleware/auth.middleware';
import * as dotenv from 'dotenv';
import { HttpException } from '../ errors/httpexception';
import { UserRegistrationDto } from './dto/user.registration.dto';
import { UserChangeDepartmentDto } from './dto/user.changedepartment.dto';
import { validationMiddleware } from '../midlleware/validate.middleware';
import { UserLoginDto } from './dto/user.login.dto';
import { TypeOrmConnects } from '../typeorm/ typeorm.connects';
dotenv.config();

export class UsersRouter {
	public router = Router();

	constructor() {
		this.usersrouts();
	}

	usersrouts(): void {
		// Registration
		this.router.post(
			'/registration',
			validationMiddleware(UserRegistrationDto),
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const dataForDB: IUser = req.body;
					//await dbConnect.userRegistrationWriteToDB(dataForDB);
					await typeOrmConnects.userRegistrationWriteToDB(dataForDB);
					Logger.log('Registration is sucessful');
					res.status(201).json('Registration is successful');
				} catch (err) {
					next(
						new HttpException(
							401,
							'Registration is not successful',
							err as string,
						),
					);
				}
			},
		);

		// Login
		this.router.post(
			'/login',
			validationMiddleware(UserLoginDto),
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const dataForLogin: IUserLogin = req.body;
					const userFromDB = await typeOrmConnects.userLoginExchangeDB(
						dataForLogin,
					);
					if (userFromDB) {
						Logger.log('Login is sucessful');
						const userAuth: IUserAuthenticate = {
							id_employee: userFromDB.id_employee,
							department: userFromDB.department,
							jobtitle: userFromDB.jobtitle,
						};
						const token = jwt.sign(
							userAuth,
							'process.env.TOKEN_SECRET as string',
							{
								expiresIn: '10h',
							},
						);
						res.status(201).json({ userFromDB, token });
					}
				} catch (err) {
					next(new HttpException(401, 'Unauthorized', err as string));
				}
			},
		);

		// Return list of users
		// this.router.get(
		// 	'/userslist',
		// 	authenticateToken,
		// 	async (
		// 		req: Request & { user?: IUserAuthenticate },
		// 		res: Response,
		// 		next: NextFunction,
		// 	): Promise<void> => {
		// 		try {
		// 			const listusersFromDB = await typeOrmConnects.listOfUssers(
		// 				req.user as IUserAuthenticate,
		// 			);
		// 			Logger.log('List of users');
		// 			res.status(201).json(listusersFromDB);
		// 		} catch (err) {
		// 			next(new HttpException(403, 'Token is not correct', err as string));
		// 		}
		// 	},
		// );

		// Change user's boss
		this.router.patch(
			'/changedepartment',
			authenticateToken,
			validationMiddleware(UserChangeDepartmentDto),
			async (
				req: Request & {
					user?: IUserAuthenticate;
				},
				res: Response,
				next: NextFunction,
			): Promise<void> => {
				try {
					const dataForDB: IUserDepartment = req.body;
					await dbConnect.userChangeBossWriteToDB(
						req.user as IUserAuthenticate,
						dataForDB,
					);
					Logger.log('Change user_s boss is sucessful');
					res.status(201).json('Change user_s boss is sucessful');
				} catch (err) {
					if (err instanceof Error) {
						next(
							new HttpException(
								403,
								err.message,
								'Change user_s boss is not sucessful',
							),
						);
					} else {
						throw 'Unknown type of error';
					}
				}
			},
		);

		this.router.post(
			'/testtypeorm',
			async (
				req: Request,
				res: Response,
				next: NextFunction,
			): Promise<void> => {
				const test = await typeOrmConnects.test2();
				console.log(test);
			},
		);
	}
}
