/**
 * Script para adicionar temas padrão a todos os tenants existentes
 * Útil quando os temas padrão foram criados após alguns tenants já existirem
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

// Verificar variáveis de ambiente
if (!process.env.DATABASE_URL_SUPER) {
  console.error("❌ Erro: DATABASE_URL_SUPER não está definido no .env");
  process.exit(1);
}

// Usar o cliente Prisma gerado do schema-super
let PrismaSuperClient;
try {
  const prismaSuperModule = require("../generated/prisma-super");
  PrismaSuperClient = prismaSuperModule.PrismaClient;
} catch (e) {
  console.error("❌ Erro: Cliente Prisma do schema-super não encontrado");
  console.error("   Execute: npm run prisma:generate");
  process.exit(1);
}

const { PrismaClient } = require("@prisma/client");
const { seedDefaultThemes } = require("./seed-default-themes");

const prismaSuper = new PrismaSuperClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

async function addThemesToAllTenants() {
  try {
    console.log("🚀 Adicionando temas padrão a todos os tenants...\n");

    // Buscar todos os tenants ativos
    const tenants = await prismaSuper.tenant.findMany({
      where: {
        isActive: true,
      },
    });

    if (tenants.length === 0) {
      console.log("⚠️  Nenhum tenant encontrado");
      return;
    }

    console.log(`📋 Encontrados ${tenants.length} tenant(s)\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const tenant of tenants) {
      try {
        console.log(`\n🏢 Processando tenant: ${tenant.name} (${tenant.subdomain})`);
        console.log(`   Banco: ${tenant.databaseName}`);

        // Verificar se a URL está completa
        if (!tenant.databaseUrl || !tenant.databaseUrl.startsWith("mysql://")) {
          console.log(`   ⚠️  URL do banco inválida, pulando...`);
          errorCount++;
          continue;
        }

        // Criar cliente Prisma para o tenant
        const tenantDb = new PrismaClient({
          datasources: {
            db: {
              url: tenant.databaseUrl,
            },
          },
        });

        // Criar temas padrão
        await seedDefaultThemes(tenantDb);

        // Desconectar
        await tenantDb.$disconnect();

        successCount++;
        console.log(`   ✅ Temas adicionados com sucesso`);
      } catch (error) {
        console.error(`   ❌ Erro ao processar tenant:`, error.message);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`\n✅ Processo concluído!`);
    console.log(`   ${successCount} tenant(s) processado(s) com sucesso`);
    console.log(`   ${errorCount} tenant(s) com erro`);
    console.log(`   ${tenants.length} tenant(s) no total\n`);
  } catch (error) {
    console.error("❌ Erro:", error);
    throw error;
  } finally {
    await prismaSuper.$disconnect();
  }
}

// Executar
if (require.main === module) {
  addThemesToAllTenants()
    .then(() => {
      console.log("\n✅ Script finalizado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Erro:", error);
      process.exit(1);
    });
}

module.exports = { addThemesToAllTenants };

