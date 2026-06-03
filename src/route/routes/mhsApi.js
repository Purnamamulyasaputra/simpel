import express from "express"
import mahasiswaController from "../controllers/mahasiswaController.js"
import { mhsAuth } from "../middleware/mhsAuth.js"

export const routerMahasiswa = new express.Router()

routerMahasiswa.post("/api/mahasiswa/login", mahasiswaController.login)
routerMahasiswa.get("/api/mahasiswa/current",mhsAuth,mahasiswaController.getCurrent)
routerMahasiswa.delete("/api/mahasiswa/logout",mhsAuth,mahasiswaController.logout)
routerMahasiswa.post("/api/mahasiswa/tickets",mhsAuth,mahasiswaController.createTicket)
routerMahasiswa.post("/api/mahasiswa/tickets/:id1/message",mhsAuth,mahasiswaController.addMessage)
routerMahasiswa.get("/api/mahasiswa/tickets",mhsAuth,mahasiswaController.getMyTickets)
routerMahasiswa.get("/api/mahasiswa/tickets/:id2",mhsAuth,mahasiswaController.getTicketById)
routerMahasiswa.patch("/api/mahasiswa/tickets/:id/close",mhsAuth,mahasiswaController.closeTicket)
