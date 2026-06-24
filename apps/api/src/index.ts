import express, {type Request, type Response} from "express"
const app = express()

app.post("/website",(req:Request,res:Response) => {

})

app.get("/status/:websiteId",(req:Request, res:Response) => {

})

app.listen(3000)