import express from 'express'
import adminController from '../controllers/adminController.js';
import { adminAuth } from '../middleware/AdminAuth.js';

const routerAdmin = express.Router()

routerAdmin.post('/api/admin/register', adminController.register);
routerAdmin.post('/api/admin/login', adminController.login);

routerAdmin.use(adminAuth)
// Admin
routerAdmin.get('/api/admin/current/:id1', adminController.get);
routerAdmin.get('/api/admin/current', adminController.getAll);
routerAdmin.patch('/api/admin/current', adminController.update);
routerAdmin.delete('/api/admin/logout', adminController.logout);

// Petugas
routerAdmin.post('/api/admin/petugas/login', adminController.loginPetugas);
routerAdmin.post('/api/admin/petugas', adminController.addPetugas);
routerAdmin.get('/api/admin/petugas/:id2', adminController.getPetugas);
routerAdmin.get('/api/admin/petugas', adminController.getAllPetugas);
routerAdmin.patch('/api/admin/petugas/update/:id3', adminController.updatePetugas);
routerAdmin.delete('/api/admin/petugas/:id4', adminController.removePetugas);

// Mahasiswa
routerAdmin.post('/api/admin/mhs', adminController.addMhs);
routerAdmin.get('/api/admin/mhs/:id5', adminController.getMhs);
routerAdmin.get('/api/admin/mhs', adminController.getAllMhs);
routerAdmin.put('/api/admin/mhs/update/:id6', adminController.updateMhs);
routerAdmin.delete('/api/admin/mhs/:id7', adminController.removeMhs);

// Tiket
routerAdmin.get('/api/admin/ticket/:id8', adminController.getTiket);
routerAdmin.get('/api/admin/tickets', adminController.getAllTiket);


export {
    routerAdmin
}