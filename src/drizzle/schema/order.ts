import {
  boolean,
  timestamp,
  integer,
  pgEnum,
  pgTable,
  serial,
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', [
  'pending',
  'delivered',
  'cancelled',
]);

export const order = pgTable('order', {
  id: serial('id').primaryKey(),
  totalAmount: integer('total_amount').notNull(),
  totalItems: integer('total_items').notNull(),
  status: statusEnum('status').notNull(),
  paid: boolean('paid').default(false),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => {
      return new Date();
    }),
});

export type Order = typeof order.$inferSelect;
