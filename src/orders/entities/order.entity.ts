import { Order, Status } from 'src/drizzle/schema';

export class Orderentity implements Order {
  id!: number;
  totalAmount!: number;
  totalItems!: number;
  status!: Status;
  paid!: boolean | null;
  paidAt!: Date | null;
  createdAt!: Date | null;
  updatedAt!: Date | null;
}

export interface IOrder extends Orderentity {}
