import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import * as sauceController from '../controllers/sauce.controller';
import authMiddleware from "../middleware/auth";

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
sauceRoutes.get("/", sauceController.getAllSauces);
sauceRoutes.post("/", authMiddleware, sauceController.saveSauce);
router.use('/sauces', sauceRoutes);

export { router };