import { Client } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    console.log("Conectado ao PostgreSQL.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsDir = path.join(__dirname, "migrations");

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const result = await client.query<{ name: string }>(
      "SELECT name FROM migrations"
    );

    const executedMigrations = new Set(
      result.rows.map((row) => row.name)
    );

    for (const file of files) {
      if (executedMigrations.has(file)) {
        console.log(`Já executada: ${file}`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Executando: ${file}`);

      try {
        await client.query("BEGIN");

        await client.query(sql);

        await client.query(
          "INSERT INTO migrations (name) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");

        console.log(`Concluída: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");

        throw new Error(
          `Erro na migration ${file}: ${
            error instanceof Error ? error.message : error
          }`
        );
      }
    }

    console.log("Migrations concluídas.");
  } catch (error) {
    console.error(
      "Erro ao executar migrations:",
      error instanceof Error ? error.message : error
    );

    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

migrate();