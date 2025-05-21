
import express from 'express';
import {adminLogin,dataFill,showData,dataFillBatch,validateUsersBatch, deleteData} from './../controllers/adminController.js';
import { verifyAdminToken } from '../middleware/verifyAdminToken.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.post('/filldata', dataFill);
adminRouter.post('/filldata/batch', dataFillBatch);
adminRouter.post('/deletedata', deleteData);
adminRouter.get('/showdata', showData);

export default adminRouter;
