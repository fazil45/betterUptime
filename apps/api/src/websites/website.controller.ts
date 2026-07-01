import { json, type Request, Response } from "express";
import { prisma } from "@repo/db/client";

export const createWebsite = async (req: Request, res: Response) => {
  try {
    if (!req.body.url) {
      return res.status(401).json({ error: "Url not found" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    const website = await prisma.website.create({
      data: {
        url: req.body.url,
        timeAdded: new Date(),
        user_id: userId,
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

export const getWebsite = async (req: Request, res: Response) => {
  try {
    const websiteId = req.params.websiteId as string;

    if (!websiteId) {
      return res.status(404).json({
        error: "WebsiteId not found",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    const website = await prisma.website.findFirst({
      where: {
        user_id: userId,
        id: websiteId,
      },
      include: {
        ticks: {
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          take: 1,
        },
      },
    });

    if (!website) {
      return res.status(409).json({
        error: "Not found",
      });
    }

    res.status(200).json({ website: website });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
