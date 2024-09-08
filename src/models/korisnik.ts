import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

})

export default mongoose.model('Korisnik', Korisnik, 'korisnici')