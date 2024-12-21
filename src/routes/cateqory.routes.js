import { Router } from "express"
import { categoryContoller } from "../controllers/category.controller.js"
import { uploads } from "../middlewares/multer.middleware.js"
import { userRole } from "../middlewares/role.middleware.js"
import { useAuth } from '../middlewares/auth.middleware.js'
export const categoryRoutes = Router()
const contoller = categoryContoller()


categoryRoutes.post('/create', useAuth ,userRole ,uploads.single('img'), contoller.create)
categoryRoutes.get('/all', contoller.alllist)
categoryRoutes.put('/update/:id',useAuth, userRole, uploads.single('img'), contoller.updateCateqory)
categoryRoutes.delete('/delete/:id',useAuth, userRole, contoller.DeleteCategory)