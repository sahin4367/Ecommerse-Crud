import { Router } from "express"
import { useAuth, userRole} from '../middlewares/auth.middleware.js'
import { contactController } from "../controllers/contact.controller.js"

export const contactRoutes = Router()
const controller = contactController()

contactRoutes.post("/create", useAuth, controller.create)
contactRoutes.get('/all/messages', useAuth, userRole, controller.allMessages)
contactRoutes.get('/:id', useAuth, userRole, controller.getMessage)