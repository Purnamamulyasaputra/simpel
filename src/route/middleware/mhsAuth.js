import { db } from "../application/database.js"

export const mhsAuth = async (req, res, next) => {
    const token = req.get("Authorization")

    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized"
        }).end()
    }

    try {
        // Cari mahasiswa berdasarkan token yang disimpan di database
        const resDb = await db.query(
            'SELECT id, student_id as "studentId" FROM students WHERE token = $1 LIMIT 1',
            [token]
        );
        const mahasiswa = resDb.rows[0];

        if (!mahasiswa) {
            return res.status(401).json({ errors: "Unauthorized" }).end();
        }

        req.mahasiswa = mahasiswa;
        next();
    } catch (err) {
        return res.status(401).json({ errors: "Unauthorized" }).end();
    }
}