import { db } from "../application/database.js"
import { ResponseError } from "../errors/responseError.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req) => {

    const res = await db.query('SELECT id, username, password FROM staffs WHERE username = $1 LIMIT 1', [req.username]);
    const petugas = res.rows[0];

    if (!petugas) throw new ResponseError(401, "Username or Password wrong!");

    const getPassword = await bcrypt.compare(req.password, petugas.password)
    if (!getPassword) throw new ResponseError(401, "Username or Password wrong!");

    const token = jwt.sign({ id: petugas.id, role: 'STAFF' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return {
        id: petugas.id,
        username: petugas.username,
        token: token
    };
}

const get = async (petugas) => {
    const res = await db.query('SELECT id, username, created_at as "createdAt", updated_at as "updatedAt" FROM staffs WHERE id = $1 LIMIT 1', [petugas.id]);
    return res.rows[0];
}

const logout = async (petugas) => {
    return "OK"
}

const getTickets = async () => {
    const res = await db.query(`
        SELECT 
            t.id, t.category, t.description, t.status, t.updated_at as "updatedAt", t.staff_id as "staffId",
            st.id as "staff.id", st.username as "staff.username",
            s.id as "student.id", s.student_id as "student.studentId", s.email as "student.email", 
            s.name as "student.name", s.birth_date as "student.birthDate", s.gender as "student.gender", 
            s.major as "student.major", s.batch as "student.batch", s.status as "student.status", s.created_at as "student.createdAt"
        FROM tickets t
        LEFT JOIN staffs st ON t.staff_id = st.id
        LEFT JOIN students s ON t.student_id = s.id
        ORDER BY t.created_at DESC
    `);

    return res.rows.map(row => ({
        id: row.id,
        category: row.category,
        description: row.description,
        status: row.status,
        updatedAt: row.updatedAt,
        staffId: row.staffId,
        staff: row.staffId ? { id: row['staff.id'], username: row['staff.username'] } : null,
        student: {
            id: row['student.id'],
            studentId: row['student.studentId'],
            email: row['student.email'],
            name: row['student.name'],
            birthDate: row['student.birthDate'],
            gender: row['student.gender'],
            major: row['student.major'],
            batch: row['student.batch'],
            status: row['student.status'],
            createdAt: row['student.createdAt']
        }
    }));
}

const getMessage = async (tiketId) => {
    const res = await db.query(`
        SELECT 
            m.id, m.ticket_id as "ticketId", m.content, m.sender, m.timestamp,
            m.staff_id as "staffId", m.student_id as "studentId",
            st.id as "staff.id", st.username as "staff.username",
            s.id as "student.id", s.name as "student.name", s.student_id as "student.studentId"
        FROM messages m
        LEFT JOIN staffs st ON m.staff_id = st.id
        LEFT JOIN students s ON m.student_id = s.id
        WHERE m.ticket_id = $1
        ORDER BY m.timestamp ASC
    `, [tiketId]);

    return res.rows.map(row => ({
        id: row.id,
        ticketId: row.ticketId,
        staffId: row.staffId,
        studentId: row.studentId,
        content: row.content,
        sender: row.sender,
        timestamp: row.timestamp,
        staff: row.staffId ? { id: row['staff.id'], username: row['staff.username'] } : null,
        student: row.studentId ? { id: row['student.id'], name: row['student.name'], studentId: row['student.studentId'] } : null
    }));
}

const assignTicket = async (petugas, ticketId) => {
    const ticketRes = await db.query('SELECT id, status FROM tickets WHERE id = $1 LIMIT 1', [ticketId]);
    const ticket = ticketRes.rows[0];

    if (!ticket) throw new ResponseError(404, "Tiket tidak ditemukan")
    if (ticket.status !== "OPEN") throw new ResponseError(400, "Tiket sudah diambil")

    const res = await db.query(
        'UPDATE tickets SET staff_id = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [petugas.id, 'IN_PROGRESS', ticketId]
    );
    return res.rows[0];
}

const addMessage = async (petugas, ticketId, request) => {
    const ticketRes = await db.query('SELECT id FROM tickets WHERE id = $1 LIMIT 1', [ticketId]);
    if (ticketRes.rowCount === 0) throw new ResponseError(404, "Tiket tidak ditemukan")

    const res = await db.query(
        'INSERT INTO messages (ticket_id, staff_id, content, sender) VALUES ($1, $2, $3, $4) RETURNING *',
        [ticketId, petugas.id, request.content, 'STAFF']
    );
    return res.rows[0];
}

const resolveTicket = async (petugas, ticketId) => {
    const ticketRes = await db.query('SELECT id, staff_id FROM tickets WHERE id = $1 LIMIT 1', [ticketId]);
    const ticket = ticketRes.rows[0];

    if (!ticket) throw new ResponseError(404, "Tiket tidak ditemukan")
    if (ticket.staff_id !== petugas.id) throw new ResponseError(403, "Anda tidak bisa menyelesaikan tiket ini")

    const res = await db.query(
        'UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        ['COMPLETED', ticketId]
    );
    return res.rows[0];
}

export default {
    login, get, logout,
    getTickets, getMessage, assignTicket, addMessage, resolveTicket
}