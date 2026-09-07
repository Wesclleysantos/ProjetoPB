import pool from "../database/database";

export async function listarConquistas() {
  const resultado = await pool.query(
    `
      SELECT
        id,
        nome,
        descricao,
        pontos
      FROM conquista
      ORDER BY id;
    `
  );

  return resultado.rows;
}

export async function listarConquistasUsuario(
  usuario_id: number
) {
  const resultado = await pool.query(
    `
      SELECT
        conquista.id,
        conquista.nome,
        conquista.descricao,
        conquista.pontos,
        usuario_conquista.data_conquista
      FROM usuario_conquista
      INNER JOIN conquista
        ON conquista.id = usuario_conquista.conquista_id
      WHERE usuario_conquista.usuario_id = $1
      ORDER BY usuario_conquista.data_conquista DESC;
    `,
    [usuario_id]
  );

  return resultado.rows;
}