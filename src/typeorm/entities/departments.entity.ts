/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Employees } from './employees.entity';

@Entity()
export class Departments {
  @PrimaryGeneratedColumn()
  // eslint-disable-next-line prettier/prettier
  id_department: number;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  department: string;

  @OneToMany(() => Employees, (employee) => employee.department)
  employees: Employees[];
}
