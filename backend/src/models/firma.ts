import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
})

export default mongoose.model('Firma', Firma, 'firme');