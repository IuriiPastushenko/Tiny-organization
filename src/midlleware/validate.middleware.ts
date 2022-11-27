import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpException } from '../errors/httpexception';

// Validate input data

function validationMiddleware<T>(type: any): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    let typeFromReq;
    if (req.method === 'GET') {
      typeFromReq = req.query;
    }
    if (req.method === 'POST' || req.method === 'PATCH') {
      typeFromReq = req.body;
    }
    validate(plainToInstance(type, typeFromReq)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) =>
              Object.values(error.constraints as unknown as string),
            )
            .join(', ');
          next(new HttpException(400, message, 'input data is not correct'));
        } else {
          next();
        }
      },
    );
  };
}

export { validationMiddleware };
