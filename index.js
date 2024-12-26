import express from "express"
import monngose from "mongoose"
import 'dotenv/config';
import { v1Router } from "./src/routes/index.js";
import { appConfig } from "./src/consts.js";

const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

monngose.connect(appConfig.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

app.listen(appConfig.PORT, () => {
    console.log("Server is running on port 6000");
});