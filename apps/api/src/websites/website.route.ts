import express, {  Router } from "express";
import { createWebsite, getWebsite } from "./website.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const websiteRouter:Router = express.Router();

websiteRouter.post("/create", authMiddleware, createWebsite)
websiteRouter.get("/status/:websiteId",authMiddleware, getWebsite)

export default websiteRouter