"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdbijeniceController = void 0;
const odbijenica_1 = __importDefault(require("../models/odbijenica"));
class OdbijeniceController {
    constructor() {
        this.sacuvajOdbijenicu = (req, res) => {
            console.log('Podaci: ', req.body);
            const datum = new Date(req.body.datum);
            if (isNaN(datum.getTime())) {
                console.error('Invalid date format:', req.body.datum);
                return res.status(400).json({ 'message': 'Invalid date format' });
            }
            let o = new odbijenica_1.default({
                datum: datum,
                dekorater: req.body.dekorater,
                komentar: req.body.komentar
            });
            o.save().
                then(oo => res.status(200).json({ 'message': 'uspesno' }))
                .catch(err => res.status(400).json({ 'message': 'error moj' }));
        };
        this.getOdbijenice = (req, res) => {
            odbijenica_1.default.find({}).then(o => {
                res.json(o);
            }).catch(err => {
                console.log(err);
            });
        };
    }
}
exports.OdbijeniceController = OdbijeniceController;
