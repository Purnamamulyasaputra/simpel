import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid'
import { db } from "../application/database.js"
import { validate } from "../validations/validation.js"
import { ResponseError } from "../errors/responseError.js"
import { createTicketValidation, loginMahasiswaValidation } from "../validations/mhsValidation.js"

const login = async (request) => {
    const loginRequest = validate(loginMahasiswaValidation, request)

    const res = await db.query('SELECT * FROM students WHERE student_id = $1 LIMIT 1', [loginRequest.studentId]);
    const mahasiswa = res.rows[0];

    if (!mahasiswa) throw new ResponseError(401, `NIM yang anda masukkan ${loginRequest.studentId} tidak ditemukan`)

    const isPasswordValid = await bcrypt.compare(loginRequest.password, mahasiswa.password)

    if (!isPasswordValid) throw new ResponseError(401, "Password yang anda masukkan salah.")

    // Generate token UUID dan simpan ke database
    const token = uuidv4();
    await db.query('UPDATE students SET token = $1 WHERE id = $2', [token, mahasiswa.id]);

    return {
        id: mahasiswa.id,
        studentId: mahasiswa.student_id,
        name: mahasiswa.name,
        token: token
    };
}

const getCurrent = async (mahasiswa) => {
    const res = await db.query(
        'SELECT id, student_id as "studentId", email, name, birth_date as "birthDate", gender, major, batch, status, created_at as "createdAt", updated_at as "updatedAt" FROM students WHERE id = $1 LIMIT 1',
        [mahasiswa.id]
    );
    return res.rows[0];
}

const logout = async (mahasiswa) => {
    // Hapus token dari database saat logout
    await db.query('UPDATE students SET token = NULL WHERE id = $1', [mahasiswa.id]);
    return "OK";
}

const createTicket = async (mahasiswa, request) => {
    if (!request.category || !request.description) {
        throw new ResponseError(400, "Kategori dan deskripsi harus diisi")
    }

    const res = await db.query(
        'INSERT INTO tickets (category, description, status, student_id) VALUES ($1, $2, $3, $4) RETURNING id, category, description, status, created_at as "createdAt"',
        [request.category, request.description, 'OPEN', mahasiswa.id]
    );
    return res.rows[0];
}

const addMessage = async (mahasiswa, ticketId, request) => {
    const tiketCheckRes = await db.query('SELECT id FROM tickets WHERE id = $1 LIMIT 1', [ticketId]);
    if (tiketCheckRes.rowCount === 0) throw new ResponseError(404, "Tiket tidak ditemukan");

    const res = await db.query(
        'INSERT INTO messages (ticket_id, student_id, content, sender) VALUES ($1, $2, $3, $4) RETURNING *',
        [ticketId, mahasiswa.id, request.content, 'STUDENT']
    );
    return res.rows[0];
}

const getMyTickets = async (mahasiswa) => {
    const res = await db.query(
        'SELECT id, category, description, status, staff_id as "staffId", created_at as "createdAt", updated_at as "updatedAt" FROM tickets WHERE student_id = $1 ORDER BY created_at DESC',
        [mahasiswa.id]
    );
    return res.rows;
}

const getTicketById = async (mahasiswa, ticketId) => {
    const ticketRes = await db.query(
        'SELECT t.id, t.category, t.description, t.status, t.staff_id as "staffId", t.created_at as "createdAt", t.updated_at as "updatedAt", s.id as "student.id", s.student_id as "student.studentId", s.email as "student.email", s.name as "student.name", s.birth_date as "student.birthDate", s.gender as "student.gender", s.major as "student.major", s.batch as "student.batch", s.status as "student.status", st.username as "staff.username" FROM tickets t JOIN students s ON t.student_id = s.id LEFT JOIN staffs st ON t.staff_id = st.id WHERE t.id = $1 AND t.student_id = $2 LIMIT 1',
        [ticketId, mahasiswa.id]
    );

    if (ticketRes.rowCount === 0) {
        throw new ResponseError(404, "Ticket not found")
    }

    const t = ticketRes.rows[0];
    const ticket = {
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
        staff: t.staffId ? { id: t.staffId, username: t['staff.username'] } : null
    };

    const messagesRes = await db.query(
        'SELECT m.id, m.content, m.sender, m.timestamp, m.staff_id as "staffId", st.username as "staffUsername", m.student_id as "studentId", s.name as "studentName", s.student_id as "studentStudentId" FROM messages m LEFT JOIN staffs st ON m.staff_id = st.id LEFT JOIN students s ON m.student_id = s.id WHERE m.ticket_id = $1 ORDER BY m.id ASC',
        [ticketId]
    );

    ticket.messages = messagesRes.rows.map(m => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        timestamp: m.timestamp,
        staff: m.staffId ? { id: m.staffId, username: m.staffUsername } : null,
        student: m.studentId ? { id: m.studentId, studentId: m.studentStudentId, name: m.studentName } : null
    }));

    return ticket;
}

const closeTicket = async (mahasiswa, ticketId) => {
    const ticketRes = await db.query('SELECT id FROM tickets WHERE id = $1 AND student_id = $2 LIMIT 1', [ticketId, mahasiswa.id]);
    
    if (ticketRes.rowCount === 0) {
        throw new ResponseError(404, "Tiket tidak ditemukan")
    }

    const updateRes = await db.query(
        'UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status, updated_at as "updatedAt"',
        ['CLOSED', ticketId]
    );
    return updateRes.rows[0];
}

export default {
    login, getCurrent, logout, createTicket, addMessage, getMyTickets, getTicketById, closeTicket
}