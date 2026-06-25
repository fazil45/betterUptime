import "dotenv/config"
import { prisma } from "@repo/db/client";
import express, { json, type Request, type Response } from "express";
const app = express();

app.use(express.json());

app.post("/website", async (req: Request, res: Response) => {
  try {
    if (!req.body.url) {
      return res.status(401).json({ error: "Url not found" });
    }

    const website = await prisma.website.create({
      data: {
        url: req.body.url,
        timeAdded: new Date(),
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

app.listen(3000);
