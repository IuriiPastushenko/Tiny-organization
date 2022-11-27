import { IsInt } from 'class-validator';

export class UserChangeDepartmentDto {
  @IsInt()
  public id_employee: number;
  @IsInt()
  public department: number;
}
