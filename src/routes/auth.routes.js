import { Router } from 'express';
import { getAllUsers, signIn, signUp } from '../controllers/sign.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import { sigInSchema, signUpSchema } from '../schemas/sign.shcema.js';
import {
  validateSign,
  validateSignUp,
} from '../middlewares/validateSign.middleware.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateSchema(signUpSchema),
  validateSignUp,
  signUp,
);
authRouter.post('/signin', validateSchema(sigInSchema), validateSign, signIn);
authRouter.get('/sessions', getAllUsers);

export default authRouter;
