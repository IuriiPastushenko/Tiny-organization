import express, { Express } from 'express';
import { UserRouter } from './controllers/user.controller';
import { DBConnect } from './dbconnection/db.connect';
import bodyParser from 'body-parser';
import { Logger } from '../main';

export class ServerOrganization {
	private app: Express;
	private port: number;
	private dbConnect: DBConnect;

	constructor(dbConnect: DBConnect, approuter: UserRouter) {
		this.app = express();
		this.port = 3000;
		this.dbConnect = dbConnect;
		this.appBodyParcer();
		this.routing(approuter);
	}

	// Processing Request Body
	private appBodyParcer(): void {
		this.app.use(bodyParser.json());
	}

	// Router
	private routing(userrouter: UserRouter): void {
		this.app.use('/', userrouter.router);
	}

	// Listen server
	async init(): Promise<void> {
		this.app.listen(this.port, async () => {
			Logger.log(`Server is started, PORT ${this.port}`);
			await Logger.write(Logger.dataForWrite);
		});
		await this.dbConnect.connection();
	}
}
