import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoute.js';

//app config
const app=express();
const PORT=process.env.PORT||3000;
console.log("backend",process.env.MONGODB_URL);
connectDB();

//middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/admin',adminRouter);

app.get('/',(req,res)=>{
    res.send("API WORKING");
})



app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`);
})