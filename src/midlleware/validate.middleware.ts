import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpException } from '../ errors/httpexception';

function validationMiddleware<T>(type: any): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) => {
		validate(plainToInstance(type, req.body)).then(
			(errors: ValidationError[]) => {
				if (errors.length > 0) {
					const message = errors
						.map((error: ValidationError) =>
							Object.values(error.constraints as unknown as string),
						)
						.join(', ');
					next(new HttpException(422, message, 'input data is not correct'));
				} else {
					next();
				}
			},
		);
	};
}

export { validationMiddleware };
