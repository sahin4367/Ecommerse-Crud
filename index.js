import express from "express"
import monngose from "mongoose"
import { v1Router } from "./src/routes/index.js";
import { appConfig } from "./src/consts.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

monngose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 8080");
});