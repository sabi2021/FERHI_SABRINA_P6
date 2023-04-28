import { Request, Response } from 'express';
import Sauce from '../models/sauce';
import fs from 'fs';

interface AuthRequest extends Request {
    auth: {
        userId: string;
    };
}

//Afficher toutes les sauces
export const getAllSauces = async (req: Request, res: Response) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

//Afficher une sauce
export const getOneSauce = async (req: Request, res: Response) => {
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
    .then(sauce => {
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce non trouvée' });
        }
        res.status(200).json(sauce);
    })
    .catch(error => res.status(500).json({ error }));
}

//Modification d'une sauce
export const modifySauce = async (req: Request, res: Response) => {
    const sauceId = req.params.id;

    try {
        let sauceObject = JSON.parse(req.body.sauce);
        const file = req.file;
        
        if (file) {
            // S'il y a un fichier, mettre à jour la propriété imageUrl dans sauceObject
            sauceObject = {
                ...sauceObject,
                imageUrl: file.path
            };
        }

        const updatedSauce = await Sauce.findOneAndUpdate({ _id: sauceId }, sauceObject, {
            new: true,
            runValidators: true
        });

        if (!updatedSauce) {
            return res.status(404).json({ error: 'Sauce non trouvée' });
        }

        res.status(200).json({ message: 'Sauce modifiée !', sauce: updatedSauce });
    } catch (error) {
        res.status(400).json({ error });
    }
};

//Suppression d'une sauce
export const deleteSauce = (req: Request, res: Response): void => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauceFind) => {
        const filename = sauceFind?.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch((error: Error) => res.status(400).json({ error }));
        });
      })
      .catch((error: Error) => res.status(500).json({ error }));
  };

//Création d'une sauce
export const saveSauce = async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).auth.userId;
    try {
    
        const bodySauce = JSON.parse(req.body.sauce); //on fait l'inverse de JSON.stringify pour pouvoir accéder au champ name
        const sauceName = bodySauce.name;
        const sauceImage = req.file?.path;

        console.log(sauceName);
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