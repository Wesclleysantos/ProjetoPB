import pool from "../database/database";

export async function listarBebidas() {
  const resultado = await pool.query(
    `
      SELECT id, nome, fator_hidratacao
      FROM bebida
      ORDER BY id;
    `
  );

  return resultado.rows;
}