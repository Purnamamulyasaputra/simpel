import { db } from '../application/database.js'
import { ResponseError } from '../errors/responseError.js'
import { validate } from '../validations/validation.js'
import { loginAdminValidation, registerAdminValidation, updateAdminPasswordValidation, updateAdminProfileValidation } from '../validations/adminValidation.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = async (req) => {
    const dataAdmin = validate(registerAdminValidation, req);

    const checkRes = await db.query('SELECT count(*) as count FROM admins WHERE name = $1', [dataAdmin.name]);
    if (parseInt(checkRes.rows[0].count) > 0) {
        throw new ResponseError(401, "Name sudah digunakan!");
    }

    const hashedPassword = await bcrypt.hash(dataAdmin.password, 10);

    const insertRes = await db.query(
        'INSERT INTO admins (name, password) VALUES ($1, $2) RETURNING name, created_at as "createdAt"',
        [dataAdmin.name, hashedPassword]
    );

    return insertRes.rows[0];
}

const login = async (req) => {
    const dataAdmin = validate(loginAdminValidation, req)

    const res = await db.query('SELECT id, name, password FROM admins WHERE name = $1 LIMIT 1', [dataAdmin.name]);
    const admin = res.rows[0];

    if (!admin) throw new ResponseError(401, "Name atau Password salah!");

    const getPassword = await bcrypt.compare(dataAdmin.password, admin.password)
    if (!getPassword) throw new ResponseError(401, "Name atau Password salah!");

    const token = jwt.sign({ id: admin.id, role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return {
        id: admin.id,
        name: admin.name,
        token: token
    };
}

const update = async (admin1, req) => {
    const adminRes = await db.query('SELECT id, name, password FROM admins WHERE name = $1 LIMIT 1', [admin1.name]);
    const checkAdmin = adminRes.rows[0];

    if (!checkAdmin) throw new ResponseError(404, "Admin tidak ditemukan!");

    const dataProfile = validate(updateAdminProfileValidation, req);

    const checkRes = await db.query('SELECT count(*) as count FROM admins WHERE name = $1 AND name != $2', [dataProfile.name, admin1.name]);
    if (parseInt(checkRes.rows[0].count) > 0) {
        throw new ResponseError(401, "Name sudah digunakan!");
    }

    const updateRes = await db.query('UPDATE admins SET name = $1, updated_at = NOW() WHERE name = $2 RETURNING name, updated_at as "updatedAt"', [dataProfile.name, admin1.name]);
    return updateRes.rows[0];
}

const updatePassword = async (admin1, req) => {
    const dataPassword = validate(updateAdminPasswordValidation, req);

    const adminRes = await db.query('SELECT id, name, password FROM admins WHERE name = $1 LIMIT 1', [admin1.name]);
    const checkAdmin = adminRes.rows[0];

    if (!checkAdmin) throw new ResponseError(404, "Admin tidak ditemukan!");

    const verifyPassword = await bcrypt.compare(dataPassword.oldPassword, checkAdmin.password);
    if (!verifyPassword) throw new ResponseError(401, "Password lama salah!");

    const hashedPassword = await bcrypt.hash(dataPassword.password, 10);
    const updateRes = await db.query('UPDATE admins SET password = $1, updated_at = NOW() WHERE name = $2 RETURNING name, updated_at as "updatedAt"', [hashedPassword, admin1.name]);
    return updateRes.rows[0];
}

const addPetugas = async (adminUser, req) => {
    const adminRes = await db.query('SELECT name FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);
    const admin = adminRes.rows[0];

    const checkRes = await db.query('SELECT count(*) as count FROM staffs WHERE username = $1', [req.username]);
    if (parseInt(checkRes.rows[0].count) > 0) {
        throw new ResponseError(401, "Username sudah digunakan!");
    }

    const hashedPassword = await bcrypt.hash(req.password, 10);

    const insertRes = await db.query(
        'INSERT INTO staffs (username, password, admin_name) VALUES ($1, $2, $3) RETURNING id, username, created_at as "createdAt", admin_name as "adminName"',
        [req.username, hashedPassword, admin.name]
    );

    return insertRes.rows[0];
}

const getPetugas = async (adminUser, idPetugas) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const petugasRes = await db.query('SELECT id, username, created_at as "createdAt", updated_at as "updatedAt", admin_name as "adminName" FROM staffs WHERE id = $1 LIMIT 1', [idPetugas]);
    if (petugasRes.rowCount === 0) throw new ResponseError(404, "Petugas tidak ditemukan!");

    return petugasRes.rows[0];
}

const getAllPetugas = async (adminUser) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const res = await db.query('SELECT id, username, created_at as "createdAt", updated_at as "updatedAt", admin_name as "adminName" FROM staffs');
    return res.rows;
}

const updatePetugas = async (adminUser, idPetugas, req) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const petugasRes = await db.query('SELECT id FROM staffs WHERE id = $1 LIMIT 1', [idPetugas]);
    if (petugasRes.rowCount === 0) throw new ResponseError(401, `Petugas dengan ID ${idPetugas} tidak ditemukan!`);

    const checkRes = await db.query('SELECT count(*) as count FROM staffs WHERE username = $1 AND id != $2', [req.username, idPetugas]);
    if (parseInt(checkRes.rows[0].count) > 0) {
        throw new ResponseError(401, "Username sudah digunakan!");
    }

    let queryUpdates = [];
    let queryValues = [];
    let valIndex = 1;

    if (req.username !== undefined) {
        queryUpdates.push(`username = $${valIndex++}`);
        queryValues.push(req.username);
    }

    if (req.password && req.password.trim() !== "") {
        const hashed = await bcrypt.hash(req.password, 10);
        queryUpdates.push(`password = $${valIndex++}`);
        queryValues.push(hashed);
    }

    if (queryUpdates.length === 0) return { id: idPetugas };

    queryUpdates.push(`updated_at = NOW()`);
    queryValues.push(idPetugas);

    const updateQuery = `UPDATE staffs SET ${queryUpdates.join(', ')} WHERE id = $${valIndex} RETURNING id, username, updated_at as "updatedAt", admin_name as "adminName"`;
    const updateRes = await db.query(updateQuery, queryValues);

    return updateRes.rows[0];
};

const removePetugas = async (adminUser, idPetugas) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const petugasRes = await db.query('SELECT id FROM staffs WHERE id = $1 LIMIT 1', [idPetugas]);
    if (petugasRes.rowCount === 0) throw new ResponseError(401, `Petugas dengan ID ${idPetugas} tidak ditemukan!`);

    const delRes = await db.query('DELETE FROM staffs WHERE id = $1 RETURNING id', [idPetugas]);
    return delRes.rows[0];
};

const addMahasiswa = async (adminUser, request) => {
    const adminRes = await db.query('SELECT name FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);
    const admin = adminRes.rows[0];

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const mhsRes = await db.query('SELECT id FROM students WHERE student_id = $1 LIMIT 1', [request.studentId]);
    if (mhsRes.rowCount > 0) throw new ResponseError(404, "Mahasiswa sudah ada");

    // Convert empty string to null to avoid database timestamp or nullable column format errors
    const birthDate = request.birthDate && request.birthDate.trim() !== "" ? request.birthDate : null;
    const email = request.email && request.email.trim() !== "" ? request.email : null;
    const gender = request.gender && request.gender.trim() !== "" ? request.gender : null;
    const major = request.major && request.major.trim() !== "" ? request.major : null;
    const batch = request.batch && request.batch.trim() !== "" ? request.batch : null;

    const insertRes = await db.query(`
        INSERT INTO students (student_id, name, email, birth_date, gender, major, batch, password, admin_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, student_id as "studentId", email, name, birth_date as "birthDate", gender, major, batch, status, created_at as "createdAt", updated_at as "updatedAt", admin_name as "adminName"
    `, [request.studentId, request.name, email, birthDate, gender, major, batch, hashedPassword, admin.name]);

    return insertRes.rows[0];
}

const getMahasiswa = async (adminUser, idMhs) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const mhsRes = await db.query('SELECT id, student_id as "studentId", email, name, birth_date as "birthDate", gender, major, batch, status, created_at as "createdAt", updated_at as "updatedAt", admin_name as "adminName" FROM students WHERE id = $1 LIMIT 1', [idMhs]);
    if (mhsRes.rowCount === 0) throw new ResponseError(404, "Mahasiswa tidak ditemukan!");

    return mhsRes.rows[0];
}

const getAllMahasiswa = async (adminUser) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    // Ditampilkan berurutan sesuai NIM dari kecil ke besar (student_id ASC)
    const res = await db.query('SELECT id, student_id as "studentId", email, name, birth_date as "birthDate", gender, major, batch, status, created_at as "createdAt", updated_at as "updatedAt", admin_name as "adminName" FROM students ORDER BY student_id ASC');
    return res.rows;
}

const updateMahasiswa = async (adminUser, idMhs, req) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const mhsRes = await db.query('SELECT id FROM students WHERE id = $1 LIMIT 1', [idMhs]);
    if (mhsRes.rowCount === 0) throw new ResponseError(401, `Mahasiswa dengan ID ${idMhs} tidak ditemukan!`);

    let queryUpdates = [];
    let queryValues = [];
    let valIndex = 1;

    if (req.studentId !== undefined) { queryUpdates.push(`student_id = $${valIndex++}`); queryValues.push(req.studentId); }
    if (req.email !== undefined) { queryUpdates.push(`email = $${valIndex++}`); queryValues.push(req.email && req.email.trim() !== "" ? req.email : null); }
    if (req.name !== undefined) { queryUpdates.push(`name = $${valIndex++}`); queryValues.push(req.name); }
    if (req.birthDate !== undefined) { queryUpdates.push(`birth_date = $${valIndex++}`); queryValues.push(req.birthDate && req.birthDate.trim() !== "" ? req.birthDate : null); }
    if (req.gender !== undefined) { queryUpdates.push(`gender = $${valIndex++}`); queryValues.push(req.gender && req.gender.trim() !== "" ? req.gender : null); }
    if (req.major !== undefined) { queryUpdates.push(`major = $${valIndex++}`); queryValues.push(req.major && req.major.trim() !== "" ? req.major : null); }
    if (req.batch !== undefined) { queryUpdates.push(`batch = $${valIndex++}`); queryValues.push(req.batch && req.batch.trim() !== "" ? req.batch : null); }
    if (req.status !== undefined) { queryUpdates.push(`status = $${valIndex++}`); queryValues.push(req.status); }

    if (req.password && req.password.trim() !== "") {
        const hashed = await bcrypt.hash(req.password, 10);
        queryUpdates.push(`password = $${valIndex++}`); queryValues.push(hashed);
    }

    if (queryUpdates.length === 0) return { id: idMhs };

    queryUpdates.push(`updated_at = NOW()`);
    queryValues.push(idMhs);

    const updateQuery = `UPDATE students SET ${queryUpdates.join(', ')} WHERE id = $${valIndex} RETURNING id, student_id as "studentId", email, name, birth_date as "birthDate", gender, major, batch, status, updated_at as "updatedAt", admin_name as "adminName"`;
    const updateRes = await db.query(updateQuery, queryValues);

    return updateRes.rows[0];
};

const removeMahasiswa = async (adminUser, idMhs) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const mhsRes = await db.query('SELECT id FROM students WHERE id = $1 LIMIT 1', [idMhs]);
    if (mhsRes.rowCount === 0) throw new ResponseError(401, `Mahasiswa dengan ID ${idMhs} tidak ditemukan!`);

    const delRes = await db.query('DELETE FROM students WHERE id = $1 RETURNING id', [idMhs]);
    return delRes.rows[0];
};

const getTiket = async (adminUser, idTiket) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const tiketRes = await db.query(`
        SELECT 
            t.id, t.category, t.description, t.status, t.staff_id as "staffId", t.created_at as "createdAt", t.updated_at as "updatedAt",
            s.id as "student.id", s.student_id as "student.studentId", s.email as "student.email", s.name as "student.name", s.birth_date as "student.birthDate", s.gender as "student.gender", s.major as "student.major", s.batch as "student.batch", s.status as "student.status",
            st.id as "staff.id", st.username as "staff.username"
        FROM tickets t
        LEFT JOIN students s ON t.student_id = s.id
        LEFT JOIN staffs st ON t.staff_id = st.id
        WHERE t.id = $1 LIMIT 1
    `, [idTiket]);

    if (tiketRes.rowCount === 0) throw new ResponseError(404, "Tiket tidak ditemukan!");

    const t = tiketRes.rows[0];
    return {
        id: t.id,
        category: t.category,
        description: t.description,
        status: t.status,
        staffId: t.staffId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        student: {
            id: t['student.id'],
            studentId: t['student.studentId'],
            email: t['student.email'],
            name: t['student.name'],
            birthDate: t['student.birthDate'],
            gender: t['student.gender'],
            major: t['student.major'],
            batch: t['student.batch'],
            status: t['student.status']
        },
        staff: t.staffId ? {
            id: t.staffId,
            username: t['staff.username']
        } : null
    };
}

const getTikets = async (adminUser) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const ticketsRes = await db.query(`
        SELECT 
            t.id, t.category, t.description, t.status, t.staff_id as "staffId", t.created_at as "createdAt", t.updated_at as "updatedAt",
            s.id as "student.id", s.student_id as "student.studentId", s.email as "student.email", s.name as "student.name", s.birth_date as "student.birthDate", s.gender as "student.gender", s.major as "student.major", s.batch as "student.batch", s.status as "student.status",
            st.id as "staff.id", st.username as "staff.username"
        FROM tickets t
        LEFT JOIN students s ON t.student_id = s.id
        LEFT JOIN staffs st ON t.staff_id = st.id
        ORDER BY t.created_at DESC
    `);

    return ticketsRes.rows.map(t => ({
        id: t.id,
        category: t.category,
        description: t.description,
        status: t.status,
        staffId: t.staffId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        student: {
            id: t['student.id'],
            studentId: t['student.studentId'],
            email: t['student.email'],
            name: t['student.name'],
            birthDate: t['student.birthDate'],
            gender: t['student.gender'],
            major: t['student.major'],
            batch: t['student.batch'],
            status: t['student.status']
        },
        staff: t.staffId ? {
            id: t.staffId,
            username: t['staff.username']
        } : null
    }));
}

const getDashboardStats = async (adminUser) => {
    const adminRes = await db.query('SELECT id FROM admins WHERE id = $1 LIMIT 1', [adminUser.id]);
    if (adminRes.rowCount === 0) throw new ResponseError(404, `Admin tidak ditemukan!`);

    const totalTickets = await db.query('SELECT count(*) as count FROM tickets');
    const openTickets = await db.query("SELECT count(*) as count FROM tickets WHERE status = 'OPEN'");
    const inProgressTickets = await db.query("SELECT count(*) as count FROM tickets WHERE status = 'IN_PROGRESS'");
    const resolvedTickets = await db.query("SELECT count(*) as count FROM tickets WHERE status = 'RESOLVED' OR status = 'CLOSED'");

    const totalStudents = await db.query('SELECT count(*) as count FROM students');
    const totalStaffs = await db.query('SELECT count(*) as count FROM staffs');

    return {
        totalTickets: parseInt(totalTickets.rows[0].count),
        openTickets: parseInt(openTickets.rows[0].count),
        inProgressTickets: parseInt(inProgressTickets.rows[0].count),
        resolvedTickets: parseInt(resolvedTickets.rows[0].count),
        totalStudents: parseInt(totalStudents.rows[0].count),
        totalStaffs: parseInt(totalStaffs.rows[0].count)
    };
}

export default {
    register, login, update, updatePassword,
    addPetugas, getPetugas, getAllPetugas, updatePetugas, removePetugas,
    addMahasiswa, getMahasiswa, getAllMahasiswa, updateMahasiswa, removeMahasiswa,
    getTiket, getTikets, getDashboardStats
}