import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import shortenRouter from "./routes/shorten.routes.js";




const app = express()
app.use(cors())
app.use(express.json())
app.use(authRouter)
app.use(shortenRouter)


const PORT = 5000
app.listen(PORT, ()=> console.log("Server is running on port " + PORT))