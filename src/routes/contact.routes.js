import { Router } from "express";
import { contactController } from "../controllers/contact.controller.js";
import { useAuth } from "../middlewares/auth.middleware.js";
import { userRole } from "../middlewares/role.middleware.js";

export const contactRoutes = Router();
const controller = contactController();

contactRoutes.post('/create', useAuth ,userRole ,controller.createContact);
contactRoutes.get('/all', useAuth , userRole ,controller.allMessages);
contactRoutes.get('/:id', useAuth, userRole, controller.getMessages);