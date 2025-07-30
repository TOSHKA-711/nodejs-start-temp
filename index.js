import express from "express";
import * as indexRouter from "./src/modules/index.routes.js";
import { connectDB } from "./DB/connection.js";
import { config } from "dotenv";
import path from "path";
import { globalError } from "./src/utils/errorHandler.js";

const app = express();
app.use(express.json());

config({ path: path.resolve("./config/config.env") });

connectDB();
const port = process.env.PORT;

// Routes
app.use("/user", indexRouter.userRoutes);

// Global Error Handler 
app.use(globalError);

app.listen(port, () => console.log(`app start listening on port ${port}!`));
