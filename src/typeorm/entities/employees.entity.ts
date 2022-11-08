/* eslint-disable indent */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Departments } from './departments.entity';
import { Jobtitles } from './jobtitles.entity';

@Entity()
export class Employees {
	@PrimaryGeneratedColumn()
	id_employee: number;

	@Column({
		type: 'varchar',
		length: 20,
		nullable: false,
	})
	firstname: string;

	@Column({
		type: 'varchar',
		length: 20,
		nullable: false,
	})
	lastname: string;

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
	@JoinColumn({
		name: 'department',
	})
	departments: Departments;

	@ManyToOne(() => Jobtitles, (jobtitle) => jobtitle.employees)
	@JoinColumn({
		name: 'jobtitle',
	})
	jobtitles: Jobtitles;
}
