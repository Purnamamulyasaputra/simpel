import pkg from 'pg';
import { logger } from "./logging.js";
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // pastikan membaca file .env di root

const { Pool } = pkg;

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

db.on('error', (err, client) => {
    logger.error('Unexpected error on idle client', err);
});

// Helper for single query to simulate simple prisma operations
export const query = async (text, params) => {
    const start = Date.now();
    const res = await db.query(text, params);
    const duration = Date.now() - start;
    logger.info('executed query', { text, duration, rows: res.rowCount });
    return res;
};
