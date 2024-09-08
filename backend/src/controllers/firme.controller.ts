import * as express from 'express';
import Firma from '../models/firma';

export class FirmeController {

    getFirme = ( req: express.Request, res: express.Response) => {

        Firma.find({}).then(f => {
            res.json(f);
        }).catch(err => {
            console.log(err);
        })
    }

    registrujFirmu = ( req: express.Request, res: express.Response) => {
        console.log('Request Body:', req.body);
    
        const {
            naziv,
            adresa,
            tel,
            usluge,
            cene,
            lat,
            lng,
            pocetak,
            kraj
        } = req.body;
    
        try {
            const uslugeArray = JSON.parse(usluge);
            const ceneArray = JSON.parse(cene);
    
            const fir = new Firma({
                naziv,
                adresa,
                tel,
                usluge: uslugeArray,
                cene: ceneArray,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                odmor_pocetak: new Date(pocetak),
                odmor_kraj: new Date(kraj),
                br_ocena: 0,
                suma_ocena: 0,
                komentari: []
            });
    
            fir.save()
            .then(f => res.status(200).json({'message': 'registrovana'}))
            .catch(err => res.status(400).json({'message': 'error'}));
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.status(400).json({'message': 'Invalid JSON format'});
        }
    }
}