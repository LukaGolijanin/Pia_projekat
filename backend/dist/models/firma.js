"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Firma = new Schema({
    naziv: {
        type: String
    },
    adresa: {
        type: String
    },
    usluge: {
        type: Array
    },
    cenovnik: {
        type: Array
    },
    tel: {
        type: String
    },
    komentari: {
        type: Array
    },
    br_ocena: {
        type: Number
    },
    suma_ocena: {
        type: Number
    },
    odmor_kraj: {
        type: Date
    },
    odmor_pocetak: {
        type: Date
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
});
exports.default = mongoose_1.default.model('Firma', Firma, 'firme');
