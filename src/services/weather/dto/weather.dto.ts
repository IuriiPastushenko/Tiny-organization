import { IsString } from 'class-validator';

export class WeatherDto {
	@IsString()
	public place: string;
}
