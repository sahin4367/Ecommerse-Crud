import { Router } from "express"
import { AdminController } from "../controllers/admin.controller.js"
import { useAuth, userRole } from "../middlewares/auth.middleware.js"

export const adminRoutes = Router()
const contoller = AdminController()

// -> /api/admin/create
adminRoutes.post("/create", useAuth, userRole, contoller.adminCreate)