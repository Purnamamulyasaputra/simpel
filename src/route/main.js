import * as dotenv from 'dotenv';
dotenv.config();
import { web } from './application/web.js'
import { logger } from './application/logging.js'

// Jalankan server dengan listen() hanya jika di local environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 7000;
    web.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}....`)
    })
}

// Ekspor app (web) agar bisa ditangkap oleh Serverless Vercel
export default web;