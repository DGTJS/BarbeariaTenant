/**
 * Script para criar banco de dados MySQL para um novo tenant
 * Executa todas as migrations do schema principal no novo banco
 */

const mysql = require("mysql2/promise");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

async function createTenantDatabase(databaseName, databaseUrl) {
  try {
    // Extrair dados da URL de conexão
    const url = new URL(databaseUrl.replace("mysql://", "https://"));
    const host = url.hostname;
    const port = url.port || 3306;
    const user = url.username;
    const password = url.password;

    // Conectar ao MySQL (sem especificar database)
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
    });

    console.log(`📦 Criando banco de dados: ${databaseName}`);

    // Criar banco de dados
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Banco de dados criado: ${databaseName}`);

    await connection.end();

    // Executar migrations do Prisma no novo banco
    console.log(`🔄 Criando schema do banco de dados...`);

    // Para banco novo, usar db push que cria o schema completo
    // Isso é mais rápido e seguro para novos tenants
    const { stdout, stderr } = await execAsync(
      `npx prisma db push --schema=prisma/schema.prisma --accept-data-loss`,
      {
        cwd: process.cwd(),
        shell: true,
        env: { ...process.env, DATABASE_URL: databaseUrl },
      }
    );

    // Verificar se realmente houve erro (não apenas warnings)
    const hasError =
      stderr &&
      !stderr.includes("warning") &&
      !stderr.includes("warn") &&
      !stderr.includes("Done in") &&
      !stderr.includes("deprecated") &&
      stderr.toLowerCase().includes("error");

    if (hasError) {
      console.error("❌ Erro ao criar schema:", stderr);
      throw new Error(stderr);
    }

    // Se houver warnings mas não erros, mostrar mas continuar
    if (stderr && (stderr.includes("warning") || stderr.includes("warn"))) {
      console.log(
        "⚠️  Avisos (pode ignorar):",
        stderr
          .split("\n")
          .filter(l => l.includes("warn"))
          .join("\n")
      );
    }

    console.log(`✅ Schema criado com sucesso`);
    console.log(
      `🎉 Banco de dados do tenant ${databaseName} criado e configurado!`
    );

    return true;
  } catch (error) {
    console.error("❌ Erro ao criar banco de dados do tenant:", error);
    throw error;
  }
}

// Exemplo de uso
if (require.main === module) {
  const databaseName = process.argv[2];
  const databaseUrl = process.argv[3];

  if (!databaseName || !databaseUrl) {
    console.error(
      "Uso: node create-tenant-database.js <databaseName> <databaseUrl>"
    );
    process.exit(1);
  }

  createTenantDatabase(databaseName, databaseUrl)
    .then(() => {
      console.log("✅ Processo concluído");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Erro:", error);
      process.exit(1);
    });
}

module.exports = { createTenantDatabase };
