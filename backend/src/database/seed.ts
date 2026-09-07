import pool from "./database";

async function seed() {
  try {
    console.log("Iniciando seed...");

    await pool.query(`
      INSERT INTO bebida (nome, fator_hidratacao)
      VALUES
        ('Água', 1.00),
        ('Chá', 0.90),
        ('Café', 0.80),
        ('Suco', 0.90)
      ON CONFLICT (nome) DO NOTHING;
    `);

    await pool.query(`
  INSERT INTO conquista (nome, descricao, pontos)
  VALUES
    (
      'Primeiro consumo',
      'Registrou seu primeiro consumo de bebida.',
      10
    ),
    (
      'Meta atingida',
      'Atingiu sua meta diária de hidratação.',
      20
    ),
    (
      'Sequência de 3 dias',
      'Atingiu sua meta por 3 dias consecutivos.',
      30
    ),
    (
      'Sequência de 7 dias',
      'Atingiu sua meta por 7 dias consecutivos.',
      50
    ),
    (
      '10 litros acumulados',
      'Acumulou 10 litros de hidratação.',
      50
    ),
    (
      '25 litros acumulados',
      'Acumulou 25 litros de hidratação.',
      100
    ),
    (
      '3 tipos de bebidas',
      'Registrou consumo de 3 tipos diferentes de bebidas.',
      30
    ),
    (
      '10 metas alcançadas',
      'Atingiu sua meta diária em 10 dias diferentes.',
      100
    )
  ON CONFLICT (nome) DO NOTHING;
`);

    console.log("Seed concluída com sucesso!");
  } catch (error) {
    console.error(
      "Erro ao executar seed:",
      error instanceof Error ? error.message : error
    );

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();