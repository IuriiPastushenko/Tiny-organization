import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// ID_JOBTITLE SERIAL primary key,
// JOBTITLE character varying(20) not null unique

@Entity()
export class Employees {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 100,
	})
	name: string;

	@Column('text')
	description: string;

	@Column()
	filename: string;

	@Column('double')
	views: number;

	@Column()
	isPublished: boolean;
}
