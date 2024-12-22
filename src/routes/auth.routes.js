import { Router } from "express"
import { AuthController } from "../controllers/auth.controller.js"

export const authRoutes = Router()
const controller = AuthController()

// -> /api/auth/login
authRoutes.post("/login", controller.login)
authRoutes.post("/register", controller.register)