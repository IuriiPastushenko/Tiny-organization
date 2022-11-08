import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Employees } from './employees.entity';

@Entity()
export class Jobtitles {
	@PrimaryGeneratedColumn()
		id_jobtitle: number;

	@Column({ type: 'varchar', length: 20, nullable: false, unique: true })
		jobtitle: string;

		@OneToMany(() => Employees, (employee) => employee.jobtitle)
	employees: Employees[];
}
