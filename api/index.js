import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/authRoute.js'
import adminRoutes from './routes/adminRoute.js'
import cookieParser from 'cookie-parser';
dotenv.config()


mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDb');
}).catch((error)=>{
    console.log(error);
    
})
const app = express()
app.use(express.json())
app.use(cookieParser())
app.listen(3000,()=>{
    console.log('Server listening on port 3000!');
    
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "internal server error"
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    })
})