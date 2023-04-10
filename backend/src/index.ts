import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";

import { router } from './config/router';

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});