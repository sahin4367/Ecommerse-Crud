import { Router } from "express"
import { roleCheck, useAuth} from '../middlewares/auth.middleware.js'
import { categoryContoller } from "../controllers/category.controller.js"
import { uploads } from "../middlewares/muter.middleware.js"

export const categoryRoutes = Router()
const contoller = categoryContoller()

categoryRoutes.post("/create", useAuth, roleCheck(['admin','moderator']), uploads.single('img'), contoller.create)
categoryRoutes.get('/all', contoller.allCategories)
categoryRoutes.get('/:id', contoller.getCategory)
categoryRoutes.patch('/edit/:id',useAuth, roleCheck(['admin', 'moderator']), uploads.single('img'), contoller.CategoryEdit)
categoryRoutes.delete('/delete/:id',useAuth, roleCheck(['admin', 'moderator']), contoller.DeleteCategory)