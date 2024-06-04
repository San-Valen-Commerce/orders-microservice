import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { order } from './order';

export const orderItem = pgTable('ORDER_ITEM', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  orderId: integer('order_id')
    .notNull()
    .references(() => order.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export type OrderItem = typeof orderItem.$inferSelect;
