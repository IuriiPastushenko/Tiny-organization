import { IsEmail, IsInt, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail()
	public email: string;
	@IsString()
	public password: string;
}
