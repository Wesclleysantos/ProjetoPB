import { Router } from "express";
import { cadastrarUsuario, loginUsuario, buscarUsuarioController } from "../controllers/usuarioController";

const router = Router();

router.post("/usuarios", cadastrarUsuario);
router.post("/login", loginUsuario);
router.get("/usuarios/:id", buscarUsuarioController);

export default router;