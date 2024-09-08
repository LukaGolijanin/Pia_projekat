import express from 'express';
import { FirmeController } from '../controllers/firme.controller';

const FirmeRouter = express.Router();

FirmeRouter.route('/getFirme').get(
    (req, res) => new FirmeController().getFirme(req, res)
)

FirmeRouter.route('/registrujFirmu').post(
    (req, res) => new FirmeController().registrujFirmu(req, res)
)
export default FirmeRouter;