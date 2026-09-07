import { Request, Response } from "express";
import { buscarProgresso } from "../services/progressoService";

export async function buscarProgressoController(
  req: Request,
  res: Response
) {
  try {
    const usuario_id = Number(req.query.usuario_id);

    if (!usuario_id) {
      return res.status(400).json({
        mensagem: "usuario_id é obrigatório.",
      });
    }

    const progresso = await buscarProgresso(usuario_id);

    return res.status(200).json(progresso);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "META_NAO_ENCONTRADA"
    ) {
      return res.status(404).json({
        mensagem: "Nenhuma meta ativa encontrada.",
      });
    }

    console.error("Erro ao buscar progresso:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar progresso.",
    });
  }
}