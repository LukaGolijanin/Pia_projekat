import * as express from 'express';
import Odbijenica from '../models/odbijenica';

export class OdbijeniceController {
    sacuvajOdbijenicu = (req: express.Request, res: express.Response) => {
        console.log('Podaci: ', req.body);

        const datum = new Date(req.body.datum);
        if (isNaN(datum.getTime())) {
            console.error('Invalid date format:', req.body.datum);
            return res.status(400).json({ 'message': 'Invalid date format' });
        }

        let o = new Odbijenica({
            datum: datum,
            dekorater: req.body.dekorater,
            komentar: req.body.komentar
        })
        o.save().
        then(oo => res.status(200).json({'message': 'uspesno'}))
        .catch(err => res.status(400).json({'message': 'error moj'}));
    }

    getOdbijenice = (req: express.Request, res: express.Response) => {

        Odbijenica.find({}).then(o => {
            res.json(o);
        }).catch(err => {
            console.log(err);
        })
    }
}