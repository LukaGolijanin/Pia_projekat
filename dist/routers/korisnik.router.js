"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const korisnik_controller_1 = require("../controllers/korisnik.controller");
// File uploads
const storage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, 'uploads/');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
const korisnikRuter = express_1.default.Router();
korisnikRuter.route('/login').post((req, res) => new korisnik_controller_1.KorisnikController().login(req, res));
korisnikRuter.route('/posaljiZahtev').post(upload.single('profile_pic'), (req, res) => new korisnik_controller_1.KorisnikController().posaljiZahtev(req, res));
korisnikRuter.route('/promeniLozinku').post((req, res) => new korisnik_controller_1.KorisnikController().promeniLozinku(req, res));
korisnikRuter.route('/updateProfile').post(upload.single('profile_pic'), (req, res) => new korisnik_controller_1.KorisnikController().updateProfile(req, res));
korisnikRuter.route('/getUser/:kor_ime').get((req, res) => new korisnik_controller_1.KorisnikController().getUser(req, res));
korisnikRuter.route('/getDekorateri').get((req, res) => new korisnik_controller_1.KorisnikController().getDekorateri(req, res));
korisnikRuter.route('/getVlasnici').get((req, res) => new korisnik_controller_1.KorisnikController().getVlasnici(req, res));
korisnikRuter.route('/promeniStatus').post((req, res) => new korisnik_controller_1.KorisnikController().promeniStatus(req, res));
korisnikRuter.route('/getSlobodniDekorateri').post((req, res) => new korisnik_controller_1.KorisnikController().getSlobodniDekorateri(req, res));
korisnikRuter.route('/uzmiPosao').post((req, res) => new korisnik_controller_1.KorisnikController().uzmiPosao(req, res));
korisnikRuter.route('/zavrsiPosao').post((req, res) => new korisnik_controller_1.KorisnikController().zavrsiPosao(req, res));
exports.default = korisnikRuter;
