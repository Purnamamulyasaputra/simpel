import express from 'express'
import petugasController from '../controllers/petugasController.js';
import { petugasAuth } from '../middleware/petugasAuth.js';

const routerPetugas = express.Router()

routerPetugas.post('/api/petugas/login', petugasController.login);

routerPetugas.get('/api/petugas/current', petugasAuth, petugasController.get);
routerPetugas.delete('/api/petugas/logout', petugasAuth, petugasController.logout);

routerPetugas.get("/api/petugas/tickets", petugasAuth,petugasController.getTickets) 
routerPetugas.get("/api/petugas/tickets/:id", petugasAuth,petugasController.getMessage)
routerPetugas.post("/api/petugas/tickets/:id1/reply", petugasAuth, petugasController.addMessage)
routerPetugas.patch("/api/petugas/tickets/:id1/assign", petugasAuth, petugasController.assignTicket)
routerPetugas.patch("/api/petugas/tickets/:id3/resolve",petugasAuth, petugasController.resolveTicket)

export {
    routerPetugas
}