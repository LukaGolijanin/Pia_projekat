import express from 'express';
import { ZakazivanjeController } from '../controllers/zakazivanje.controller';

const ZakazivanjaRouter = express.Router();

ZakazivanjaRouter.route('/zakazi').post(
    (req, res) => new ZakazivanjeController().zakazi(req, res)
)

ZakazivanjaRouter.route('/getMojaTrenutnaZakazivanja/:kor_ime').get(
    (req, res) => new ZakazivanjeController().getMojaTrenutnaZakazivanja(req, res)
)

ZakazivanjaRouter.route('/getMojaArhivaZakazivanja/:kor_ime').get(
    (req, res) => new ZakazivanjeController().getMojaArhivaZakazivanja(req, res)
)

ZakazivanjaRouter.route('/getFirminaZakazivanja/:firma').get(
    (req, res) => new ZakazivanjeController().getFirminaZakazivanja(req, res)
)

ZakazivanjaRouter.route('/getZakazivanja').get(
    (req, res) => new ZakazivanjeController().getZakazivanja(req, res)
)

ZakazivanjaRouter.route('/getPotvrdjenaZakazivanja/:kor_ime').get(
    (req, res) => new ZakazivanjeController().getPotvrdjenaZakazivanja(req, res)
)

ZakazivanjaRouter.route('/otkazi').post(
    (req, res) => new ZakazivanjeController().otkazi(req, res)
)

ZakazivanjaRouter.route('/promeniStatus').post(
    (req, res) => new ZakazivanjeController().promeniStatus(req, res)
)

ZakazivanjaRouter.route('/getZavrsenaZakazivanja/:kor_ime').get(
    (req, res) => new ZakazivanjeController().getZavrsenaZakazivanja(req, res)
)

ZakazivanjaRouter.route('/getZahteviServisa/:firma').get(
    (req, res) => new ZakazivanjeController().getZahteviServisa(req, res)
)

ZakazivanjaRouter.route('/getMojaServisiranja/:kor_ime').get(
    (req, res) => new ZakazivanjeController().getMojaServisiranja(req, res)
)

ZakazivanjaRouter.route('/potvrdiServis').post(
    (req, res) => new ZakazivanjeController().potvrdiServis(req, res)
)
export default ZakazivanjaRouter;