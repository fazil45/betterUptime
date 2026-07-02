import { createClient } from "redis";

const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error",err))
    .connect()

type WebsiteEvent = {
    url: string,
    id: string
}

export async function xADD({url,id}:WebsiteEvent){
    await client.xAdd(
        "betteruptime:website","*",{
            url,
            id
        }
    )
}

export async function xADDBulk(websites:WebsiteEvent[]){
    websites.forEach(async (website) => {
        await xADD({
            url:website.url,
            id:website.id
        })
    })
}