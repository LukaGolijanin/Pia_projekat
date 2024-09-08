"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
mongoose_1.default.connect("mongodb://127.0.0.1:27017/basta");
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    console.log("db connection ok");
});
const uploadsPath = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath);
}
const korisnik_1 = __importDefault(require("../models/korisnik"));
const saltRounds = 10;
function hashPasswords() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const korisnici = yield korisnik_1.default.find({});
            for (let k of korisnici) {
                if (k.lozinka) {
                    const hashLozinka = yield bcrypt_1.default.hash(k.lozinka, saltRounds);
                    k.lozinka = hashLozinka;
                    yield k.save();
                    console.log(`Uspesno ispravljen ${k.kor_ime}`);
                }
            }
        }
        catch (err) {
            console.log('GRESKA', err);
        }
        finally {
            mongoose_1.default.connection.close();
        }
    });
}
hashPasswords();
/*
function gracefulShutdown() {
  console.log('Closing MongoDB connection...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);*/
