import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import cors from "cors";

import loginRoute from "../routes/login";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(
  urlencoded({
    extended: true,
  })
);

app.get("/api/data", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express!" });
});

// app.get("/welcome", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "../public/welcome.html"));
// });

// app.post("/login", loginRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
