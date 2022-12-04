import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherDto {
  @IsNotEmpty()
  @IsString()
  public place: string;
}
