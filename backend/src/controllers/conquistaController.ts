import { Request, Response } from "express";
import { listarConquistas, listarConquistasUsuario } from "../services/conquistaService";

export async function buscarConquistas(
  req: Request,
  res: Response
) {
  try {
    const conquistas = await listarConquistas();

    return res.status(200).json(conquistas);
  } catch (error) {
    console.error("Erro ao buscar conquistas:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar conquistas.",
    });
  }
}

export async function buscarConquistasUsuario(
  req: Request,
  res: Response
) {
  try {
    const usuario_id = Number(req.params.id);

    if (!usuario_id) {
      return res.status(400).json({
        mensagem: "ID do usuário é obrigatório.",
      });
    }

    const conquistas = await listarConquistasUsuario(
      usuario_id
    );

    return res.status(200).json(conquistas);
  } catch (error) {
    console.error(
      "Erro ao buscar conquistas do usuário:",
      error
    );

    return res.status(500).json({
      mensagem: "Erro ao buscar conquistas do usuário.",
    });
  }
}