/**
 * Script para verificar temas em todos os tenants
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

const { PrismaClient } = require("@prisma/client");

const prismaSuper = new PrismaSuperClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

async function checkThemes() {
  try {
    console.log("🔍 Buscando todos os tenants...");
    
    const tenants = await prismaSuper.tenants.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
        databaseUrl: true,
        databaseName: true,
      },
    });

    console.log(`✅ Encontrados ${tenants.length} tenant(s) ativo(s)\n`);

    for (const tenant of tenants) {
      console.log(`\n📦 Tenant: ${tenant.name} (${tenant.subdomain})`);
      console.log(`   Database: ${tenant.databaseName}`);
      
      try {
        // Criar Prisma client para o tenant
        const tenantDb = new PrismaClient({
          datasources: {
            db: {
              url: tenant.databaseUrl,
            },
          },
        });

        // Buscar temas
        const themes = await tenantDb.theme.findMany({
          orderBy: { createdAt: 'asc' },
        });

        console.log(`   ✅ ${themes.length} tema(s) encontrado(s)`);
        
        if (themes.length > 0) {
          themes.forEach((theme, index) => {
            console.log(`      ${index + 1}. ${theme.name} (${theme.type}) - Ativo: ${theme.isActive}`);
          });
        } else {
          console.log(`   ⚠️  Nenhum tema encontrado!`);
        }

        await tenantDb.$disconnect();
      } catch (error) {
        console.error(`   ❌ Erro ao acessar banco:`, error.message);
      }
    }
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prismaSuper.$disconnect();
  }
}

checkThemes()
  .then(() => {
    console.log("\n✅ Verificação concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
