import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { IOrder } from '../entities/order.entity';
import { STATUS_LIST, Status } from 'src/drizzle/schema';

interface ICreateOrder
  extends Omit<IOrder, 'id' | 'paidAt' | 'createdAt' | 'updatedAt'> {}

export class CreateOrderDto implements ICreateOrder {
  @IsInt()
  @IsPositive()
  totalAmount!: number;

  @IsInt()
  @IsPositive()
  totalItems!: number;

  @IsIn(STATUS_LIST)
  @IsOptional()
  status!: Status;

  @IsBoolean()
  @IsOptional()
  paid!: boolean | null;
}
