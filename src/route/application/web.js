import express from 'express'
import { errMiddleware } from '../middleware/errMiddleware.js';
import cors from 'cors'
import { routerAdmin } from '../routes/adminApi.js';
import { routerMahasiswa } from '../routes/mhsApi.js';
import { routerPetugas } from '../routes/petugasApi.js';

export const web = express();

web.use(express.json({ type: ['application/json', 'text/plain'] }));
web.use(express.urlencoded({ extended: true }))
web.use(cors())

web.use(routerPetugas);
web.use(routerMahasiswa);
web.use(routerAdmin);

web.use(errMiddleware);