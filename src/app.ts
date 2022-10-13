import express, { Express } from 'express';
import { UsersRouter } from './controllers/users.controller';
import { ServicesRouter } from './controllers/services.controller';
import bodyParser from 'body-parser';
import { Logger } from '../main';
import { dbConnect } from '../main';

export class ServerOrganization {
	private app: Express;
	private port: number;

	constructor(usersrouter: UsersRouter, servicesrouter: ServicesRouter) {
		this.app = express();
		this.port = 3000;
		this.appBodyParcer();
		this.routingUser(usersrouter);
		this.routingServices(servicesrouter);
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

	// Listen server
	async init(): Promise<void> {
		this.app.listen(this.port, async () => {
			Logger.log(`Server is started, PORT ${this.port}`);
			await Logger.write(Logger.dataForWrite);
		});
		await dbConnect.connection();
	}
}
