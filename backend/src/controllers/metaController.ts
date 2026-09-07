import { Request, Response } from "express";
import { criarMeta, buscarMeta } from "../services/metaService";

export async function registrarMeta(
  req: Request,
  res: Response
) {
  try {
    const {
      usuario_id,
      quantidade_ml,
    } = req.body;

    if (
      usuario_id === undefined ||
      quantidade_ml === undefined
    ) {
      return res.status(400).json({
        mensagem:
          "usuario_id e quantidade_ml são obrigatórios.",
      });
    }

    if (quantidade_ml <= 0) {
      return res.status(400).json({
        mensagem:
          "A quantidade da meta deve ser maior que zero.",
      });
    }

    const meta = await criarMeta({
      usuario_id,
      quantidade_ml,
    });

    return res.status(201).json(meta);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USUARIO_NAO_ENCONTRADO"
    ) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    console.error("Erro ao registrar meta:", error);

    return res.status(500).json({
      mensagem: "Erro ao registrar meta.",
    });
  }
}

export async function buscarMetaController(
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

    const meta = await buscarMeta(usuario_id);

    if (!meta) {
      return res.status(404).json({
        mensagem: "Nenhuma meta ativa encontrada.",
      });
    }

    return res.status(200).json(meta);
  } catch (error) {
    console.error("Erro ao buscar meta:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar meta.",
    });
  }
}