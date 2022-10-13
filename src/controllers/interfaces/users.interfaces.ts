export interface IUserLogin {
	email: string;
	password: string;
}

export interface IUserDepartment {
	id_employee: number;
	department: number;
}

export interface IUser extends IUserLogin, IUserDepartment {
	firstname: string;
	lastname: string;
	phone: number;
	jobtitle: number;
}

export interface IUserAuthenticate {
	id_employee: number;
	department: number;
	jobtitle: number;
}
