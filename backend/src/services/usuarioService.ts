import pool from "../database/database";
import bcrypt from "bcrypt";
import { calcularNivel } from "./nivelService";

interface CriarUsuario {
  nome: string;
  email: string;
  senha: string;
  idade?: number;
  peso?: number;
}

export async function criarUsuario(dados: CriarUsuario) {
  const { nome, email, senha, idade, peso } = dados;

  const usuarioExistente = await pool.query(
    "SELECT id FROM usuario WHERE email = $1",
    [email]
  );

  if (usuarioExistente.rows.length > 0) {
    throw new Error("EMAIL_JA_CADASTRADO");
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const resultado = await pool.query(
    `
      INSERT INTO usuario
        (nome, email, senha, idade, peso)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, idade, peso, pontos, data_criacao;
    `,
    [nome, email, senhaHash, idade, peso]
  );

  return resultado.rows[0];
}

interface LoginUsuario {
  email: string;
  senha: string;
}

export async function autenticarUsuario(dados: LoginUsuario) {
  const { email, senha } = dados;

  const resultado = await pool.query(
    `
      SELECT id, nome, email, senha, idade, peso, pontos
      FROM usuario
      WHERE email = $1;
    `,
    [email]
  );

  if (resultado.rows.length === 0) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  const usuario = resultado.rows[0];

  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senha
  );

  if (!senhaValida) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    idade: usuario.idade,
    peso: usuario.peso,
    pontos: usuario.pontos,
  };
}

export async function buscarUsuario(usuario_id: number) {
  const resultado = await pool.query(
    `
      SELECT
        id,
        nome,
        email,
        idade,
        peso,
        pontos,
        data_criacao
      FROM usuario
      WHERE id = $1;
    `,
    [usuario_id]
  );

  if (resultado.rows.length === 0) {
    throw new Error("USUARIO_NAO_ENCONTRADO");
  }

  const usuario = resultado.rows[0];

  const nivel = calcularNivel(Number(usuario.pontos));

  return {
    ...usuario,
    nivel: nivel.nivel,
    nivel_nome: nivel.nome,
  };
}