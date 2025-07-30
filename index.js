import express from "express";
import { config } from "dotenv";
import path from "path";
import { initialApp } from "./src/utils/initialApp.js";

const app = express();
app.use(express.json());

config({ path: path.resolve("./config/config.env") });

initialApp(app, express);
