/* eslint-disable indent */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Departments } from './departments.entity';
import { Jobtitles } from './jobtitles.entity';

//     foreign  key(department) references departments(id_department),
//     foreign key(jobtitle) references jobtitles(id_jobtitle)

@Entity()
export class Employees {
	@PrimaryGeneratedColumn()
	id_employee: number;

	@Column({
		type: 'varchar',
		length: 20,
		nullable: false,
	})
	firstName: string;

	@Column({
		type: 'varchar',
		length: 20,
		nullable: false,
	})
	lastName: string;

	@Column({
		type: 'varchar',
		length: 20,
		nullable: false,
		unique: true,
	})
	email: string;

	@Column({
		type: 'numeric',
		// length: 10,
		nullable: false,
		unique: true,
	})
	phone: number;

	@Column({
		type: 'varchar',
		length: 70,
		nullable: false,
	})
	password: string;

	@Column({
		type: 'integer',
		nullable: true,
	})
	department: number;

	@Column({
		type: 'integer',
		nullable: true,
	})
	jobtitle: number;

	@ManyToOne(() => Departments, (department) => department.employees)
	departments: Departments;

	@ManyToOne(() => Jobtitles, (jobtitle) => jobtitle.employees)
	jobtitles: Jobtitles;
}
