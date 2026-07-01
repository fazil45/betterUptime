import { prisma } from "@repo/db/client";
import { CreateUserInput } from "@repo/zodSchema";
import  {
  CookieOptions,
  type Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedInputData = CreateUserInput.safeParse(req.body);
    if (!parsedInputData.success) {
      return res.status(403).json({ error: "Incorrect inputs" });
    }

    const email = parsedInputData.data.email;
    const password = parsedInputData.data.password;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User successfully created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const parsedInputData = CreateUserInput.safeParse(req.body);
    if (!parsedInputData.success) {
      return res.status(403).json({ error: "Incorrect inputs" });
    }

    const email = parsedInputData.data.email;
    const password = parsedInputData.data.password;

    const checkUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!checkUser) {
      return res.status(404).json({ error: "Create an account" });
    }

    const matchPassword = bcrypt.compare(password, checkUser.password);

    if (!matchPassword) {
      return res.status(403).json({ error: "Incorrect Inputs" });
    }

    const token = jwt.sign(
      {
        id: checkUser.id,
      },
      process.env.JWT_SECRET!,
    );

    res.status(201).cookie("token", token, cookieOption).json({
      message: "Signin successfully ",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


