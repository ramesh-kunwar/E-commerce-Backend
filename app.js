import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan"; // morgan is a logger



const app = express();

// write all the middleware below the app because if app is created then only we run

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ encoded: true }))
app.use(cookieParser())

//morgan logger
app.use(morgan("tiny")) // it prints info about API req and res in console


export default app;