import { Request, Response, NextFunction } from 'express';
import { IUserAuthenticate } from '../users/users.interfaces';
import { Logger } from '../../main';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

// middleware function for authentication
export function authenticateToken(
	req: Request & { user?: IUserAuthenticate },
	res: Response,
	next: NextFunction,
): number | IUserAuthenticate | any {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) {
		Logger.error('Token is empty');
		return res.sendStatus(401);
	}
	jwt.verify(
		token,
		'process.env.TOKEN_SECRET as string',
		(err, user: IUserAuthenticate | any) => {
			if (!err) {
				req.user = user;
			}
			next();
		},
	);
}
