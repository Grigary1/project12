import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoute.js';

//App config
const app=express();
const PORT=process.env.PORT||3000;
console.log("backend",process.env.MONGODB_URL);
connectDB();
//connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin',adminRouter);

//api endpoints
app.get('/',(req,res)=>{
    res.send("API WORKING");
})



app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`);
})