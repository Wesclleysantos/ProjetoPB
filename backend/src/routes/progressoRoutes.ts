import { Router } from "express";
import { buscarProgressoController } from "../controllers/progressoController";

const router = Router();

router.get("/progresso", buscarProgressoController);

export default router;