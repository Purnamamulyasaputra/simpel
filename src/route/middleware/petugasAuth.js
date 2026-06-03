import { db } from '../application/database.js'
import jwt from 'jsonwebtoken'

export const petugasAuth = async (req, res, next) => {
    const token = req.get('Authorization');
    if (!token){
        return res.status(401).json({
            errors: "Unauthorized"
        }).end();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'STAFF') {
            return res.status(401).json({ errors: "Unauthorized" }).end();
        }

        const resDb = await db.query('SELECT id, username FROM staffs WHERE id = $1 LIMIT 1', [decoded.id]);
        const petugas = resDb.rows[0];

        if (!petugas) {
            return res.status(401).json({ errors: "Unauthorized" }).end();
        }

        req.petugas = petugas;
        next();
    } catch (err) {
        return res.status(401).json({ errors: "Unauthorized" }).end();
    }
}