"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Korisnik = new Schema({
    kor_ime: {
        type: String
    },
    lozinka: {
        type: String
    },
    ime: {
        type: String
    },
    prezime: {
        type: String
    },
    pol: {
        type: String
    },
    adresa: {
        type: String
    },
    tel: {
        type: String
    },
    email: {
        type: String
    },
    profile_pic: {
        type: String
    },
    credit_card: {
        type: String
    },
    tip: {
        type: String
    },
    odobren: {
        type: Boolean
    },
    firma: {
        type: String
    },
    zauzet: {
        type: Array
    }
});
exports.default = mongoose_1.default.model('Korisnik', Korisnik, 'korisnici');
