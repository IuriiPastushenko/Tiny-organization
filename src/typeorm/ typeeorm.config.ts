import { DataSourceOptions } from 'typeorm';
import { Departments } from './entities/departments.entity';
import { Employees } from './entities/employees.entity';
import { Jobplaces } from './entities/jobplaces.entity';
import { Jobtitles } from './entities/jobtitles.entity';

export const typeOrmConfig: DataSourceOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: '17071707',
	database: 'tinyOrganization',
	synchronize: false,
	logging: true,
	entities: [Employees, Departments, Jobtitles, Jobplaces],
	subscribers: [],
	migrations: [],
};
