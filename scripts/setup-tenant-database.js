/**
 * Script para criar/verificar banco de dados de um tenant existente
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

let PrismaSuperClient;
try {
  PrismaSuperClient = require("../generated/prisma-super").PrismaClient;
} catch {
  try {
    PrismaSuperClient = require("@prisma/client").PrismaClient;
  } catch {
    console.error("Erro ao carregar Prisma Client");
    process.exit(1);
  }
}

const { createTenantDatabase } = require("./create-tenant-database");

const prismaSuper = new PrismaSuperClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

async function setupTenantDatabase(subdomain) {
  try {
    console.log(`🔍 Buscando tenant: "${subdomain}"\n`);

    const tenant = await prismaSuper.tenant.findUnique({
      where: { subdomain: subdomain.toLowerCase() },
      include: {
        plan: true,
      },
    });

    if (!tenant) {
      console.log(`❌ Tenant não encontrado com subdomain: "${subdomain}"`);
      return;
    }

    console.log(`✅ Tenant encontrado: ${tenant.name}`);
    console.log(`   Banco: ${tenant.databaseName}`);
    console.log(`   URL: ${tenant.databaseUrl}\n`);

    // Verificar se a URL está completa
    if (!tenant.databaseUrl.startsWith("mysql://")) {
      console.log("⚠️  URL do banco está incompleta. Corrigindo...");

      // Construir URL completa
      const superUrl = process.env.DATABASE_URL_SUPER;
      if (!superUrl) {
        throw new Error("DATABASE_URL_SUPER não configurada");
      }

      const urlObj = new URL(superUrl.replace(/^mysql:\/\//, "http://"));
      const baseUrl = `mysql://${urlObj.username}:${urlObj.password}@${urlObj.hostname}:${urlObj.port || 3306}/`;
      const completeUrl = `${baseUrl}${tenant.databaseName}?schema=public&connection_limit=1`;

      await prismaSuper.tenant.update({
        where: { id: tenant.id },
        data: { databaseUrl: completeUrl },
      });

      console.log(`✅ URL corrigida: ${completeUrl}\n`);

      // Atualizar variável local
      tenant.databaseUrl = completeUrl;
    }

    // Criar banco de dados
    console.log(`📦 Criando/verificando banco de dados...`);
    await createTenantDatabase(tenant.databaseName, tenant.databaseUrl);

    console.log(`\n✅ Processo concluído!`);
    console.log(`\n🔗 Acesse o tenant em:`);
    console.log(`   Local: http://${tenant.subdomain}.localhost:3000`);
    console.log(`   Produção: https://${tenant.subdomain}.barberboss.com`);
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prismaSuper.$disconnect();
  }
}

const subdomain = process.argv[2] || "santos";
setupTenantDatabase(subdomain);
