import { DataSource } from 'typeorm';
import { Logger } from '../../main';
import { typeOrmConfig } from './ typeeorm.config';
import { Departments } from './entities/departments.entity';

export class TypeOrmConnects {
	private dataSource: DataSource;
	constructor() {
		this.dataSource = new DataSource(typeOrmConfig);
	}
	//

	async initialize(): Promise<void> {
		try {
			this.dataSource.initialize();
			Logger.log('Connection to BD(TypeORM) successful');
			await Logger.write(Logger.dataForWrite);
		} catch (err: any) {
			Logger.error('Error connection to DB: ', err.message);
		}
	}

	async test(): Promise<any> {
		return this.dataSource
			.getRepository(Departments)
			.find({ where: { id_department: 1 } });
	}
}
