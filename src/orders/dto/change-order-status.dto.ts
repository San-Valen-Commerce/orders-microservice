import { IsIn, IsInt, IsPositive } from 'class-validator';
import { Status, STATUS_LIST } from 'src/drizzle/schema';

export class ChangeOrderStatusDto {
  @IsInt()
  @IsPositive()
  id!: number;

  @IsIn(STATUS_LIST)
  status!: Status;
}
