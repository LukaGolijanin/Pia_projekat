"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZakazivanjeController = void 0;
const zakazivanje_1 = __importDefault(require("../models/zakazivanje"));
class ZakazivanjeController {
    constructor() {
        this.zakazi = (req, res) => {
            console.log('Podaci: ', req.body);
            const datum = new Date(req.body.datum);
            if (isNaN(datum.getTime())) {
                console.error('Invalid date format:', req.body.datum);
                return res.status(400).json({ 'message': 'Invalid date format' });
            }
            const datumZakazivanja = new Date();
            let z = new zakazivanje_1.default({
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
                then(zz => res.status(200).json({ 'message': 'uspesno' }))
                .catch(err => res.status(400).json({ 'message': 'error moj' }));
        };
        this.getZakazivanja = (req, res) => {
            zakazivanje_1.default.find({}).then(f => {
                res.json(f);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getMojaTrenutnaZakazivanja = (req, res) => {
            const { kor_ime } = req.params;
            console.log('Korisnik: ', kor_ime);
            zakazivanje_1.default.find({ 'vlasnik': kor_ime, 'datum': { $gt: new Date() } }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getMojaArhivaZakazivanja = (req, res) => {
            const { kor_ime } = req.params;
            zakazivanje_1.default.find({ 'vlasnik': kor_ime, 'datum': { $lt: new Date() } }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getFirminaZakazivanja = (req, res) => {
            const { firma } = req.params;
            zakazivanje_1.default.find({ 'firma': firma, 'status': 'cekanje' }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getPotvrdjenaZakazivanja = (req, res) => {
            const { kor_ime } = req.params;
            zakazivanje_1.default.find({ 'dekorater': kor_ime, 'status': 'potvrdjen' }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getZavrsenaZakazivanja = (req, res) => {
            const { kor_ime } = req.params;
            zakazivanje_1.default.find({ 'vlasnik': kor_ime,
                'status': { $in: ['gotovo', 'servis', 'cekanje_servis'] } }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getZahteviServisa = (req, res) => {
            const { firma } = req.params;
            zakazivanje_1.default.find({ 'firma': firma,
                'status': 'cekanje_servis'
            }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getMojaServisiranja = (req, res) => {
            const { kor_ime } = req.params;
            zakazivanje_1.default.find({ 'dekorater': kor_ime,
                'status': 'servis'
            }).then(z => {
                res.json(z);
            }).catch(err => {
                console.log(err);
            });
        };
        this.otkazi = (req, res) => {
            let vlasnik = req.body.vlasnik;
            const datumD = new Date(req.body.datumD);
            if (isNaN(datumD.getTime())) {
                console.error('Invalid date format:', req.body.datumD);
                return res.status(400).json({ 'message': 'Invalid date format' });
            }
            zakazivanje_1.default.deleteOne({ 'vlasnik': vlasnik, 'datumZakazivanja': datumD })
                .then(z => {
                if (z.deletedCount == 1) {
                    res.status(200).json({ 'message': 'uspesno' });
                }
                else {
                    res.status(400).json({ 'message': 'neuspesno' });
                }
            })
                .catch(err => {
                res.status(500).json({ 'message': 'ERROR U BRISANJU' });
            });
        };
        this.promeniStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const z = yield zakazivanje_1.default.findOne({ 'datumZakazivanja': datumD, 'firma': firma });
                console.log('Current Document:', z);
                if (!z) {
                    return res.status(400).json({ 'message': 'nepostojece zakazivanje' });
                }
                let r = null;
                if (dekorater != '') {
                    r = yield zakazivanje_1.default.updateOne({ 'datumZakazivanja': datumD, 'firma': firma }, { $set: { 'status': status, 'dekorater': dekorater } });
                }
                else {
                    r = yield zakazivanje_1.default.updateOne({ 'datumZakazivanja': datumD, 'firma': firma }, { $set: { 'status': status } });
                }
                console.log('status u zakazivanju', r);
                if (r.modifiedCount === 0) {
                    return res.status(500).json({ 'message': 'neuspesna promena statusa zakazivanja' });
                }
                return res.status(200).json({ 'message': 'uspesno' });
            }
            catch (error) {
                return res.status(500).json({ 'message': 'Nepoznata greska' });
            }
        });
        this.potvrdiServis = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const z = yield zakazivanje_1.default.findOne({ 'datumZakazivanja': datumD, 'firma': firma });
                console.log('Current Document:', z);
                if (!z) {
                    return res.status(400).json({ 'message': 'nepostojece zakazivanje' });
                }
                const r = yield zakazivanje_1.default.updateOne({ 'datumZakazivanja': datumD, 'firma': firma }, { $set: { 'status': 'servis', 'datumServisiranja': datumS, 'dekorater': dekorater } });
                console.log('status u zakazivanju', r);
                if (r.modifiedCount === 0) {
                    return res.status(500).json({ 'message': 'neuspesna promena statusa zakazivanja' });
                }
                return res.status(200).json({ 'message': 'uspesno' });
            }
            catch (error) {
                return res.status(500).json({ 'message': 'Nepoznata greska' });
            }
        });
    }
}
exports.ZakazivanjeController = ZakazivanjeController;
