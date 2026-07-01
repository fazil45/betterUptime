import { type Request, Response } from "express";
import { prisma } from "@repo/db/client";

export const createWebsite = async (req: Request, res: Response) => {
  try {
    if (!req.body.url) {
      return res.status(401).json({ error: "Url not found" });
    }

    const website = await prisma.website.create({
      data: {
        url: req.body.url,
        timeAdded: new Date(),
        user_id: "2",
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
};

export const getWebsite = async (req: Request, res: Response) => {};

