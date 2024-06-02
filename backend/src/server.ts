import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import loginRoute from "../routes/login";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cookieParser());

app.use(
  urlencoded({
    extended: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/welcome", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/welcome.html"));
});

app.post("/login", loginRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
