import pkg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const ddl = `
DO $$ BEGIN
 CREATE TYPE "gender" AS ENUM('MALE', 'FEMALE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "message_sender" AS ENUM('STAFF', 'STUDENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "student_status" AS ENUM('ACTIVE', 'ON_LEAVE', 'GRADUATED', 'DROPPED_OUT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "ticket_status" AS ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"password" text NOT NULL,
	"token" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_name_unique" UNIQUE("name")
);

CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"staff_id" integer,
	"student_id" integer,
	"sender" "message_sender" NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "staffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" text NOT NULL,
	"token" text,
	"admin_name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "staffs_username_unique" UNIQUE("username")
);

CREATE TABLE IF NOT EXISTS "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" varchar(50) NOT NULL,
	"email" varchar(100),
	"name" varchar(50) NOT NULL,
	"birth_date" timestamp NOT NULL,
	"gender" "gender" NOT NULL,
	"major" varchar(50) NOT NULL,
	"batch" varchar(10) NOT NULL,
	"status" "student_status" DEFAULT 'ACTIVE',
	"password" text NOT NULL,
	"token" text,
	"admin_name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id"),
	CONSTRAINT "students_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"status" "ticket_status" DEFAULT 'OPEN',
	"student_id" integer NOT NULL,
	"staff_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_staff_id_staffs_id_fk" FOREIGN KEY ("staff_id") REFERENCES "staffs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "staffs" ADD CONSTRAINT "staffs_admin_name_admins_name_fk" FOREIGN KEY ("admin_name") REFERENCES "admins"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "students" ADD CONSTRAINT "students_admin_name_admins_name_fk" FOREIGN KEY ("admin_name") REFERENCES "admins"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_staff_id_staffs_id_fk" FOREIGN KEY ("staff_id") REFERENCES "staffs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`;

async function migrate() {
    try {
        console.log("Mengeksekusi skema pembuatan tabel di NeonDB...");
        await pool.query(ddl);
        console.log("✅ Tabel-tabel berhasil dibuat!");
    } catch (error) {
        console.error("Gagal mengeksekusi migrasi tabel:", error);
    } finally {
        await pool.end();
    }
}

migrate();
