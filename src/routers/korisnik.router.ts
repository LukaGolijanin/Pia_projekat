import express from "express";
import multer from "multer";
import { KorisnikController } from "../controllers/korisnik.controller";

// File uploads
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'uploads/');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
  });
  const upload = multer({ storage });

const korisnikRuter = express.Router();

korisnikRuter.route('/login').post(
    (req, res) => new KorisnikController().login(req, res)
)

korisnikRuter.route('/posaljiZahtev').post(
    upload.single('profile_pic'),
    (req, res) => new KorisnikController().posaljiZahtev(req, res)
)

korisnikRuter.route('/promeniLozinku').post(
    (req, res) => new KorisnikController().promeniLozinku(req, res)
)

korisnikRuter.route('/updateProfile').post(
    upload.single('profile_pic'),
    (req, res) => new KorisnikController().updateProfile(req, res)
)

korisnikRuter.route('/getUser/:kor_ime').get(
    (req, res) => new KorisnikController().getUser(req, res)
)

korisnikRuter.route('/getDekorateri').get(
    (req, res) => new KorisnikController().getDekorateri(req, res)
)

korisnikRuter.route('/getVlasnici').get(
    (req, res) => new KorisnikController().getVlasnici(req, res)
)

korisnikRuter.route('/promeniStatus').post(
    (req, res) => new KorisnikController().promeniStatus(req, res)
)

korisnikRuter.route('/getSlobodniDekorateri').post(
    (req, res) => new KorisnikController().getSlobodniDekorateri(req, res)
)

korisnikRuter.route('/uzmiPosao').post(
    (req, res) => new KorisnikController().uzmiPosao(req, res)
)

korisnikRuter.route('/zavrsiPosao').post(
    (req, res) => new KorisnikController().zavrsiPosao(req, res)
)

export default korisnikRuter;