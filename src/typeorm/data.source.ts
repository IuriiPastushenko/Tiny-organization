import { DataSource } from 'typeorm';
import { Employees } from './entities/employees.entity';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: '17071707',
	database: 'tinyOrganization',
	synchronize: true,
	logging: true,
	entities: [Employees],
	subscribers: [],
	migrations: [],
});
