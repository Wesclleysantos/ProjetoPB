import pool from "../database/database";

export async function buscarProgresso(usuario_id: number) {
  const metaResultado = await pool.query(
    `
      SELECT quantidade_ml
      FROM meta
      WHERE usuario_id = $1
        AND ativa = TRUE
      ORDER BY data_inicio DESC
      LIMIT 1;
    `,
    [usuario_id]
  );

  if (metaResultado.rows.length === 0) {
    throw new Error("META_NAO_ENCONTRADA");
  }

  const metaMl = Number(metaResultado.rows[0].quantidade_ml);

  const consumoResultado = await pool.query(
    `
      SELECT COALESCE(SUM(hidratacao_calculada), 0) AS total
      FROM consumo
      WHERE usuario_id = $1
        AND DATE(data_hora) = CURRENT_DATE;
    `,
    [usuario_id]
  );

  const consumidoMl = Number(consumoResultado.rows[0].total);

  const restanteMl = Math.max(metaMl - consumidoMl, 0);

  const progresso = Math.min(
    (consumidoMl / metaMl) * 100,
    100
  );

  return {
    meta_ml: metaMl,
    consumido_ml: consumidoMl,
    restante_ml: restanteMl,
    progresso: Number(progresso.toFixed(2)),
  };
}