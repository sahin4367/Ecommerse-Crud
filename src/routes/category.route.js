import { Router } from "express"
import { useAuth, userRole} from '../middlewares/auth.middleware.js'
import { categoryController } from "../controllers/category.controller.js"
import { uploads } from "../middlewares/muter.middleware.js"

export const categoryRoutes = Router()
const controller = categoryController()

categoryRoutes.post("/create", useAuth, userRole, uploads.single('img'), controller.create)
categoryRoutes.get('/all', controller.allCategories)
categoryRoutes.get('/:id', controller.getCategory)
categoryRoutes.patch('/edit/:id',useAuth, userRole, uploads.single('img'), controller.CategoryEdit)
categoryRoutes.delete('/delete/:id',useAuth, userRole, controller.DeleteCategory)