import express from "express"
import mongoose from "mongoose";
import 'dotenv/config';
import { v1Router } from "./src/routes/index.js";
import { appConfig } from "./src/consts.js";
// import cron from 'node-cron';


const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

mongoose.connect(appConfig.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

// cron.schedule('*/1 * * * *', (req,res) => {
//     res.send('running a task every 2 minutes');
//     console.log('running a task every minute');
//     });




app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
});