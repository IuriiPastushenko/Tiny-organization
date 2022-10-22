import { ServerOrganization } from './src/app';
import { UsersRouter } from './src/users/users.controller';
import { ServicesRouter } from './src/services/services.controller';
import { DBConnect } from './src/dbconnection/db.connects';
import { LoggerService } from './src/logger/logger.service';

const Logger: LoggerService = new LoggerService();
const dbConnect = new DBConnect();

// Describing the bootstrap method
async function bootstrap(): Promise<void> {
	const serverOrganization = new ServerOrganization(
		new UsersRouter(),
		new ServicesRouter(),
	);
	await serverOrganization.init();
}

bootstrap();

export { Logger, dbConnect };
