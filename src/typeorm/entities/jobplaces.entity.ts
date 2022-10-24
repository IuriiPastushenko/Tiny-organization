import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// ID_place SERIAL primary key,
//     place character varying(20) not null unique,
//     lat float4 not null,
// 	lon float4 not nul

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
