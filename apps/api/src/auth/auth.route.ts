import express,{ Router } from "express";
import { signin, signup } from "./auth.controller.js";

const authRouter: Router = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);

export default authRouter;