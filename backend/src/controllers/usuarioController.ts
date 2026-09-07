import { Request, Response } from "express";
import { criarUsuario, autenticarUsuario, buscarUsuario } from "../services/usuarioService";

export async function cadastrarUsuario(
  req: Request,
  res: Response
) {
  try {
    const { nome, email, senha, idade, peso } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios.",
      });
    }

    const usuario = await criarUsuario({
      nome,
      email,
      senha,
      idade,
      peso,
    });

    return res.status(201).json(usuario);

  } catch (error) {

    if (
      error instanceof Error &&
      error.message === "EMAIL_JA_CADASTRADO"
    ) {
      return res.status(409).json({
        mensagem: "Este email já está cadastrado.",
      });
    }

    console.error("Erro ao cadastrar usuário:", error);

    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
    });
  }
}

export async function loginUsuario(
  req: Request,
  res: Response
) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios.",
      });
    }

    const usuario = await autenticarUsuario({
      email,
      senha,
    });

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      usuario,
    });

  } catch (error) {

    if (
      error instanceof Error &&
      error.message === "CREDENCIAIS_INVALIDAS"
    ) {
      return res.status(401).json({
        mensagem: "Email ou senha incorretos.",
      });
    }

    console.error("Erro ao realizar login:", error);

    return res.status(500).json({
      mensagem: "Erro ao realizar login.",
    });
  }
}

export async function buscarUsuarioController(
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

    const usuario = await buscarUsuario(usuario_id);

    return res.status(200).json(usuario);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USUARIO_NAO_ENCONTRADO"
    ) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    console.error("Erro ao buscar usuário:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar usuário.",
    });
  }
}