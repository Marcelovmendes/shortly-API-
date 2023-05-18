import {Router} from "express";
import {sigIn, signUp}  from "../controllers/sign.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { sigInSchema, signUpSchema } from "../schemas/sign.shcema";
import { validateSign, validateSignUp } from "../middlewares/validateSign.middleware.js";

const signRouter = Router();

signRouter.post("/signup",validateSchema(signUpSchema),validateSignUp, signUp);
signRouter.post("/signIn",validateSchema(sigInSchema),validateSign,sigIn)