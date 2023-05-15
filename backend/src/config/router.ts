import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import * as sauceController from '../controllers/sauce.controller';
import authMiddleware from "../middleware/auth";
import upload from "../middleware/multer-config";


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
sauceRoutes.get("/", authMiddleware, upload, sauceController.getAllSauces);
sauceRoutes.get("/:id", authMiddleware, upload, sauceController.getOneSauce);
sauceRoutes.put("/:id", authMiddleware, upload, sauceController.modifySauce);
sauceRoutes.delete("/:id", authMiddleware, sauceController.deleteSauce);
sauceRoutes.post("/:id/like", authMiddleware, sauceController.likeSauce);
sauceRoutes.post("/", authMiddleware, upload, sauceController.saveSauce);
router.use('/sauces', sauceRoutes);

export { router };