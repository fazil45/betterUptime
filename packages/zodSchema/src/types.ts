import { z } from "zod";

export const CreateUserInput  = z.object({
    email:z.string().email(),
    password:z.string()
})