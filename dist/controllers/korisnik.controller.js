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
exports.KorisnikController = void 0;
const korisnik_1 = __importDefault(require("../models/korisnik"));
const multer_1 = __importDefault(require("multer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const defaultPic = 'default.jpg';
class KorisnikController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const kor_ime = req.body.kor_ime;
            const lozinka = req.body.lozinka;
            const tip = req.body.tip;
            try {
                const korisnik = yield korisnik_1.default.findOne({ kor_ime, tip });
                if (!korisnik) {
                    return res.status(200).json({ 'message': 'korisnik' });
                }
                if (typeof korisnik.lozinka != 'string') {
                    return res.status(500).json({ 'message': 'Server error' });
                }
                const match = yield bcrypt_1.default.compare(lozinka, korisnik.lozinka);
                if (match) {
                    res.json(korisnik); // CUVAMO LOZINKU
                }
                else {
                    res.status(200).json({ 'message': 'lozinka' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ 'message': 'greska' });
            }
        });
        this.promeniLozinku = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.body.kor_ime;
            let stara = req.body.stara;
            let nova = req.body.nova;
            try {
                const korisnik = yield korisnik_1.default.findOne({ kor_ime: kor_ime });
                if (!korisnik) {
                    return res.status(400).json({ 'message': 'korisnik greska' });
                }
                let match = false;
                if (korisnik.lozinka != null) {
                    match = yield bcrypt_1.default.compare(stara, korisnik.lozinka);
                }
                if (!match) {
                    return res.status(200).json({ 'message': 'lozinka greska' });
                }
                const hashLozinka = yield bcrypt_1.default.hash(nova, 10);
                yield korisnik_1.default.findOneAndUpdate({ kor_ime: kor_ime }, { lozinka: hashLozinka });
                res.status(200).json({ 'message': 'Uspesno' });
            }
            catch (err) {
                console.error('Greska azuriranja:', err);
                res.status(500).json({ 'message': 'interna greska' });
            }
        });
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const updateFields = {};
            if (email != '') {
                const existingUser = yield korisnik_1.default.findOne({ 'email': email });
                if (existingUser) {
                    return res.status(200).json({ 'message': 'email greska' });
                }
                updateFields.email = email;
            }
            if (ime)
                updateFields.ime = ime;
            if (prezime)
                updateFields.prezime = prezime;
            if (tel)
                updateFields.tel = tel;
            if (adresa)
                updateFields.adresa = adresa;
            if (profile_pic)
                updateFields.profile_pic = profile_pic;
            if (tip == 'vlasnik') {
                let credit_card = req.body.credit_card_firma;
                if (credit_card)
                    updateFields.credit_card = credit_card;
            }
            else {
                let firma = req.body.credit_card_firma;
                if (firma)
                    updateFields.firma = firma;
            }
            try {
                const updatedUser = yield korisnik_1.default.findOneAndUpdate({ 'kor_ime': kor_ime }, { $set: updateFields }, { new: true });
                if (!updatedUser) {
                    return res.status(400).json({ 'message': 'korisnik greska' });
                }
                res.status(200).json({ 'message': 'uspesno' });
            }
            catch (err) {
                res.status(500).json({ 'message': 'update greska' });
            }
        });
        this.posaljiZahtev = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Request Body:', req.body); // podaci za req
            console.log('Uploaded File:', req.file); // fajl        
            const file = req.file;
            const profilePic = file ? file.filename : defaultPic;
            const existingUser = yield korisnik_1.default.findOne({
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
            const hashLozinka = yield bcrypt_1.default.hash(req.body.lozinka, 10);
            let kor = null;
            if (req.body.tip == 'vlasnik') {
                kor = new korisnik_1.default({
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
                });
            }
            else {
                kor = new korisnik_1.default({
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
                });
            }
            kor.save().then(kor => {
                res.status(200).json({ 'message': 'poslat' });
            }).catch(err => {
                res.status(400).json({ 'message': 'error' });
            });
        });
        this.getUser = (req, res) => {
            const { kor_ime } = req.params;
            korisnik_1.default.findOne({ 'kor_ime': kor_ime })
                .then(user => {
                if (!user) {
                    return res.status(400).json({ 'message': 'korisnik greska' });
                }
                res.status(200).json(user);
            })
                .catch(error => {
                res.status(500).json({ 'message': 'sistemska greska' });
            });
        };
        this.getDekorateri = (req, res) => {
            korisnik_1.default.find({ 'tip': 'dekorater' })
                .then(dekorateri => {
                res.json(dekorateri);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getSlobodniDekorateri = (req, res) => {
            let firma = req.body.firma;
            let datum = new Date(req.body.datum);
            datum.setHours(0, 0, 0, 0);
            korisnik_1.default.find({ 'tip': 'dekorater', 'firma': firma, 'odobren': true }).
                then(dekorateri => {
                const slobodniDekorateri = dekorateri.filter(dek => {
                    if (!dek.zauzet || !Array.isArray(dek.zauzet)) {
                        return true;
                    }
                    const zauzetDates = dek.zauzet.map(date => {
                        const dat = new Date(date);
                        dat.setHours(0, 0, 0, 0);
                        return dat;
                    });
                    return !zauzetDates.some(zauzetDatum => zauzetDatum.getTime() === datum.getTime());
                });
                res.json(slobodniDekorateri);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getVlasnici = (req, res) => {
            korisnik_1.default.find({ 'tip': 'vlasnik' })
                .then(vlasnici => {
                res.json(vlasnici);
            }).catch(err => {
                console.log(err);
            });
        };
        this.promeniStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.body.kor_ime;
            try {
                const kor = yield korisnik_1.default.findOne({ 'kor_ime': kor_ime });
                if (!kor) {
                    return res.status(400).json({ 'message': 'nepostojeci korisnik' });
                }
                const val = !kor.odobren;
                const r = yield korisnik_1.default.updateOne({ kor_ime }, { $set: { odobren: val } });
                if (r.modifiedCount === 0) {
                    return res.status(500).json({ 'message': 'neuspesna promena' });
                }
                return res.status(200).json({ 'message': 'uspesno' });
            }
            catch (error) {
                return res.status(500).json({ 'message': 'Nepoznata greska' });
            }
        });
        this.uzmiPosao = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.body.kor_ime;
            let datum = new Date(req.body.datum);
            try {
                const kor = yield korisnik_1.default.findOne({ 'kor_ime': kor_ime });
                if (!kor) {
                    return res.status(400).json({ 'message': 'nepostojeci korisnik' });
                }
                const r = yield korisnik_1.default.updateOne({ 'kor_ime': kor_ime, 'zauzet': { $ne: datum } }, { $addToSet: { zauzet: datum } });
                console.log('status:', r);
                if (r.modifiedCount === 0) {
                    return res.status(500).json({ 'message': 'neuspesna promena pri uzimanju posla' });
                }
                return res.status(200).json({ 'message': 'uspesno' });
            }
            catch (error) {
                return res.status(500).json({ 'message': 'Nepoznata greska' });
            }
        });
        this.zavrsiPosao = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.body.kor_ime;
            let datum = new Date(req.body.datum);
            try {
                const kor = yield korisnik_1.default.findOne({ 'kor_ime': kor_ime });
                if (!kor) {
                    return res.status(400).json({ 'message': 'nepostojeci korisnik' });
                }
                const r = yield korisnik_1.default.updateOne({ kor_ime }, { $pull: { zauzet: datum } });
                if (r.modifiedCount === 0) {
                    return res.status(500).json({ 'message': 'neuspesna promena pri zavrsavanju posla' });
                }
                return res.status(200).json({ 'message': 'uspesno' });
            }
            catch (error) {
                return res.status(500).json({ 'message': 'Nepoznata greska' });
            }
        });
    }
}
exports.KorisnikController = KorisnikController;
