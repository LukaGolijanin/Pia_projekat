import * as express from 'express'
import Korisnik from '../models/korisnik';
import multer from 'multer';
import bcrypt from 'bcrypt';

const upload = multer({ dest: 'uploads/'});

const defaultPic = 'default.jpg';

export class KorisnikController {
    login = async (req: express.Request, res: express.Response) => {
        const kor_ime = req.body.kor_ime;
        const lozinka = req.body.lozinka;
        const tip = req.body.tip;
    
        try {
            const korisnik = await Korisnik.findOne({ kor_ime, tip });
    
            if (!korisnik) {
                return res.status(200).json({ 'message': 'korisnik' });
            }
            if (typeof korisnik.lozinka != 'string') {
                return res.status(500).json({ 'message': 'Server error' });
            }

            const match = await bcrypt.compare(lozinka, korisnik.lozinka);
    
            if (match) {
                res.json(korisnik); // CUVAMO LOZINKU
            } else {
                res.status(200).json({ 'message': 'lozinka' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ 'message': 'greska' });
        }
    };

    promeniLozinku = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;
        let stara = req.body.stara;
        let nova = req.body.nova;
        
        try {
            const korisnik = await Korisnik.findOne({kor_ime: kor_ime});

            if (!korisnik) {
                return res.status(400).json({'message':'korisnik greska'});
            }
            let match = false;
            if (korisnik.lozinka != null) {
                match = await bcrypt.compare(stara, korisnik.lozinka)
            }
            if (!match) {
                return res.status(200).json({'message': 'lozinka greska'});
            }

            const hashLozinka = await bcrypt.hash(nova, 10);
            await Korisnik.findOneAndUpdate(
                { kor_ime: kor_ime },
                { lozinka: hashLozinka },
            );
    
            res.status(200).json({ 'message': 'Uspesno' });
        } catch (err) {
            console.error('Greska azuriranja:', err);
            res.status(500).json({ 'message': 'interna greska' });
        }
    }

    updateProfile = async (req: express.Request, res: express.Response) => {
        console.log('Request Body:', req.body); // podaci za req
        console.log('Uploaded File:', req.file); // fajl 
        
        let tip = req.body.tip;
        let kor_ime = req.body.kor_ime;
        let ime = req.body.ime;
        let prezime = req.body.prezime;
        let adresa = req.body.adresa;
        let email = req.body.email;
        let tel = req.body.tel;
        const profile_pic = req.file ? req.file.filename : null;

        const updateFields: any = {};
        
        if (email != '') {
            const existingUser = await Korisnik.findOne({'email': email});

            if (existingUser) {
                return res.status(200).json({'message': 'email greska'});
            }
            updateFields.email = email;
        }

        if (ime) updateFields.ime = ime;
        if (prezime) updateFields.prezime = prezime;
        if (tel) updateFields.tel = tel;
        if (adresa) updateFields.adresa = adresa;
        if (profile_pic) updateFields.profile_pic = profile_pic;
        
        if (tip == 'vlasnik') {
            let credit_card = req.body.credit_card_firma;
            if (credit_card) updateFields.credit_card = credit_card;
        } else {
            let firma = req.body.credit_card_firma;
            if (firma) updateFields.firma = firma;
        }
        
        try {
            const updatedUser = await Korisnik.findOneAndUpdate(
                { 'kor_ime': kor_ime }, { $set: updateFields }, { new: true }
            );
            if (!updatedUser) {
                return res.status(400).json({ 'message': 'korisnik greska'});
            }

            res.status(200).json({ 'message': 'uspesno' });
        } catch (err) {
            res.status(500).json({ 'message': 'update greska' });
        }
    }

    posaljiZahtev = async (req: express.Request, res: express.Response) => {
        console.log('Request Body:', req.body); // podaci za req
        console.log('Uploaded File:', req.file); // fajl        
        const file = req.file;
        const profilePic = file ? file.filename : defaultPic;

        const existingUser = await Korisnik.findOne({
            $or: [
                { kor_ime: req.body.kor_ime },
                { email: req.body.email }
            ]
        });

        if (existingUser) {
            if (existingUser.kor_ime === req.body.kor_ime) {
                return res.status(200).json({ 'message': 'kor_ime' }); // Ako ne radi stavi 200
            }
            if (existingUser.email === req.body.email) {
                return res.status(200).json({ 'message': 'email' });
            }
        }

        const hashLozinka = await bcrypt.hash(req.body.lozinka, 10);
        let kor = null;

        if (req.body.tip == 'vlasnik') {
            kor = new Korisnik({
                kor_ime: req.body.kor_ime, 
                lozinka: hashLozinka,
                ime: req.body.ime, 
                prezime: req.body.prezime, 
                pol: req.body.pol,
                adresa: req.body.adresa, 
                tel: req.body.tel, 
                email: req.body.email,
                credit_card: req.body.credit_card_firma, 
                tip: req.body.tip, 
                odobren: false,
                profile_pic: profilePic
            })
        } else {
            kor = new Korisnik({
                kor_ime: req.body.kor_ime, 
                lozinka: hashLozinka,
                ime: req.body.ime, 
                prezime: req.body.prezime, 
                pol: req.body.pol,
                adresa: req.body.adresa, 
                tel: req.body.tel, 
                email: req.body.email,
                firma: req.body.credit_card_firma, 
                tip: req.body.tip, 
                odobren: true,
                profile_pic: profilePic,
                zauzet: []
            })
        }
        kor.save().then(kor => {
            res.status(200).json({'message': 'poslat'});
        }).catch(err => {
            res.status(400).json({'message':'error'});
        })
    }

    getUser = ( req: express.Request, res: express.Response) => {
        
        const { kor_ime } = req.params;

        Korisnik.findOne({ 'kor_ime': kor_ime })
      .then(user => {
        if (!user) {
          return res.status(400).json({ 'message': 'korisnik greska' });
        }
        res.status(200).json(user);
      })
      .catch(error => {
        res.status(500).json({ 'message': 'sistemska greska' });
      });
    }

    getDekorateri = ( req: express.Request, res: express.Response ) => {

        Korisnik.find({ 'tip': 'dekorater' })
        .then( dekorateri => {
            res.json(dekorateri)
        }).catch( err => {
            console.log(err);
        })
    }

    getSlobodniDekorateri = ( req: express.Request, res: express.Response) => {

        let firma = req.body.firma;
        let datum = new Date(req.body.datum);
        datum.setHours(0,0,0,0);

        Korisnik.find({ 'tip': 'dekorater', 'firma': firma, 'odobren': true}).
        then( dekorateri => {
            const slobodniDekorateri = dekorateri.filter(dek => {
                if (!dek.zauzet || !Array.isArray(dek.zauzet)) {
                    return true;
                }

                const zauzetDates = dek.zauzet.map(date => {
                    const dat = new Date(date);
                    dat.setHours(0,0,0,0);
                    return dat;
                });

                return !zauzetDates.some(zauzetDatum => zauzetDatum.getTime() === datum.getTime());
            });
            res.json(slobodniDekorateri);
        }).catch( err => {
            console.log(err);
        })
    }

    getVlasnici = ( req: express.Request, res: express.Response ) => {

        Korisnik.find({ 'tip': 'vlasnik' })
        .then( vlasnici => {
            res.json(vlasnici)
        }).catch( err => {
            console.log(err);
        })
    }

    promeniStatus = async ( req: express.Request, res: express.Response ) => {
        let kor_ime = req.body.kor_ime;
        
        try {
            const kor = await Korisnik.findOne({'kor_ime': kor_ime});

            if (!kor) {
                return res.status(400).json({'message': 'nepostojeci korisnik'});
            }

            const val = !kor.odobren;

            const r = await Korisnik.updateOne(
                { kor_ime }, { $set: { odobren: val } }
            );

            if (r.modifiedCount === 0) {
                return res.status(500).json({ 'message': 'neuspesna promena'});
            }

            return res.status(200).json({ 'message': 'uspesno' });
        } catch (error) {
            return res.status(500).json({ 'message': 'Nepoznata greska'});
        }
    }

    uzmiPosao = async ( req: express.Request, res: express.Response ) => {
        let kor_ime = req.body.kor_ime;
        let datum = new Date(req.body.datum);
        
        try {
            const kor = await Korisnik.findOne({'kor_ime': kor_ime});

            if (!kor) {
                return res.status(400).json({'message': 'nepostojeci korisnik'});
            }

            const r = await Korisnik.updateOne(
                { 'kor_ime': kor_ime, 'zauzet': {$ne: datum} },
                { $addToSet: { zauzet: datum } }
            );
            console.log('status:', r);

            if (r.modifiedCount === 0) {
                return res.status(500).json({ 'message': 'neuspesna promena pri uzimanju posla'});
            }

            return res.status(200).json({ 'message': 'uspesno' });
        } catch (error) {
            return res.status(500).json({ 'message': 'Nepoznata greska'});
        }
    }
    zavrsiPosao = async ( req: express.Request, res: express.Response ) => {
        let kor_ime = req.body.kor_ime;
        let datum = new Date(req.body.datum);
        
        try {
            const kor = await Korisnik.findOne({'kor_ime': kor_ime});

            if (!kor) {
                return res.status(400).json({'message': 'nepostojeci korisnik'});
            }

            const r = await Korisnik.updateOne(
                { kor_ime }, { $pull: { zauzet: datum } }
            );

            if (r.modifiedCount === 0) {
                return res.status(500).json({ 'message': 'neuspesna promena pri zavrsavanju posla'});
            }

            return res.status(200).json({ 'message': 'uspesno' });
        } catch (error) {
            return res.status(500).json({ 'message': 'Nepoznata greska'});
        }
    }
}