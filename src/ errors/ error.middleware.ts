import { HttpException } from './httpexception';
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../main';

export function errorMiddleware(
	err: Error | HttpException,
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	if (err instanceof HttpException) {
		const contentError = err.contentError;
		Logger.error(`Error ${err.statusCode}: ${contentError}\n${err.message}`);
		res.status(err.statusCode).json({
			'error cod': `${err.statusCode}`,
			'error description': `${err.contentError}`,
			'error from service': err.message,
		});
	} else {
		Logger.error(` Error 500: ${err.message}`);
		res.status(500).send({ error: err.message });
	}
}
