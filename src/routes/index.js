import { Router } from 'express'
import { authRoutes } from './auth.routes.js';
import { categoryRoutes } from './cateqory.routes.js';
import { productRoutes } from './product.routes.js';
import { contactRoutes } from './contact.routes.js';

export const v1Router = Router();

v1Router.get('/health', (req, res) => {
    res.send('OK');
});

v1Router.use('/auth' ,authRoutes);
v1Router.use('/cateqory' , categoryRoutes);
v1Router.use('/product', productRoutes);
v1Router.use('/contact', contactRoutes);