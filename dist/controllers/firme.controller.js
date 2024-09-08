"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmeController = void 0;
const firma_1 = __importDefault(require("../models/firma"));
class FirmeController {
    constructor() {
        this.getFirme = (req, res) => {
            firma_1.default.find({}).then(f => {
                res.json(f);
            }).catch(err => {
                console.log(err);
            });
        };
        this.registrujFirmu = (req, res) => {
            console.log('Request Body:', req.body);
            const { naziv, adresa, tel, usluge, cene, lat, lng, pocetak, kraj } = req.body;
            try {
                const uslugeArray = JSON.parse(usluge);
                const ceneArray = JSON.parse(cene);
                const fir = new firma_1.default({
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
                    .then(f => res.status(200).json({ 'message': 'registrovana' }))
                    .catch(err => res.status(400).json({ 'message': 'error' }));
            }
            catch (err) {
                console.error('Error parsing JSON:', err);
                res.status(400).json({ 'message': 'Invalid JSON format' });
            }
        };
    }
}
exports.FirmeController = FirmeController;
