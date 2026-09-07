import { Request, Response } from "express";
import { criarConsumo, listarConsumos } from "../services/consumoService";

export async function registrarConsumo(
  req: Request,
  res: Response
) {
  try {
    const {
      usuario_id,
      bebida_id,
      quantidade_ml,
    } = req.body;

    if (
      usuario_id === undefined ||
      bebida_id === undefined ||
      quantidade_ml === undefined
    ) {
      return res.status(400).json({
        mensagem:
          "usuario_id, bebida_id e quantidade_ml são obrigatórios.",
      });
    }

    if (quantidade_ml <= 0) {
      return res.status(400).json({
        mensagem: "A quantidade deve ser maior que zero.",
      });
    }

    const consumo = await criarConsumo({
      usuario_id,
      bebida_id,
      quantidade_ml,
    });

    return res.status(201).json(consumo);

  } catch (error) {

    if (
      error instanceof Error &&
      error.message === "BEBIDA_NAO_ENCONTRADA"
    ) {
      return res.status(404).json({
        mensagem: "Bebida não encontrada.",
      });
    }

    if (
      error instanceof Error &&
      error.message === "USUARIO_NAO_ENCONTRADO"
    ) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    console.error("Erro ao registrar consumo:", error);

    return res.status(500).json({
      mensagem: "Erro ao registrar consumo.",
    });
  }
}
export async function buscarConsumos(
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

    const consumos = await listarConsumos(usuario_id);

    return res.status(200).json(consumos);
  } catch (error) {
    console.error("Erro ao buscar consumos:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar consumos.",
    });
  }
}