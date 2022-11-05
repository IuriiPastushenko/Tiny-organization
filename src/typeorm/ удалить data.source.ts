import { DataSource } from 'typeorm';
import { Departments } from './entities/departments.entity';
import { Employees } from './entities/employees.entity';
import { Jobplaces } from './entities/jobplaces.entity';
import { Jobtitles } from './entities/jobtitles.entity';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: '17071707',
	database: 'tinyOrganization',
	synchronize: true,
	logging: true,
	entities: [Employees, Departments, Jobtitles, Jobplaces],
	subscribers: [],
	migrations: [],
});
