import "dotenv/config"
import { prisma } from "@repo/db/client";
import { CreateUserInput } from "@repo/zodSchema";
import express, { CookieOptions, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3000

const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, 
  path: "/",
}


app.use(express.json());

app.post("/user/signup", async (req: Request, res: Response) => {
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
});

app.post("/user/signin", async (req: Request, res: Response) => {

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

    res.status(201).cookie("token",token,cookieOption).json({
      message: "Signin successfully ",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/website", async (req: Request, res: Response) => {
  try {
    if (!req.body.url) {
      return res.status(401).json({ error: "Url not found" });
    }

    const website = await prisma.website.create({
      data: {
        url: req.body.url,
        timeAdded: new Date(),
        user_id:"2"
      },
    });

    res.status(201).json({
      id: website.id,
    });
  } catch (error) {
    console.error("Prisma Error:", error);

    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/status/:websiteId", (req: Request, res: Response) => {});

app.listen(PORT ,() => {
  console.log(`Server is running on ${PORT} port `)
});
