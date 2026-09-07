import { Router } from "express";
import { registrarMeta, buscarMetaController } from "../controllers/metaController";

const router = Router();

router.post("/meta", registrarMeta);
router.get("/meta", buscarMetaController);

export default router;