import express from "express";
import routes from "./routes";
import path from "path";
import cors from "cors";
import { errors } from "celebrate";

require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(errors());

app.listen(PORT);
console.log("Server running on port ", PORT);
