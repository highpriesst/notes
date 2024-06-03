import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import argon2d from "argon2";
import { v4 as uuidv4 } from "uuid";

interface Session {
  email: string;
  userId: number | undefined;
}

dotenv.config();

const app = express();
const port = process.env.PORT;
const prisma = new PrismaClient();
const sessions: { [sessionId: string]: Session } = {};
const mySecret = process.env.MY_SECRET;

app.use(cookieParser(mySecret));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.options("/logout", async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Max-Age": "86400",
  });
  res.status(204).end();
});

async function hashPassword(password: string) {
  const hash = await argon2d.hash(password);
  return hash;
}

export const connectToDatabase = async () => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

//Works 👍
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express!" });
});

//Login works 👍
app.post("/login", async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "no user" });
    }

    const passwordMatch = await argon2d.verify(user.password, password);
    if (passwordMatch) {
      //worked
      const sessionId = uuidv4();
      sessions[sessionId] = { email, userId: user?.id };
      res.set("Set-Cookie", `session=${sessionId}`);
      res.json({ token: sessionId });
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: error });
  }
});

//Register works 👍
app.post("/register", async (req: Request, res: Response) => {
  const password = await hashPassword(req.body.password);
  const { email, name } = req.body;

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
        password,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    const cookies = req.headers.cookie;
    let sessionId: string | undefined = undefined;

    // console.log(cookies);

    if (cookies) {
      const cookieArray: [string, string][] = cookies
        .split(";")
        .map((cookie) => cookie.trim().split("=") as [string, string]);
      const cookieMap = new Map(cookieArray);
      sessionId = cookieMap.get("sessionId");
    }

    if (sessionId && sessions[sessionId]) {
      delete sessions[sessionId];
    }

    // Generate a new session ID
    const newSessionId = uuidv4();
    sessions[newSessionId] = { email, userId: newUser.id };

    // Set the new session ID in the response cookie
    res.cookie("sessionId", newSessionId, { httpOnly: true });

    return res.json({
      message: `${req.body.name} account has been created!`,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: error });
  }
});

//Works 👍
app.post("/createNote", async (req: Request, res: Response) => {
  const cookies = req.headers.cookie;
  let sessionId: string | undefined = undefined;

  const { title, content } = req.body;

  if (cookies) {
    const cookieArray: [string, string][] = cookies
      .split(";")
      .map((cookie) => cookie.trim().split("=") as [string, string]);
    const cookieMap = new Map(cookieArray);
    sessionId = cookieMap.get("sessionId");
  }

  if (!sessionId) {
    return res.status(401).send("Invalid session");
  }

  const userSession = sessions[sessionId];

  if (!userSession) {
    return res.status(401).send("Invalid session");
  }

  const userId = userSession.userId;

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
      },
    });
    res.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note" });
  }
});

app.get("/notes", async (req: Request, res: Response) => {
  const cookies = req.headers.cookie;
  let sessionId: string | undefined = undefined;

  // console.log(cookies);

  if (cookies) {
    const cookieArray: [string, string][] = cookies
      .split(";")
      .map((cookie) => cookie.trim().split("=") as [string, string]);
    const cookieMap = new Map(cookieArray);
    sessionId = cookieMap.get("sessionId");
  }

  //Correct console.log(sessionId);

  if (!sessionId) {
    return res.status(401).send("Invalid session");
  }

  const userSession = sessions[sessionId];

  if (!userSession) {
    return res.status(401).send("Invalid session");
  }

  const userId = userSession.userId;

  try {
    const notes = await prisma.note.findMany({
      where: {
        authorId: userId,
      },
    });

    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

app.post("/logout", async (req: Request, res: Response) => {
  //@ts-ignore
  const sessionId = req.headers.cookie.split("=")[1];
  delete sessions[sessionId];

  res.clearCookie("session");
  res.send("successfully logged out");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
