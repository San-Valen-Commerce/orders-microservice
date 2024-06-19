import { Order, Status } from 'src/drizzle/schema';

export class OrderEntity implements Order {
  stripeChargeId!: string | null;
  id!: number;
  totalAmount!: number;
  totalItems!: number;
  status!: Status;
  paid!: boolean;
  paidAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export interface IOrder extends OrderEntity {}
