import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDb from './config/connectDb.js'
import colors from 'colors'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

connectDb()

const app=express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use("/auth",authRoutes)

app.get("/",(req,res)=>
res.send("hai hello")
)

const PORT=8000

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`.bgCyan.white)
})


