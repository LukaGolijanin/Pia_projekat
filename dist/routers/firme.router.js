"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firme_controller_1 = require("../controllers/firme.controller");
const FirmeRouter = express_1.default.Router();
FirmeRouter.route('/getFirme').get((req, res) => new firme_controller_1.FirmeController().getFirme(req, res));
FirmeRouter.route('/registrujFirmu').post((req, res) => new firme_controller_1.FirmeController().registrujFirmu(req, res));
exports.default = FirmeRouter;
