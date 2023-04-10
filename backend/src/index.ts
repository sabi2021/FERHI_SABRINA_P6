import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from 'mongoose';


import { router } from './config/router';

const app: Express = express();
const port = 3000;

const url = 'mongodb+srv://sabrina_oc:sabrina_oc@cluster0.bsfbryn.mongodb.net/projet6?retryWrites=true&w=majority';

// Connexion à MongoDB
mongoose.connect(url)
  .then(() => {
    console.log('Connexion réussie à MongoDB');
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion à MongoDB :', error);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});