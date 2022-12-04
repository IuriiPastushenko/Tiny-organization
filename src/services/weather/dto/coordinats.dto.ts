import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CoordinatsDto {
  @IsNotEmpty()
  @IsString()
  public place: string;

  @IsNotEmpty()
  @IsNumber()
  public lat: number;

  @IsNotEmpty()
  @IsNumber()
  public lon: number;
}
