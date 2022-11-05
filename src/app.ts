import express, { Express } from 'express';
import { UsersRouter } from './users/users.controller';
import { ServicesRouter } from './services/services.controller';
import bodyParser from 'body-parser';
import { Logger, typeOrmConnects } from '../main';
import { dbConnect } from '../main';
import { errorMiddleware } from './ errors/ error.middleware';
import { TypeOrmConnects } from './typeorm/ typeorm.connects';

export class ServerOrganization {
	private app: Express;
	private port: number;

	constructor(usersrouter: UsersRouter, servicesrouter: ServicesRouter) {
		this.app = express();
		this.port = 3000;
		this.appBodyParcer();
		this.routingUser(usersrouter);
		this.routingServices(servicesrouter);
		this.errorMiddleware();
	}

	// Processing Request Body
	private appBodyParcer(): void {
		this.app.use(bodyParser.json());
	}

	// routerUsers
	private routingUser(usersrouter: UsersRouter): void {
		this.app.use('/users', usersrouter.router);
	}

	// routerServises
	private routingServices(servicesrouter: ServicesRouter): void {
		this.app.use('/services', servicesrouter.router);
	}

	// Error exeption
	private errorMiddleware(): void {
		this.app.use(errorMiddleware);
	}

	// Listen server
	async init(): Promise<void> {
		this.app.listen(this.port, async () => {
			Logger.log(`Server is started, PORT ${this.port}`);
			await Logger.write(Logger.dataForWrite);
		});
		//await dbConnect.connection();
		typeOrmConnects.initialize();
	}
}
