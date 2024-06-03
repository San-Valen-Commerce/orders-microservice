import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { Status, STATUS_LIST } from 'src/drizzle/schema';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsIn(STATUS_LIST)
  status!: Status;
}
