import { OrderItem } from 'src/drizzle/schema';

export class OrderItemEntity implements OrderItem {
  id!: number;
  productId!: number;
  quantity!: number;
  price!: number;
  orderId!: number;
}

export interface IOrderItem extends OrderItemEntity {}
