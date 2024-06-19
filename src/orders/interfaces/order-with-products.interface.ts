import { IOrder } from '../entities/order.entity';

export interface OrderWithProducts extends IOrder {
  orderItems: {
    productName: any;
    id: number;
    productId: number;
    quantity: number;
    price: number;
    orderId: number;
  }[];
}
