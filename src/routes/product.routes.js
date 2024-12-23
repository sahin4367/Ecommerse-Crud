import { Router } from "express";
import multer from "multer";
import { useAuth } from "../middlewares/auth.middleware.js";
import { userRole } from "../middlewares/role.middleware.js";
import { productController } from "../controllers/product.controller.js";

export const productRoutes = Router();
const controller = productController();

const uploads = multer();

productRoutes.post('/create' ,useAuth,userRole, controller.createProduct);
