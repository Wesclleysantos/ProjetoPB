import pool from "../database/database";

interface CriarConsumo {
  usuario_id: number;
  bebida_id: number;
  quantidade_ml: number;
}

export async function criarConsumo(dados: CriarConsumo) {
  const { usuario_id, bebida_id, quantidade_ml } = dados;

  const bebida = await pool.query(
    `
      SELECT id, nome, fator_hidratacao
      FROM bebida
      WHERE id = $1;
    `,
    [bebida_id]
  );

  if (bebida.rows.length === 0) {
    throw new Error("BEBIDA_NAO_ENCONTRADA");
  }


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

  const fatorHidratacao = Number(
    bebida.rows[0].fator_hidratacao
  );
  
  const hidratacaoCalculada =
    quantidade_ml * fatorHidratacao;

  const resultado = await pool.query(
    `
      INSERT INTO consumo
        (
          usuario_id,
          bebida_id,
          quantidade_ml,
          hidratacao_calculada
        )
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        usuario_id,
        bebida_id,
        quantidade_ml,
        hidratacao_calculada,
        data_hora;
    `,
    [
      usuario_id,
      bebida_id,
      quantidade_ml,
      hidratacaoCalculada,
    ]
  );

  const conquista = await pool.query(
  `
    SELECT id, nome, pontos
    FROM conquista
    WHERE nome = 'Primeiro consumo';
  `
);

let conquistaDesbloqueada = false;

if (conquista.rows.length > 0) {
  const conquistaId = conquista.rows[0].id;
  const pontos = conquista.rows[0].pontos;

  const possuiConquista = await pool.query(
    `
      SELECT 1
      FROM usuario_conquista
      WHERE usuario_id = $1
        AND conquista_id = $2;
    `,
    [usuario_id, conquistaId]
  );

  if (possuiConquista.rows.length === 0) {
    await pool.query(
      `
        INSERT INTO usuario_conquista
          (usuario_id, conquista_id)
        VALUES
          ($1, $2);
      `,
      [usuario_id, conquistaId]
    );

    await pool.query(
      `
        UPDATE usuario
        SET pontos = pontos + $1
        WHERE id = $2;
      `,
      [pontos, usuario_id]
    );

    conquistaDesbloqueada = true;
  }
}
// Verifica se a meta diária foi atingida
let metaAtingida = false;

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

if (metaResultado.rows.length > 0) {
  const metaMl = Number(metaResultado.rows[0].quantidade_ml);

  const consumoHoje = await pool.query(
    `
      SELECT COALESCE(SUM(hidratacao_calculada), 0) AS total
      FROM consumo
      WHERE usuario_id = $1
        AND DATE(data_hora) = CURRENT_DATE;
    `,
    [usuario_id]
  );

  const totalConsumido = Number(consumoHoje.rows[0].total);

  if (totalConsumido >= metaMl) {
    const conquistaMeta = await pool.query(
      `
        SELECT id, pontos
        FROM conquista
        WHERE nome = 'Meta atingida';
      `
    );

    if (conquistaMeta.rows.length > 0) {
      const conquistaId = conquistaMeta.rows[0].id;
      const pontos = conquistaMeta.rows[0].pontos;

      const possuiConquista = await pool.query(
        `
          SELECT 1
          FROM usuario_conquista
          WHERE usuario_id = $1
            AND conquista_id = $2;
        `,
        [usuario_id, conquistaId]
      );

      if (possuiConquista.rows.length === 0) {
        await pool.query(
          `
            INSERT INTO usuario_conquista
              (usuario_id, conquista_id)
            VALUES
              ($1, $2);
          `,
          [usuario_id, conquistaId]
        );

        await pool.query(
          `
            UPDATE usuario
            SET pontos = pontos + $1
            WHERE id = $2;
          `,
          [pontos, usuario_id]
        );

        metaAtingida = true;
      }
    }
  }
}
let sequencia3Dias = false;

const metaAtual = await pool.query(
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

if (metaAtual.rows.length > 0) {
  const metaMl = Number(metaAtual.rows[0].quantidade_ml);

  const diasMeta = await pool.query(
    `
      SELECT
        DATE(data_hora) AS dia,
        SUM(hidratacao_calculada) AS total
      FROM consumo
      WHERE usuario_id = $1
        AND DATE(data_hora) >= CURRENT_DATE - INTERVAL '2 days'
      GROUP BY DATE(data_hora)
      ORDER BY dia;
    `,
    [usuario_id]
  );

  if (diasMeta.rows.length === 3) {
    const dia1 = new Date(diasMeta.rows[0].dia);
    const dia2 = new Date(diasMeta.rows[1].dia);
    const dia3 = new Date(diasMeta.rows[2].dia);

    const diferenca1 =
      (dia2.getTime() - dia1.getTime()) / (1000 * 60 * 60 * 24);

    const diferenca2 =
      (dia3.getTime() - dia2.getTime()) / (1000 * 60 * 60 * 24);

    const todosAtingiramMeta = diasMeta.rows.every(
      (dia) => Number(dia.total) >= metaMl
    );

    const diasConsecutivos =
      diferenca1 === 1 && diferenca2 === 1;

    if (todosAtingiramMeta && diasConsecutivos) {
      const conquista3Dias = await pool.query(
        `
          SELECT id, pontos
          FROM conquista
          WHERE nome = 'Sequência de 3 dias';
        `
      );

      if (conquista3Dias.rows.length > 0) {
        const conquistaId = conquista3Dias.rows[0].id;
        const pontos = conquista3Dias.rows[0].pontos;

        const possuiConquista = await pool.query(
          `
            SELECT 1
            FROM usuario_conquista
            WHERE usuario_id = $1
              AND conquista_id = $2;
          `,
          [usuario_id, conquistaId]
        );

        if (possuiConquista.rows.length === 0) {
          await pool.query(
            `
              INSERT INTO usuario_conquista
                (usuario_id, conquista_id)
              VALUES
                ($1, $2);
            `,
            [usuario_id, conquistaId]
          );

          await pool.query(
            `
              UPDATE usuario
              SET pontos = pontos + $1
              WHERE id = $2;
            `,
            [pontos, usuario_id]
          );

          sequencia3Dias = true;
        }
      }
    }
  }
}
// Verifica se o usuário atingiu a meta por 7 dias consecutivos
let sequencia7Dias = false;

const meta7Dias = await pool.query(
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

if (meta7Dias.rows.length > 0) {
  const metaMl = Number(meta7Dias.rows[0].quantidade_ml);

  const diasMeta7 = await pool.query(
    `
      SELECT
        DATE(data_hora) AS dia,
        SUM(hidratacao_calculada) AS total
      FROM consumo
      WHERE usuario_id = $1
        AND DATE(data_hora) >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE(data_hora)
      ORDER BY dia;
    `,
    [usuario_id]
  );

  if (diasMeta7.rows.length === 7) {
    const dias = diasMeta7.rows;

    const todosAtingiramMeta = dias.every(
      (dia) => Number(dia.total) >= metaMl
    );

    let diasConsecutivos = true;

    for (let i = 1; i < dias.length; i++) {
      const diaAnterior = new Date(dias[i - 1].dia);
      const diaAtual = new Date(dias[i].dia);

      const diferenca =
        (diaAtual.getTime() - diaAnterior.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diferenca !== 1) {
        diasConsecutivos = false;
        break;
      }
    }

    if (todosAtingiramMeta && diasConsecutivos) {
      const conquista7Dias = await pool.query(
        `
          SELECT id, pontos
          FROM conquista
          WHERE nome = 'Sequência de 7 dias';
        `
      );

      if (conquista7Dias.rows.length > 0) {
        const conquistaId = conquista7Dias.rows[0].id;
        const pontos = conquista7Dias.rows[0].pontos;

        const possuiConquista = await pool.query(
          `
            SELECT 1
            FROM usuario_conquista
            WHERE usuario_id = $1
              AND conquista_id = $2;
          `,
          [usuario_id, conquistaId]
        );

        if (possuiConquista.rows.length === 0) {
          await pool.query(
            `
              INSERT INTO usuario_conquista
                (usuario_id, conquista_id)
              VALUES
                ($1, $2);
            `,
            [usuario_id, conquistaId]
          );

          await pool.query(
            `
              UPDATE usuario
              SET pontos = pontos + $1
              WHERE id = $2;
            `,
            [pontos, usuario_id]
          );

          sequencia7Dias = true;
        }
      }
    }
  }
}
// Verifica se o usuário acumulou 10 litros de hidratação
let dezLitros = false;

const hidratacaoTotal = await pool.query(
  `
    SELECT COALESCE(SUM(hidratacao_calculada), 0) AS total
    FROM consumo
    WHERE usuario_id = $1;
  `,
  [usuario_id]
);

const totalHidratacao = Number(hidratacaoTotal.rows[0].total);

if (totalHidratacao >= 10000) {
  const conquista10Litros = await pool.query(
    `
      SELECT id, pontos
      FROM conquista
      WHERE nome = '10 litros acumulados';
    `
  );

  if (conquista10Litros.rows.length > 0) {
    const conquistaId = conquista10Litros.rows[0].id;
    const pontos = conquista10Litros.rows[0].pontos;

    const possuiConquista = await pool.query(
      `
        SELECT 1
        FROM usuario_conquista
        WHERE usuario_id = $1
          AND conquista_id = $2;
      `,
      [usuario_id, conquistaId]
    );

    if (possuiConquista.rows.length === 0) {
      await pool.query(
        `
          INSERT INTO usuario_conquista
            (usuario_id, conquista_id)
          VALUES
            ($1, $2);
        `,
        [usuario_id, conquistaId]
      );

      await pool.query(
        `
          UPDATE usuario
          SET pontos = pontos + $1
          WHERE id = $2;
        `,
        [pontos, usuario_id]
      );

      dezLitros = true;
    }
  }
}
// Verifica se o usuário acumulou 25 litros de hidratação
let vinteCincoLitros = false;

if (totalHidratacao >= 25000) {
  const conquista25Litros = await pool.query(
    `
      SELECT id, pontos
      FROM conquista
      WHERE nome = '25 litros acumulados';
    `
  );

  if (conquista25Litros.rows.length > 0) {
    const conquistaId = conquista25Litros.rows[0].id;
    const pontos = conquista25Litros.rows[0].pontos;

    const possuiConquista = await pool.query(
      `
        SELECT 1
        FROM usuario_conquista
        WHERE usuario_id = $1
          AND conquista_id = $2;
      `,
      [usuario_id, conquistaId]
    );

    if (possuiConquista.rows.length === 0) {
      await pool.query(
        `
          INSERT INTO usuario_conquista
            (usuario_id, conquista_id)
          VALUES
            ($1, $2);
        `,
        [usuario_id, conquistaId]
      );

      await pool.query(
        `
          UPDATE usuario
          SET pontos = pontos + $1
          WHERE id = $2;
        `,
        [pontos, usuario_id]
      );

      vinteCincoLitros = true;
    }
  }
}
// Verifica se o usuário consumiu 3 tipos diferentes de bebidas
let tresTiposBebidas = false;

const tiposBebidas = await pool.query(
  `
    SELECT COUNT(DISTINCT bebida_id) AS total
    FROM consumo
    WHERE usuario_id = $1;
  `,
  [usuario_id]
);

const totalTiposBebidas = Number(tiposBebidas.rows[0].total);

if (totalTiposBebidas >= 3) {
  const conquista3Tipos = await pool.query(
    `
      SELECT id, pontos
      FROM conquista
      WHERE nome = '3 tipos de bebidas';
    `
  );

  if (conquista3Tipos.rows.length > 0) {
    const conquistaId = conquista3Tipos.rows[0].id;
    const pontos = conquista3Tipos.rows[0].pontos;

    const possuiConquista = await pool.query(
      `
        SELECT 1
        FROM usuario_conquista
        WHERE usuario_id = $1
          AND conquista_id = $2;
      `,
      [usuario_id, conquistaId]
    );

    if (possuiConquista.rows.length === 0) {
      await pool.query(
        `
          INSERT INTO usuario_conquista
            (usuario_id, conquista_id)
          VALUES
            ($1, $2);
        `,
        [usuario_id, conquistaId]
      );

      await pool.query(
        `
          UPDATE usuario
          SET pontos = pontos + $1
          WHERE id = $2;
        `,
        [pontos, usuario_id]
      );

      tresTiposBebidas = true;
    }
  }
}
// Verifica se o usuário atingiu a meta em 10 dias diferentes
let dezMetasAlcancadas = false;

const metaAtual10Dias = await pool.query(
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

if (metaAtual10Dias.rows.length > 0) {
  const metaMl = Number(metaAtual10Dias.rows[0].quantidade_ml);

  const diasAtingidos = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM (
        SELECT DATE(data_hora) AS dia
        FROM consumo
        WHERE usuario_id = $1
        GROUP BY DATE(data_hora)
        HAVING SUM(hidratacao_calculada) >= $2
      ) AS dias;
    `,
    [usuario_id, metaMl]
  );

  const totalDiasAtingidos = Number(diasAtingidos.rows[0].total);

  if (totalDiasAtingidos >= 10) {
    const conquista10Metas = await pool.query(
      `
        SELECT id, pontos
        FROM conquista
        WHERE nome = '10 metas alcançadas';
      `
    );

    if (conquista10Metas.rows.length > 0) {
      const conquistaId = conquista10Metas.rows[0].id;
      const pontos = conquista10Metas.rows[0].pontos;

      const possuiConquista = await pool.query(
        `
          SELECT 1
          FROM usuario_conquista
          WHERE usuario_id = $1
            AND conquista_id = $2;
        `,
        [usuario_id, conquistaId]
      );

      if (possuiConquista.rows.length === 0) {
        await pool.query(
          `
            INSERT INTO usuario_conquista
              (usuario_id, conquista_id)
            VALUES
              ($1, $2);
          `,
          [usuario_id, conquistaId]
        );

        await pool.query(
          `
            UPDATE usuario
            SET pontos = pontos + $1
            WHERE id = $2;
          `,
          [pontos, usuario_id]
        );

        dezMetasAlcancadas = true;
      }
    }
  }
}
return {
  ...resultado.rows[0],
  bebida: bebida.rows[0].nome,
  fator_hidratacao: fatorHidratacao,
  conquista_desbloqueada: conquistaDesbloqueada,
  meta_atingida: metaAtingida,
  sequencia_3_dias: sequencia3Dias,
  sequencia_7_dias: sequencia7Dias,
  dez_litros: dezLitros,
  vinte_cinco_litros: vinteCincoLitros,
  tres_tipos_bebidas: tresTiposBebidas,
  dez_metas_alcancadas: dezMetasAlcancadas,
};
}

export async function listarConsumos(usuario_id: number) {
  const resultado = await pool.query(
    `
      SELECT
        consumo.id,
        consumo.usuario_id,
        consumo.bebida_id,
        bebida.nome AS bebida,
        consumo.quantidade_ml,
        consumo.hidratacao_calculada,
        consumo.data_hora
      FROM consumo
      INNER JOIN bebida
        ON bebida.id = consumo.bebida_id
      WHERE consumo.usuario_id = $1
      ORDER BY consumo.data_hora DESC;
    `,
    [usuario_id]
  );

  return resultado.rows;
}