import * as express from 'express';
import Zakazivanje from '../models/zakazivanje';
import { now } from 'mongoose';

export class ZakazivanjeController {

    zakazi = (req: express.Request, res: express.Response) => {

        console.log('Podaci: ', req.body);
        
        const datum = new Date(req.body.datum);
        if (isNaN(datum.getTime())) {
            console.error('Invalid date format:', req.body.datum);
            return res.status(400).json({ 'message': 'Invalid date format' });
        }
        const datumZakazivanja = new Date();

        let z = new Zakazivanje({
            datum: datum,
            bazen: req.body.bazen,
            zelenilo: req.body.zelenilo,
            stoloviP: req.body.stoloviPovrsina,
            stoloviB: req.body.stoloviBroj,
            fontana: req.body.fontana,
            tip: req.body.basta_tip,
            area: req.body.area,
            status: 'cekanje',
            vlasnik: req.body.vlasnik,
            dekorater: req.body.dekorater,
            firma: req.body.firma,
            dodatno: req.body.dodatno,
            usluge: req.body.usluge,
            raspored: req.body.raspored,
            datumZakazivanja: datumZakazivanja
        });

        z.save().
        then(zz => res.status(200).json({'message': 'uspesno'}))
        .catch(err => res.status(400).json({'message': 'error moj'}));
    }
    
    getZakazivanja = (req: express.Request, res: express.Response) => {

        Zakazivanje.find({}).then(f => {
            res.json(f);
        }).catch(err => {
            console.log(err);
        })
    }

    getMojaTrenutnaZakazivanja = (req: express.Request, res: express.Response) => {

        const { kor_ime } = req.params;
        console.log('Korisnik: ',kor_ime);

        Zakazivanje.find({ 'vlasnik': kor_ime, 'datum': { $gt: new Date() } }).then(z => {
            res.json(z);
        }).catch(err => {
            console.log(err);
        })
    }

    getMojaArhivaZakazivanja = (req: express.Request, res: express.Response) => {

        const { kor_ime } = req.params;

        Zakazivanje.find({ 'vlasnik': kor_ime, 'datum': { $lt: new Date() } }).then(z => {
            res.json(z);
        }).catch(err => {
            console.log(err);
        })
    }

    getFirminaZakazivanja = (req: express.Request, res: express.Response) => {
        
        const { firma } = req.params;

        Zakazivanje.find({ 'firma': firma, 'status': 'cekanje' }).then(z => {
            res.json(z);
        }).catch(err => {
            console.log(err);
        })

    }

    getPotvrdjenaZakazivanja = (req: express.Request, res: express.Response) => {

        const { kor_ime } = req.params;

        Zakazivanje.find({ 'dekorater': kor_ime, 'status': 'potvrdjen' }).then(z => {
            res.json(z);
        }).catch(err => {
            console.log(err);
        })
    }

    getZavrsenaZakazivanja = (req: express.Request, res: express.Response) => {

        const { kor_ime } = req.params;

        Zakazivanje.find(
            { 'vlasnik': kor_ime,
             'status': { $in: ['gotovo', 'servis', 'cekanje_servis']}}).then(z => {
                res.json(z);
             }).catch(err => {
                console.log(err);
             })
    }

    getZahteviServisa = (req: express.Request, res: express.Response) => {
        
        const { firma } = req.params;
        
        Zakazivanje.find(
            { 'firma': firma,
                'status': 'cekanje_servis'
        }).then(z => {
            res.json(z);
        }).catch(err => {
            console.log(err);
        })
    }

    getMojaServisiranja = (req: express.Request, res: express.Response) => {

        const { kor_ime } = req.params;

        Zakazivanje.find(
            { 'dekorater': kor_ime ,
                'status': 'servis'
            }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            })
    }

    otkazi = (req: express.Request, res: express.Response) => {
        let vlasnik = req.body.vlasnik;
        const datumD = new Date(req.body.datumD);
        if (isNaN(datumD.getTime())) {
            console.error('Invalid date format:', req.body.datumD);
            return res.status(400).json({ 'message': 'Invalid date format' });
        }
        Zakazivanje.deleteOne({'vlasnik': vlasnik, 'datumZakazivanja': datumD})
        .then(z => {
            if (z.deletedCount == 1) {
                res.status(200).json({ 'message': 'uspesno' });
            } else {
                res.status(400).json({ 'message': 'neuspesno' });
            }
        })
        .catch(err => {
            res.status(500).json({ 'message': 'ERROR U BRISANJU' });
        })
    }

    promeniStatus = async (req: express.Request, res: express.Response) => {
        console.log("Za promenu:", req.body);

        const status = req.body.status;
        const dekorater = req.body.dekorater;
        const firma = req.body.firma;

        let datumD = new Date(req.body.datum);
        if (isNaN(datumD.getTime())) {
            console.error('Invalid date format:', req.body.datumD);
            return res.status(400).json({ 'message': 'Invalid date format' });
        }
        console.log('Datum:', datumD);

        try {
            const z = await Zakazivanje.findOne({'datumZakazivanja': datumD, 'firma': firma});
            console.log('Current Document:', z);
            if (!z) {
                return res.status(400).json({'message': 'nepostojece zakazivanje'});
            }
            let r = null;
            if (dekorater != '') {
                r = await Zakazivanje.updateOne(
                    { 'datumZakazivanja': datumD, 'firma': firma }, 
                    { $set: { 'status': status, 'dekorater': dekorater } }
                );
            } else {
                r = await Zakazivanje.updateOne(
                    { 'datumZakazivanja': datumD, 'firma': firma }, 
                    { $set: { 'status': status } }
                );
            }
            console.log('status u zakazivanju', r);
            if (r.modifiedCount === 0) {
                return res.status(500).json({ 'message': 'neuspesna promena statusa zakazivanja'});
            }

            return res.status(200).json({ 'message': 'uspesno' });
        } catch (error) {
            return res.status(500).json({ 'message': 'Nepoznata greska'});
        }
    }

    potvrdiServis = async (req: express.Request, res: express.Response) => {
        console.log(req.body);

        const firma = req.body.firma;
        const dekorater = req.body.dekorater;

        let datumD = new Date(req.body.datumZakazivanja);
        let datumS = new Date(req.body.datumServisiranja);
        if (isNaN(datumD.getTime())) {
            console.error('Invalid date format(zakazivanje):', req.body.datumZakazivanja);
            return res.status(400).json({ 'message': 'Invalid date format' });
        }
        if (isNaN(datumS.getTime())) {
            console.error('Invalid date format(servisiranje):', req.body.datumServisiranja);
            return res.status(400).json({ 'message': 'Invalid date format' });
        }
        console.log('Datum:', datumD);

        try {
            const z = await Zakazivanje.findOne({'datumZakazivanja': datumD, 'firma': firma});
            console.log('Current Document:', z);
            if (!z) {
                return res.status(400).json({'message': 'nepostojece zakazivanje'});
            }

            const r = await Zakazivanje.updateOne(
                    { 'datumZakazivanja': datumD, 'firma': firma }, 
                    { $set: { 'status': 'servis', 'datumServisiranja': datumS, 'dekorater': dekorater } }
                );
    
            console.log('status u zakazivanju', r);
            if (r.modifiedCount === 0) {
                return res.status(500).json({ 'message': 'neuspesna promena statusa zakazivanja'});
            }

            return res.status(200).json({ 'message': 'uspesno' });
        } catch (error) {
            return res.status(500).json({ 'message': 'Nepoznata greska'});
        }
    }
}