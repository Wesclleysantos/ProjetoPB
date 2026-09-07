import { Router } from "express";
import { registrarConsumo, buscarConsumos } from "../controllers/consumoController";

const router = Router();

router.post("/consumos", registrarConsumo);
router.get("/consumos", buscarConsumos);

export default router;