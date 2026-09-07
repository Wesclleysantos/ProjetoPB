import { Request, Response } from "express";
import { listarBebidas } from "../services/bebidaService";

export async function buscarBebidas(
  req: Request,
  res: Response
) {
  try {
    const bebidas = await listarBebidas();

    return res.status(200).json(bebidas);
  } catch (error) {
    console.error("Erro ao buscar bebidas:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar bebidas.",
    });
  }
}