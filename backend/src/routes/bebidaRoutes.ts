import { Router } from "express";
import { buscarBebidas } from "../controllers/bebidaController";

const router = Router();

router.get("/bebidas", buscarBebidas);

export default router;