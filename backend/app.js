import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js"


const app = express();

const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Database connection
connectDB(DATABASE_URL);

// CORS policy
app.use(cors());

// JSON
app.use(express.json());

// Load routes
app.use("/api/user", userRoutes);

app.listen(port, () => console.log(`Server running at port: ${port}`));
