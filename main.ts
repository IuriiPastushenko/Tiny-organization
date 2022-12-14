import { ServerOrganization } from './src/app';
import { UsersRouter } from './src/users/users.controller';
import { ServicesRouter } from './src/services/services.controller';
import { LoggerService } from './src/logger/logger.service';
import { TypeOrmConnects } from './src/typeorm/ typeorm.connects';
import { MongooseConnects } from './src/mongoose/mongoose.connects';

const Logger: LoggerService = new LoggerService();

const typeOrmConnects = new TypeOrmConnects();

const mongooseConnects = new MongooseConnects();

// Describing the bootstrap method
async function bootstrap(): Promise<void> {
  const serverOrganization = new ServerOrganization(
    new UsersRouter(),
    new ServicesRouter(),
  );
  await serverOrganization.init();
}

bootstrap();

export { Logger, typeOrmConnects, mongooseConnects };
