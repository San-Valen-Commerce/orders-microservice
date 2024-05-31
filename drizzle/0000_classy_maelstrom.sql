DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'delivered', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_amount" integer NOT NULL,
	"total_items" integer NOT NULL,
	"status" "status" NOT NULL,
	"paid" boolean DEFAULT false,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
