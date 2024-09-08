"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Zakazivanje = new Schema({
    datum: {
        type: Date
    },
    area: {
        type: Number
    },
    tip: {
        type: String
    },
    bazen: {
        type: Number
    },
    fontana: {
        type: Number
    },
    zelenilo: {
        type: Number
    },
    stoloviP: {
        type: Number
    },
    stoloviB: {
        type: Number
    },
    status: {
        type: String
    },
    dekorater: {
        type: String
    },
    vlasnik: {
        type: String
    },
    firma: {
        type: String
    },
    usluge: {
        type: Array
    },
    raspored: {
        type: String
    },
    dodatno: {
        type: String
    },
    datumZakazivanja: {
        type: Date
    },
    datumServisiranja: {
        type: Date
    }
});
exports.default = mongoose_1.default.model('Zakazivanje', Zakazivanje, 'zakazivanja');
