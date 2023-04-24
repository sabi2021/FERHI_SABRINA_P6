import { Request, Response } from 'express';
import Sauce from '../models/sauce';

export const getAllSauces = async (req: Request, res: Response) => {
    try {
        res.status(201).json({ message: 'Voici les sauces !' });
    } catch (error) {
        res.status(400).json({ error });
    }
}

interface AuthRequest extends Request {
    auth?: {
      userId: string;
    };
  }

export const saveSauce = async (req: AuthRequest, res: Response) => {
    const userId = req.auth?.userId;
    try {
        const sauceName = req.body.sauce;
        const sauceImage = req.body.image;

        const sauce = new Sauce({
            userId: userId,
            name: sauceName,
            imageUrl: sauceImage,
            likes: 0,
            dislikes: 0,
        });
        await sauce.save();
        res.status(201).json({ message: 'Sauce créée !' });
    } catch (error) {
        res.status(400).json({ error });
    }
}