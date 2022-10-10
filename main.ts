import { ServerOrganization } from './src/app';
import { UserRouter } from './src/controllers/user.controller';
import { DBConnect } from './src/dbconnection/db.connect';
import { LoggerService } from './src/logger/logger.service';

const Logger: LoggerService = new LoggerService();

// Describing the bootstrap method
async function bootstrap(): Promise<void> {
	const dbConnect = new DBConnect();
	const serverOrganization = new ServerOrganization(
		dbConnect,
		new UserRouter(dbConnect),
	);
	await serverOrganization.init();
}

bootstrap();

export { Logger };
