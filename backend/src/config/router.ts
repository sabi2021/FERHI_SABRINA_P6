import { Router } from 'express';

import * as authController from '../controllers/auth.controller';

const router = Router();

// AUTH
const authRoutes = Router();
authRoutes.post('/signup', authController.signup);
authRoutes.post('/login', authController.login);
router.use('/auth', authRoutes);

// SAUCES
const sauceRoutes = Router();
// sauceRoutes.get /
// sauceRoutes.get /:sauceId
router.use('/sauces', sauceRoutes);

export { router };