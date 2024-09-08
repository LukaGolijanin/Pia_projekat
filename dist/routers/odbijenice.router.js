"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const odbijenice_controller_1 = require("../controllers/odbijenice.controller");
const OdbijeniceRouter = express_1.default.Router();
OdbijeniceRouter.route('/sacuvajOdbijenicu').post((req, res) => new odbijenice_controller_1.OdbijeniceController().sacuvajOdbijenicu(req, res));
OdbijeniceRouter.route('/getOdbijenice/:dekorater').get((req, res) => new odbijenice_controller_1.OdbijeniceController().getOdbijenice(req, res));
exports.default = OdbijeniceRouter;
