import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

import { router } from './config/router';

const app: Express = express();
const port = process.env.port || 3000;
const mongodbUrl = process.env.BDD || '';

// Connexion à MongoDB
mongoose.connect(mongodbUrl)
  .then(() => {
    console.log('Connexion réussie à MongoDB');
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion à MongoDB :', error);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/images', express.static('images'));

app.use('/api', router);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});