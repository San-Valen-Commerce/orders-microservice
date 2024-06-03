CREATE TABLE IF NOT EXISTS "ORDER_ITEM" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL,
	"order_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "ORDER_ITEM_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
