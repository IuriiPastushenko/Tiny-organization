/* eslint-disable indent */
import { Client } from 'pg';
import { dbkeys } from './db.constants';
import {
	IUser,
	IUserAuthenticate,
	IUserDepartment,
	IUserLogin,
} from '../controllers/interfaces/users.interfaces';
import { Logger } from '../../main';
import bcrypt from 'bcryptjs';
import crypto from 'crypto-js';
import { IGetCoordinats } from '../controllers/interfaces/services.interfaces';

export class DBConnect {
	private client: Client;
	constructor() {
		this.client = new Client(dbkeys);
	}

	// Connection to DB
	async connection(): Promise<void> {
		try {
			await this.client.connect();
			Logger.log('Connection to DB successful');
			await Logger.write(Logger.dataForWrite);
		} catch (err: any) {
			Logger.error('Error connection to DB: ', err.message);
			await Logger.write(Logger.dataForWrite);
		}
	}

	// Write to BD table employees
	async userRegistrationWriteToDB(inputData: IUser): Promise<string> {
		let resultWriteToDB = 'success';
		try {
			const password = await bcrypt.hash(inputData.password, 10);
			const queryToDB = `INSERT INTO employees(firstname, lastname, email, phone, password, department, jobtitle) 
			VALUES ('${inputData.firstname}', '${inputData.lastname}', '${inputData.email}', '${inputData.phone}', '${password}', '${inputData.department}', '${inputData.jobtitle}')`;
			await this.client.query(queryToDB);
			return resultWriteToDB;
		} catch (err: any) {
			resultWriteToDB = err.message;
			return resultWriteToDB;
		}
	}

	// Read password from BD table employees
	async userLoginExchangeDB(inputData: IUserLogin): Promise<IUser | string> {
		try {
			const queryForDB = `SELECT * FROM employees WHERE email = '${inputData.email}';`;
			const resultReadFromDB = (await this.client.query(queryForDB)).rows[0];
			if (resultReadFromDB) {
				const comparePassword = await bcrypt.compare(
					inputData.password,
					resultReadFromDB.password,
				);
				if (comparePassword) {
					resultReadFromDB.password = 'Password is hidden';
					return resultReadFromDB;
				} else {
					const emptyfromDB = 'Password is not correct';
					return emptyfromDB;
				}
			} else {
				const emptyfromDB = 'E-mail is not correct';
				return emptyfromDB;
			}
		} catch (err: any) {
			const errFromDB = err.message;
			return errFromDB;
		}
	}

	// Return list of users
	async listOfUssers(inputUser: IUserAuthenticate): Promise<IUser[] | string> {
		try {
			let queryToDB: string;
			switch (inputUser.jobtitle) {
				case 1:
					queryToDB =
						'SELECT id_employee, firstname, lastname, email, phone, department, jobtitle FROM employees;';
					break;
				case 2:
					queryToDB = `SELECT id_employee, firstname, lastname, email, phone, department, jobtitle FROM employees WHERE department = '${inputUser.department}'`;
					break;
				default:
					queryToDB = `SELECT id_employee, firstname, lastname, email, phone, department, jobtitle FROM employees WHERE id_employee = '${inputUser.id_employee}'`;
			}
			const readFromDB = await this.client.query(queryToDB);
			const resultReadFromDB: IUser[] = readFromDB.rows;
			return resultReadFromDB;
		} catch (err: any) {
			const errFromDB = err.message;
			return errFromDB;
		}
	}

	// Change user's boss
	async userChangeBossWriteToDB(
		inputUser: IUserAuthenticate,
		dataForDB: IUserDepartment,
	): Promise<string> {
		let resultWriteToDB = 'success';
		try {
			const queryDepartmentToDB = `SELECT department FROM employees WHERE id_employee = '${dataForDB.id_employee}';`;
			const queryDepartment = (await this.client.query(queryDepartmentToDB))
				.rows[0];
			if (
				inputUser.jobtitle === 2 &&
				inputUser.department === queryDepartment.department
			) {
				const queryToDB = `UPDATE employees SET department = '${dataForDB.department}' WHERE id_employee = '${dataForDB.id_employee}';`;
				await this.client.query(queryToDB);
				return resultWriteToDB;
			} else {
				resultWriteToDB = 'forbidden';
				return resultWriteToDB;
			}
		} catch (err: any) {
			resultWriteToDB = err.message;
			return resultWriteToDB;
		}
	}

	// Get coordinats of job place
	async dbGetCoordinats(
		inputPlace: string,
		inputUser: IUserAuthenticate,
	): Promise<IGetCoordinats[] | undefined> {
		try {
			const queryToDB = `SELECT lat, lon, lastname, firstname FROM jobplaces, employees WHERE place = '${inputPlace}' and id_employee = '${inputUser.id_employee}'`;
			const resultDB = await this.client.query(queryToDB);
			return resultDB.rows[0];
		} catch (err: any) {
			Logger.error('Ошибка запроса БД: ', err.message);
			await Logger.write(Logger.dataForWrite);
		}
	}

	async userUpdatePassword(dataForDB: IUserLogin) {
		const password = await bcrypt.hash(dataForDB.password, 10);
		const queryToDB = `UPDATE employees SET password = '${password}' WHERE email = '${dataForDB.email}'`;
		await this.client.query(queryToDB);
	}
}
