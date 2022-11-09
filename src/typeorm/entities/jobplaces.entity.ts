import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Jobplaces {
	@PrimaryGeneratedColumn()
	id_place: number;

	@Column({
		type: 'varchar',
		length: 50,
		nullable: false,
		unique: true,
	})
	place: string;

	@Column({ type: 'float4', nullable: false })
	lat: number;

	@Column({
		type: 'float4',
		nullable: false,
	})
	lon: number;
}
