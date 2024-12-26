import { Router } from "express";
import { subscripeController } from "../controllers/subscripe.controller.js";

export const subscripeRouter = Router();
const controller = subscripeController;

subscripeRouter.post('/verify/email' , controller.verifyEmail);
subscripeRouter.post('/verify/email/check' , controller.verifyEmailCheck);
