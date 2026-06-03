import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const { Pool } = pkg;

async function seedData() {
    console.log("Memulai proses seeding dari MySQL ke NeonDB PostgreSQL...");
    
    // 1. Koneksi ke MySQL (Sumber Data)
    const mysqlConn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345677',
        database: 'db_sistem_tiket',
        port: 3306
    });

    console.log("✅ Berhasil terhubung ke database MySQL lokal");

    // 2. Koneksi ke NeonDB (Tujuan Data)
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const db = drizzle(pool, { schema });

    console.log("✅ Berhasil terhubung ke database NeonDB");

    try {
        // --- 1. Migrasi Admin ---
        console.log("Migrasi tabel Admin...");
        const [mysqlAdmins] = await mysqlConn.execute('SELECT * FROM Admin');
        if (mysqlAdmins.length > 0) {
            await db.insert(schema.admins).values(mysqlAdmins.map(admin => ({
                id: admin.id,
                name: admin.name,
                password: admin.password,
                token: admin.token,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            }))).onConflictDoNothing();
        }

        // --- 2. Migrasi Staff ---
        console.log("Migrasi tabel Staff...");
        const [mysqlStaffs] = await mysqlConn.execute('SELECT * FROM Staff');
        if (mysqlStaffs.length > 0) {
            await db.insert(schema.staffs).values(mysqlStaffs.map(staff => ({
                id: staff.id,
                username: staff.username,
                password: staff.password,
                token: staff.token,
                adminName: staff.adminName,
                createdAt: staff.createdAt,
                updatedAt: staff.updatedAt
            }))).onConflictDoNothing();
        }

        // --- 3. Migrasi Student ---
        console.log("Migrasi tabel Student...");
        const [mysqlStudents] = await mysqlConn.execute('SELECT * FROM Student');
        if (mysqlStudents.length > 0) {
            await db.insert(schema.students).values(mysqlStudents.map(student => ({
                id: student.id,
                studentId: student.studentId,
                email: student.email,
                name: student.name,
                birthDate: student.birthDate,
                gender: student.gender,
                major: student.major,
                batch: student.batch,
                status: student.status,
                password: student.password,
                token: student.token,
                adminName: student.adminName,
                createdAt: student.createdAt,
                updatedAt: student.updatedAt
            }))).onConflictDoNothing();
        }

        // --- 4. Migrasi Ticket ---
        console.log("Migrasi tabel Ticket...");
        const [mysqlTickets] = await mysqlConn.execute('SELECT * FROM Ticket');
        if (mysqlTickets.length > 0) {
            await db.insert(schema.tickets).values(mysqlTickets.map(ticket => ({
                id: ticket.id,
                category: ticket.category,
                description: ticket.description,
                status: ticket.status,
                studentId: ticket.studentId,
                staffId: ticket.staffId,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt
            }))).onConflictDoNothing();
        }

        // --- 5. Migrasi Message ---
        console.log("Migrasi tabel Message...");
        const [mysqlMessages] = await mysqlConn.execute('SELECT * FROM Message');
        if (mysqlMessages.length > 0) {
            await db.insert(schema.messages).values(mysqlMessages.map(msg => ({
                id: msg.id,
                ticketId: msg.ticketId,
                staffId: msg.staffId,
                studentId: msg.studentId,
                sender: msg.sender,
                content: msg.content,
                timestamp: msg.timestamp
            }))).onConflictDoNothing();
        }

        console.log("🎉 Seeding Selesai! Semua data berhasil ditransfer ke NeonDB.");

    } catch (error) {
        console.error("❌ Terjadi kesalahan saat proses seeding:", error);
    } finally {
        await mysqlConn.end();
        await pool.end();
        process.exit(0);
    }
}

seedData();
