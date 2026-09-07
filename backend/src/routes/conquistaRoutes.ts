import { Router } from "express";
import { buscarConquistas, buscarConquistasUsuario } from "../controllers/conquistaController";

const router = Router();

router.get("/conquistas", buscarConquistas);
router.get("/usuarios/:id/conquistas", buscarConquistasUsuario);

export default router;