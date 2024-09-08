import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
})

export default mongoose.model('Zakazivanje', Zakazivanje, 'zakazivanja')