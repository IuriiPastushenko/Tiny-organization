import { IsEmail, IsInt, IsString } from 'class-validator';

export class UserRegistrationDto {
  @IsString()
  public firstname: string;
  @IsString()
  public lastname: string;
  @IsEmail()
  public email: string;
  @IsInt()
  public phone: number;
  @IsString()
  public password: string;
  @IsInt()
  public department: number;
  @IsInt()
  public jobtitle: number;
}
