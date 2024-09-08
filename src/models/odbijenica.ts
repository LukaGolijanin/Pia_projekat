import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Odbijenica = new Schema({
    dekorater: {
        type: String
    },
    datum: {
        type: Date
    },
    komentar: {
        type: String
    }
})

export default mongoose.model('Odbijenica', Odbijenica, 'odbijenice');