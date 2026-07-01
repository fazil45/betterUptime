import "dotenv/config"
import express from "express";
import websiteRouter from "./websites/website.route.js";
import authRouter from "./auth/auth.route.js";
import cookieParser from "cookie-parser"


const app = express();
const PORT = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json());

app.use("/website",websiteRouter)
app.use("/user",authRouter)


app.listen(PORT ,() => {
  console.log(`Server is running on ${PORT} port `)
});
