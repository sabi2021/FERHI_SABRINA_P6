import jwt from "jsonwebtoken";
import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {

}

export const login = async (req: Request, res: Response) => {
    const user = await getUserByUsername(req.body.username);
    if (!user) {
        return res.status(401).send({ message: "Username incorrect." });
    }

    const isPasswordValid = req.body.password === user.password;
    if (!isPasswordValid) {
        return res.status(401).send({ message: "Password incorrect." });
    } else {
        console.log("Authentification success");
    }

    const token = jwt.sign({ userId: user.id }, "secret");
    res.send({ token });
}

function getUserByUsername(username: string) {
    // Code pour récupérer l'utilisateur dans la base de données non sécurisée 
    const users = [
        { id: 1, username: 'user1', password: 'user1' },
        { id: 2, username: 'user2', password: 'user2' },
        { id: 3, username: 'user3', password: 'user3' }
    ];

    const user = users.find(u => u.username === username);
    return user || null;
}