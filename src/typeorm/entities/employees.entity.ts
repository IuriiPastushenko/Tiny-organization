import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

//     id_employee SERIAL primary key,
//     firstName character varying(20) not null,
//     lastName character varying(20) not null,
//     email character varying(30) not null unique,
//     phone character varying(30) not null unique,
//     password character varying(20) not null,
//     department integer not null,
//     jobtitle integer not null,
//     foreign  key(department) references departments(id_department),
//     foreign key(jobtitle) references jobtitles(id_jobtitle)

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
