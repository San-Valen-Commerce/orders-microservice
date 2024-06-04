import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { IOrderItem } from '../entities/order-item.entity';

interface IOrderItemDto extends Omit<IOrderItem, 'id' | 'orderId'> {}

export class OrderItemDto implements IOrderItemDto {
  @IsInt()
  @IsPositive()
  productId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsInt()
  @IsOptional()
  price!: number;
}
