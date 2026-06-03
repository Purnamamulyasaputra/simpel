import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE']);
export const studentStatusEnum = pgEnum('student_status', ['ACTIVE', 'ON_LEAVE', 'GRADUATED', 'DROPPED_OUT']);
export const ticketStatusEnum = pgEnum('ticket_status', ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']);
export const messageSenderEnum = pgEnum('message_sender', ['STAFF', 'STUDENT']);

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    password: text('password').notNull(),
    token: text('token'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const staffs = pgTable('staffs', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: text('password').notNull(),
    token: text('token'),
    adminName: varchar('admin_name', { length: 50 }).notNull().references(() => admins.name),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const students = pgTable('students', {
    id: serial('id').primaryKey(),
    studentId: varchar('student_id', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 100 }).unique(),
    name: varchar('name', { length: 50 }).notNull(),
    birthDate: timestamp('birth_date').notNull(),
    gender: genderEnum('gender').notNull(),
    major: varchar('major', { length: 50 }).notNull(),
    batch: varchar('batch', { length: 10 }).notNull(),
    status: studentStatusEnum('status').default('ACTIVE'),
    password: text('password').notNull(),
    token: text('token'),
    adminName: varchar('admin_name', { length: 50 }).notNull().references(() => admins.name),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const tickets = pgTable('tickets', {
    id: serial('id').primaryKey(),
    category: varchar('category', { length: 50 }).notNull(),
    description: text('description').notNull(),
    status: ticketStatusEnum('status').default('OPEN'),
    studentId: integer('student_id').notNull().references(() => students.id),
    staffId: integer('staff_id').references(() => staffs.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    ticketId: integer('ticket_id').notNull().references(() => tickets.id),
    staffId: integer('staff_id').references(() => staffs.id),
    studentId: integer('student_id').references(() => students.id),
    sender: messageSenderEnum('sender').notNull(),
    content: text('content').notNull(),
    timestamp: timestamp('timestamp').defaultNow()
});
