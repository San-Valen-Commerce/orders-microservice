ALTER TABLE "order" RENAME TO "ORDER";--> statement-breakpoint
ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "ORDER_ITEM_order_id_order_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "ORDER_ITEM_order_id_ORDER_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."ORDER"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
