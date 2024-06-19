import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { order } from './order';

export const orderReceipt = pgTable('ORDER_RECEIPT', {
  id: serial('id').primaryKey(),
  receiptUrl: text('receipt_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => {
      return new Date();
    }),
  orderId: integer('order_id')
    .notNull()
    .unique() // 1 to 1 relationship
    .references(() => order.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export type OrderReceipt = typeof orderReceipt.$inferSelect;
