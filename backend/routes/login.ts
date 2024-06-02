import jwt, { Secret } from "jsonwebtoken";
import { Request, Response } from "express";

import dotenv from "dotenv";

dotenv.config();

interface Username {
  userId: number;
  password: string;
  username: any;
}

const mySecret: Secret = process.env.MY_SECRET as Secret;

const getUser = async (username: Username) => {
  return { userId: 123, password: "123457", username };
};

export default async (req: Request, res: Response) => {
  //get the information from payload
  const { username, password } = req.body;

  //checking from the DB
  const user = await getUser(username);

  //if not matching send error
  if (user.password !== password) {
    return res.status(403).json({
      error: "passowrds not matching",
    });
  }

  //@ts-ignore
  delete user.password;

  const token = jwt.sign(user, mySecret, { expiresIn: "1H" });

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.redirect("/welcome");
};
