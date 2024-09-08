import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';

import path from 'path';
import fs from 'fs';
import korisnikRuter from './routers/korisnik.router';
import FirmeRouter from './routers/firme.router';
import ZakazivanjaRouter from './routers/zakazivanja.router';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import bodyParser from 'body-parser';
import OdbijeniceRouter from './routers/odbijenice.router';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/basta");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use('/uploads', express.static(uploadsPath));
console.log('Uploads directory:',uploadsPath);

const router = express.Router();

router.use('/users', korisnikRuter)
router.use('/firme', FirmeRouter)
router.use('/zakazivanja', ZakazivanjaRouter)
router.use('/odbijenice', OdbijeniceRouter)
app.use("/", router);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));

/*
function gracefulShutdown() {
  console.log('Closing MongoDB connection...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);*/
