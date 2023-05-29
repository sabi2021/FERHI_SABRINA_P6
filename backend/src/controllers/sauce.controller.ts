import { Request, Response } from 'express';
import Sauce from '../models/sauce';
import fs, { cp } from 'fs';
import { AuthRequest } from '~/middleware/auth';

//Afficher toutes les sauces
export const getAllSauces = async (req: Request, res: Response) => {
    Sauce.find().lean()
    .then(sauces => {
        const new_sauces = sauces.map(sauce => ({ ...sauce, imageUrl: `http://localhost:${process.env.port || 3000}/${sauce.imageUrl}` }))
        res.status(200).json(new_sauces)
    })
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

        sauce.imageUrl = `http://localhost:${process.env.port || 3000}/${sauce.imageUrl}`;

        res.status(200).json(sauce);
    })
    .catch(error => res.status(500).json({ error }));
}

//Modification d'une sauce
export const modifySauce = async (req: Request, res: Response) => {
    const sauceId = req.params.id;
    
    try {
        let sauceObject = req.body;
        const sauce = await Sauce.findOne({ _id: sauceId });

        if (!sauce) {
            return res.status(404);
        }
        console.log((req as AuthRequest).auth.userId);
        console.log(sauce.userId);

        //On refuse la modification à l'utilisateur qui n'est pas propriétaire de la sauce
        if ((req as AuthRequest).auth.userId !== sauce.userId) {
            return res.status(401).json({ message: 'Pas le droit de modifier cette sauce !'});
        }
        
        if (req.file) {
            // S'il y a un fichier, mettre à jour la propriété imageUrl dans sauceObject
            sauceObject = {
                ...sauceObject,
                imageUrl: req.file.path //on met le chemin de la nouvelle image
            };

            console.log(sauce.schema?.obj.imageUrl);
            //Suppression de l'ancienne image
            const filename = sauce?.imageUrl.split('images\\')[1];
            fs.unlink(`images/${filename}`, () => {
                console.log("image supprimée");
            });
        }
        
        const updatedSauce = await Sauce.findOneAndUpdate({ _id: sauceId }, sauceObject, {
            new: true,
            runValidators: true
        });

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
  
//Liker une sauce
export const likeSauce = async (req: Request, res: Response) => {
    const authRequest = req as AuthRequest;
    if (req.body.like === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: req.body.like++ },
            $push: { usersLiked: req.body.userId }
          }
        )
          .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
          .catch((error) => res.status(400).json({ error }));
      } else if (req.body.like === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: (req.body.like++) * -1 },
            $push: { usersDisliked: req.body.userId }
          }
        )
          .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            if (sauce?.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
              )
                .then((sauce) => {
                  res.status(200).json({ message: 'Like en moins !' });
                })
                .catch((error) => res.status(400).json({ error }));
            } else if (sauce?.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }
              )
                .then((sauce) => {
                  res.status(200).json({ message: 'Dislike en moins !' });
                })
                .catch((error) => res.status(400).json({ error }));
            }
          })
          .catch((error) => res.status(400).json({ error }));
      }   
};

//Création d'une sauce
export const saveSauce = async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).auth.userId;
    try {
    
        const { name, manufacturer, description, mainPepper, heat } = JSON.parse(req.body.sauce); //on fait l'inverse de JSON.stringify pour pouvoir accéder au champ name
        const imageUrl = req.file?.path;

        const sauce = new Sauce({
            userId,
            name,
            description,
            manufacturer,
            mainPepper,
            heat,
            imageUrl,
            likes: 0,
            dislikes: 0,
        });

        await sauce.save();
        res.status(201).json({ message: 'Sauce créée !' });
    } catch (error) {
        res.status(400).json({ error });
    }
}