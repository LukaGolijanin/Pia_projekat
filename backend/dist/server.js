"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const korisnik_router_1 = __importDefault(require("./routers/korisnik.router"));
const firme_router_1 = __importDefault(require("./routers/firme.router"));
const zakazivanja_router_1 = __importDefault(require("./routers/zakazivanja.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const body_parser_1 = __importDefault(require("body-parser"));
const odbijenice_router_1 = __importDefault(require("./routers/odbijenice.router"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
mongoose_1.default.connect("mongodb://127.0.0.1:27017/basta");
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    console.log("db connection ok");
});
const uploadsPath = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath);
}
app.use('/uploads', express_1.default.static(uploadsPath));
console.log('Uploads directory:', uploadsPath);
const router = express_1.default.Router();
router.use('/users', korisnik_router_1.default);
router.use('/firme', firme_router_1.default);
router.use('/zakazivanja', zakazivanja_router_1.default);
router.use('/odbijenice', odbijenice_router_1.default);
app.use("/", router);
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));
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
