import {Router} from "express";
import {postShorten} from "../controllers/shortUrl.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { shortenSchema } from "../schemas/shorten.schema.js";
import { validateShorten } from "../middlewares/authValidate.middleware.js";

const shortenRouter = Router()

shortenRouter.post("/urls/shorten",validateSchema(shortenSchema),validateShorten,postShorten)

export default shortenRouter
