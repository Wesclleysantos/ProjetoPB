import pool from "../database/database";

interface CriarMeta {
  usuario_id: number;
  quantidade_ml: number;
}

export async function criarMeta(dados: CriarMeta) {
  const { usuario_id, quantidade_ml } = dados;

  const usuario = await pool.query(
    `
      SELECT id
      FROM usuario
      WHERE id = $1;
    `,
    [usuario_id]
  );

  if (usuario.rows.length === 0) {
    throw new Error("USUARIO_NAO_ENCONTRADO");
  }

  // Desativa uma meta anterior, caso exista
  await pool.query(
    `
      UPDATE meta
      SET ativa = FALSE
      WHERE usuario_id = $1
        AND ativa = TRUE;
    `,
    [usuario_id]
  );

  const resultado = await pool.query(
    `
      INSERT INTO meta
        (usuario_id, quantidade_ml)
      VALUES
        ($1, $2)
      RETURNING
        id,
        usuario_id,
        quantidade_ml,
        data_inicio,
        ativa;
    `,
    [usuario_id, quantidade_ml]
  );

  return resultado.rows[0];
}

export async function buscarMeta(usuario_id: number) {
  const resultado = await pool.query(
    `
      SELECT
        id,
        usuario_id,
        quantidade_ml,
        data_inicio,
        ativa
      FROM meta
      WHERE usuario_id = $1
        AND ativa = TRUE
      ORDER BY data_inicio DESC
      LIMIT 1;
    `,
    [usuario_id]
  );

  return resultado.rows[0] || null;
}