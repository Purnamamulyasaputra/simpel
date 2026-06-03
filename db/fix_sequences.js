import pkg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function fixSequences() {
    const tables = ['admins', 'staffs', 'students', 'tickets', 'messages'];
    
    try {
        console.log("Memulai perbaikan sequence primary key (Auto-Increment)...");
        for (const table of tables) {
            const query = `
                SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1) + 1, false)
                FROM ${table};
            `;
            await pool.query(query);
            console.log(`✅ Sequence untuk tabel ${table} telah diperbaiki.`);
        }
        console.log("Semua sequence berhasil diperbaiki!");
    } catch (error) {
        console.error("Gagal memperbaiki sequence:", error);
    } finally {
        await pool.end();
    }
}

fixSequences();
