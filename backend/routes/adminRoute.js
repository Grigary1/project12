import express from 'express';

import {adminLogin, dataFill, showData}from './../controllers/adminController.js'

const adminRouter=express.Router();

adminRouter.post('/login',adminLogin);
adminRouter.post('/filldata',dataFill);
adminRouter.get('/showdata',showData);


export default adminRouter;