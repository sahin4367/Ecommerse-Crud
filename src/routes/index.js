import { Router } from 'express'
import { authRoutes } from './auth.routes.js';
import { categoryRoutes } from './category.route.js';
import { contactRoutes } from './contact.route.js';
import { adminRoutes } from './admin.routes.js';
import { subscripeRouter } from './subscripe.routes.js';
import { productRouter } from './product.routes.js';

export const v1Router = Router();

v1Router.get('/health', (req, res) => {
    res.send('OK');
});

v1Router.use('/auth', authRoutes);
v1Router.use('/category', categoryRoutes)
v1Router.use('/contact', contactRoutes)
v1Router.use('/admin', adminRoutes)
v1Router.use('/subscription', subscripeRouter)
v1Router.use('/product' , productRouter)
