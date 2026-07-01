import express, {  Router } from "express";
import { createWebsite, getWebsite } from "./website.controller.js";
const websiteRouter:Router = express.Router();

websiteRouter.post("/create", createWebsite)
websiteRouter.get("/status/:websiteId", getWebsite)

export default websiteRouter