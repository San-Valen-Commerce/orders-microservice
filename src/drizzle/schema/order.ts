import {
  boolean,
  timestamp,
  integer,
  pgEnum,
  pgTable,
  serial,
} from 'drizzle-orm/pg-core';

export enum STATUS_ENUM {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

const statusEnum = pgEnum('status', [
  STATUS_ENUM.PENDING,
  STATUS_ENUM.DELIVERED,
  STATUS_ENUM.CANCELLED,
]);

export const order = pgTable('order', {
  id: serial('id').primaryKey(),
  totalAmount: integer('total_amount').notNull(),
  totalItems: integer('total_items').notNull(),
  status: statusEnum('status').notNull().default(STATUS_ENUM.PENDING),
  paid: boolean('paid').default(false),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => {
      return new Date();
    }),
});

export type Order = typeof order.$inferSelect;
export type Status = Order['status'];
export const STATUS_LIST = order.status.enumValues;
