import { IOrder } from '../entities/order.entity';

export interface UpdateOrderDto extends Partial<Omit<IOrder, 'id'>> {}
