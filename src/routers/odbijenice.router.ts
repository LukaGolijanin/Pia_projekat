import express from 'express';
import { OdbijeniceController } from '../controllers/odbijenice.controller';

const OdbijeniceRouter = express.Router();

OdbijeniceRouter.route('/sacuvajOdbijenicu').post(
    (req, res) => new OdbijeniceController().sacuvajOdbijenicu(req, res)
)

OdbijeniceRouter.route('/getOdbijenice/:dekorater').get(
    (req, res) => new OdbijeniceController().getOdbijenice(req, res)
)

export default OdbijeniceRouter;