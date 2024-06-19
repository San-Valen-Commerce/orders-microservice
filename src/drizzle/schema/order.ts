import {
  boolean,
  timestamp,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';

export enum STATUS_ENUM {
  PENDING = 'pending',
  PAID = 'paid',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export const statusEnum = pgEnum('status', [
  STATUS_ENUM.PENDING,
  STATUS_ENUM.PAID,
  STATUS_ENUM.DELIVERED,
  STATUS_ENUM.CANCELLED,
]);

export const order = pgTable('ORDER', {
  id: serial('id').primaryKey(),
  totalAmount: integer('total_amount').notNull(),
  totalItems: integer('total_items').notNull(),
  status: statusEnum('status').notNull().default(STATUS_ENUM.PENDING),
  paid: boolean('paid').notNull().default(false),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  stripeChargeId: text('stripe_charge_id'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => {
      return new Date();
    }),
});

export type Order = typeof order.$inferSelect;
export type Status = Order['status'];
export const STATUS_LIST = order.status.enumValues;
