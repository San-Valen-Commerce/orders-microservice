DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'paid', 'delivered', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ORDER" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_amount" integer NOT NULL,
	"total_items" integer NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"paid_at" timestamp with time zone,
	"stripe_charge_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ORDER_ITEM" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL,
	"order_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ORDER_RECEIPT" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"order_id" integer NOT NULL,
	CONSTRAINT "ORDER_RECEIPT_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "ORDER_ITEM_order_id_ORDER_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."ORDER"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ORDER_RECEIPT" ADD CONSTRAINT "ORDER_RECEIPT_order_id_ORDER_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."ORDER"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
