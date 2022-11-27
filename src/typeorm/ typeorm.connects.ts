import { DataSource } from 'typeorm';
import { Logger } from '../../main';
import {
  IUser,
  IUserAuthenticate,
  IUserLogin,
  IUserDepartment,
} from '../users/users.interfaces';
import { typeOrmConfig } from './ typeeorm.config';
import { Employees } from './entities/employees.entity';
import bcrypt from 'bcryptjs';
import { IGetCoordinats } from '../services/services.interfaces';
import { Jobplaces } from './entities/jobplaces.entity';

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
  async listOfUssers(
    inputUser: IUserAuthenticate,
  ): Promise<IUser[] | undefined> {
    const resultFromDB = this.dataSource
      .getRepository(Employees)
      .createQueryBuilder('emp')
      .select('emp.firstname')
      .addSelect('emp.lastname')
      .addSelect('emp.phone');
    if (inputUser.jobtitle === 1) {
      return await resultFromDB.getMany();
    }
    if (inputUser.jobtitle === 2) {
      return await resultFromDB
        .where('emp.department = :id', { id: inputUser.department })
        .getMany();
    }
    if (inputUser.jobtitle === 3) {
      return await resultFromDB
        .where('emp.id_employee = :id', { id: inputUser.id_employee })
        .getMany();
    }
  }

  /// Change user's boss
  async userChangeBossWriteToDB(
    inputUser: IUserAuthenticate,
    dataForDB: IUserDepartment,
  ): Promise<void> {
    const departmentFromDB = await this.dataSource
      .getRepository(Employees)
      .createQueryBuilder('emp')
      .select('emp.department')
      .where('emp.id_employee = :id', { id: dataForDB.id_employee })
      .getOne();

    if (
      inputUser.jobtitle === 2 &&
      inputUser.department === departmentFromDB?.department
    ) {
      await this.dataSource
        .createQueryBuilder()
        .update(Employees)
        .set({ department: dataForDB.department })
        .where('id_employee = :id', { id: dataForDB.id_employee })
        .execute();
    } else {
      throw Error('Forbidden');
    }
  }
  // Get coordinats of job place
  async dbGetCoordinats(
    inputPlace: string,
    inputUser: IUserAuthenticate,
  ): Promise<IGetCoordinats[] | undefined> {
    const placeFromDB = await this.dataSource
      .getRepository(Jobplaces)
      .createQueryBuilder('jp')
      .select('jp.lat')
      .addSelect('jp.lon')
      .where('jp.place = :id', { id: inputPlace })
      .getOne();

    const employeeFromDB = await this.dataSource
      .getRepository(Employees)
      .createQueryBuilder('emp')
      .select('emp.lastname')
      .addSelect('emp.firstname')
      .where('emp.id_employee = :id', { id: inputUser.id_employee })
      .getOne();

    return [
      {
        lat: placeFromDB?.lat,
        lon: placeFromDB?.lon,
        lastname: employeeFromDB?.lastname,
        firstname: employeeFromDB?.firstname,
      },
    ];
  }
}
