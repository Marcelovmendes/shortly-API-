import {Router} from "express";
import {deleteUrl, getRanking, getUrlById, getUser, postShorten, redirectUrl} from "../controllers/shortUrl.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { shortenSchema } from "../schemas/shorten.schema.js";
import { ValidategetUser, validateDeleteShorten, validateShorten } from "../middlewares/authValidate.middleware.js";

const shortenRouter = Router()

shortenRouter.post("/urls/shorten",validateSchema(shortenSchema),validateShorten,postShorten)
shortenRouter.get("/urls/:id",getUrlById)
shortenRouter.get("/urls/open/:shortUrl",redirectUrl)
shortenRouter.delete("/urls/:id",validateDeleteShorten,deleteUrl)
shortenRouter.get("/users/me",ValidategetUser,getUser)
shortenRouter.get("/ranking",getRanking)

export default shortenRouter
