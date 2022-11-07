import { DataSource } from 'typeorm';
import { HttpException } from '../ errors/httpexception';
import { Logger } from '../../main';
import {
	IUser,
	IUserAuthenticate,
	IUserLogin,
} from '../users/users.interfaces';
import { typeOrmConfig } from './ typeeorm.config';
import { Departments } from './entities/departments.entity';
import { Employees } from './entities/employees.entity';
import bcrypt from 'bcryptjs';

export class TypeOrmConnects {
	private dataSource: DataSource;
	constructor() {
		this.dataSource = new DataSource(typeOrmConfig);
	}

	// Connection to DB
	async initialize(): Promise<void> {
		try {
			await this.dataSource.initialize();
			Logger.log('Connection to BD(TypeORM) successful');
			await Logger.write(Logger.dataForWrite);
		} catch (err) {
			Logger.error('Error connection to DB');
			await Logger.write(Logger.dataForWrite);
			throw err;
		}
	}

	async test(): Promise<any> {
		return this.dataSource
			.getRepository(Departments)
			.find({ where: { id_department: 1 } });
	}

	// Write to BD table employees
	async userRegistrationWriteToDB(inputData: IUser): Promise<void> {
		const password = await bcrypt.hash(inputData.password, 10);
		await this.dataSource.getRepository(Employees).save({
			firstname: inputData.firstname,
			lastname: inputData.lastname,
			email: inputData.email,
			phone: inputData.phone,
			password: password,
			department: inputData.department,
			jobtitle: inputData.jobtitle,
		});
	}

	// Read and compare password from BD table employees
	async userLoginExchangeDB(inputData: IUserLogin): Promise<IUser | void> {
		const resultReadFromDB = await this.dataSource
			.getRepository(Employees)
			.find({ where: { email: inputData.email } });
		if (resultReadFromDB) {
			const comparePassword = await bcrypt.compare(
				inputData.password,
				resultReadFromDB[0].password,
			);
			if (comparePassword) {
				resultReadFromDB[0].password = 'Password is hidden';
				return resultReadFromDB[0];
			} else {
				throw Error('Password is not correct');
			}
		}
	}

	// Return list of users
	// async listOfUssers(
	// 	inputUser: IUserAuthenticate,
	// ): Promise<IUser[] | undefined> {
	// 	let queryToDB: string;
		// const resultReadFromDB = await this.dataSource
		// .getRepository(Employees)
		// .find({ where: { email: inputData.email } });

		// switch (inputUser.jobtitle) {
		// 	case 1:
		// 	queryToDB =
		// 			'SELECT id_employee, firstname, lastname, email, phone, department, jobtitle FROM employees;';
		// 		break;
		// case 2:
		// 		queryToDB = `SELECT id_employee, firstname, lastname, email, phone, department, jobtitle FROM employees WHERE department = '${inputUser.department}'`;
		// 		break;
		// default:
		// 		queryToDB = `SELECT id_employee, firstname, lastname, email, phone, department, jobtitle FROM employees WHERE id_employee = '${inputUser.id_employee}'`;
		// }
		// const readFromDB = await this.dataSource
		// 	.createQueryBuilder()
		// 	.select('user')
		// 	.from(Employees, 'emp')
		// 	.where('user.id = :id', { id: 1 })
		// 	.getOne();
		// const resultReadFromDB: IUser[] = readFromDB;
		// return resultReadFromDB;
	}
}
