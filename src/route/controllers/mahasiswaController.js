import { ResponseError } from "../errors/responseError.js"
import mahasiswaService from "../services/mahasiswaService.js"

const login = async (req, res, next) => {
    try {
        const result = await mahasiswaService.login(req.body)

        res.status(200).json({
            status: "Login successfully",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const getCurrent = async (req, res, next) => {
    try {
        const result = await mahasiswaService.getCurrent(req.mahasiswa)

        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    try {
        await mahasiswaService.logout(req.mahasiswa)

        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e)
    }
}

const createTicket = async (req, res, next) => {
    try {
        const result = await mahasiswaService.createTicket(req.mahasiswa, req.body)
        console.log(req.body)

        res.status(200).json({
            status: "Ticket created successfully",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const addMessage = async (req, res, next) => {
    try {
        const ticketId = parseInt(req.params.id1);
        const { content } = req.body;

        if (!content) {
            throw new ResponseError(400, "Pesan tidak boleh kosong");
        }
        const result = await mahasiswaService.addMessage(req.mahasiswa, ticketId, { content });

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getMyTickets = async (req, res, next) => {
    try {
        const result = await mahasiswaService.getMyTickets(req.mahasiswa)

        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const getTicketById = async (req, res, next) => {
    try {
        const result = await mahasiswaService.getTicketById( req.mahasiswa, parseInt(req.params.id2))
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const closeTicket = async (req, res, next) => {
    try {
        const result = await mahasiswaService.closeTicket(
            req.mahasiswa,
            Number(req.params.id)
        )

        res.status(200).json({
            status: "Ticket closed successfully",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export default {
    login, getCurrent, logout, createTicket, addMessage, getMyTickets, getTicketById, closeTicket
}