import {Router} from "express";
import {signUp}  from "../controllers/sign.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { signUpSchema } from "../schemas/sign.shcema";
import { validateSignUp } from "../middlewares/validateSignUp.middleware.js";

const signRouter = Router();

signRouter.post("/signup",validateSchema(signUpSchema),validateSignUp, signUp);