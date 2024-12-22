import { Router } from "express"
import { AdminController } from "../controllers/admin.controller.js"
import {  roleCheck, useAuth,  } from "../middlewares/auth.middleware.js"

export const adminRoutes = Router()
const contoller = AdminController()

// -> /api/admin/create
adminRoutes.post("/create", useAuth, roleCheck(['admin',]),  contoller.adminCreate)
adminRoutes.put("/edit/:id", useAuth, roleCheck(['admin']),  contoller.adminEdit)