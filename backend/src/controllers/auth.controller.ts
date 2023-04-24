import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

export const signup = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        res.status(400).json({ error });
    }
}

export const login = async (req: Request, res: Response) => {

    const user = await getUserByEmail(req.body.email);

    try {
        if (!user) {
            return res.status(401).send({ message: "Email incorrect." });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Password incorrect." });
        } else {
            console.log("Authentification success");
        }
    } catch (error) {
        res.status(500).json({ error });
    }
    
    const jwt_secret = process.env.JWT_TOKEN || '';
    const token = jwt.sign({ userId: user }, jwt_secret);
    res.send({ token });
}

/**
 * @TODO getUserByEmail
 */
async function getUserByEmail(email: string) {
    // Code pour récupérer l'utilisateur dans la base de données MongoDB
    let user;
    try {
        user = await User.findOne({ email });
    } catch (error) {
        
    }
    return user || null;
}