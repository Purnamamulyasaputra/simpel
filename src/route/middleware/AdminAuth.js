import { db } from '../application/database.js'
import jwt from 'jsonwebtoken'

export const adminAuth = async (req, res, next) => {
    const token = req.get('Authorization');
    if (!token){
        return res.status(401).json({
            errors: "Unauthorized"
        }).end();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'ADMIN') {
            return res.status(401).json({ errors: "Unauthorized" }).end();
        }

        const resDb = await db.query('SELECT id, name FROM admins WHERE id = $1 LIMIT 1', [decoded.id]);
        const admin = resDb.rows[0];

        if (!admin) {
            return res.status(401).json({ errors: "Unauthorized" }).end();
        }

        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).json({ errors: "Unauthorized" }).end();
    }
}