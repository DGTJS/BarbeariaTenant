/**
 * Script para comparar bancos de dados dos tenants e verificar isolamento
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

async function compareTenantDatabases() {
  try {
    console.log("🔍 Comparando bancos de dados dos tenants...\n");

    // Buscar todos os tenants
    const tenants = await prismaSuper.tenant.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (tenants.length === 0) {
      console.log("⚠️  Nenhum tenant encontrado");
      return;
    }

    console.log(`✅ Encontrados ${tenants.length} tenant(s)\n`);

    // Comparar bancos de dados
    const databases = tenants.map(t => ({
      id: t.id,
      name: t.name,
      subdomain: t.subdomain,
      databaseName: t.databaseName,
      databaseUrl: t.databaseUrl,
    }));

    console.log("📊 Comparação de Bancos de Dados:\n");
    console.log("=".repeat(80));

    for (let i = 0; i < databases.length; i++) {
      const db = databases[i];
      console.log(`\n${i + 1}. ${db.name} (${db.subdomain})`);
      console.log(`   ID: ${db.id}`);
      console.log(`   Banco: ${db.databaseName}`);
      console.log(`   URL: ${db.databaseUrl}`);

      // Verificar se há duplicatas
      const duplicates = databases.filter(
        d => d.databaseName === db.databaseName && d.id !== db.id
      );
      if (duplicates.length > 0) {
        console.log(`   ⚠️  ATENÇÃO: Este banco também é usado por:`);
        duplicates.forEach(d => {
          console.log(`      - ${d.name} (${d.subdomain})`);
        });
      } else {
        console.log(`   ✅ Banco único - sem duplicatas`);
      }

      // Verificar se a URL está completa
      if (!db.databaseUrl.startsWith("mysql://")) {
        console.log(`   ⚠️  URL do banco está incompleta`);
      } else {
        console.log(`   ✅ URL completa`);
      }

      // Tentar conectar e verificar dados
      try {
        const tenantDb = new PrismaClient({
          datasources: {
            db: {
              url: db.databaseUrl,
            },
          },
        });

        const barbersCount = await tenantDb.barber.count();
        const servicesCount = await tenantDb.barberShopService.count();
        const bookingsCount = await tenantDb.booking.count();
        const usersCount = await tenantDb.user.count();

        console.log(`   📈 Dados no banco:`);
        console.log(`      - Barbeiros: ${barbersCount}`);
        console.log(`      - Serviços: ${servicesCount}`);
        console.log(`      - Agendamentos: ${bookingsCount}`);
        console.log(`      - Usuários: ${usersCount}`);

        await tenantDb.$disconnect();
      } catch (error) {
        console.log(`   ❌ Erro ao conectar ao banco: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("\n📋 Resumo:");

    // Verificar duplicatas de nomes de banco
    const databaseNames = databases.map(d => d.databaseName);
    const uniqueNames = [...new Set(databaseNames)];

    if (databaseNames.length === uniqueNames.length) {
      console.log("✅ Todos os tenants têm bancos de dados únicos");
    } else {
      console.log("⚠️  ATENÇÃO: Há tenants compartilhando bancos de dados!");
      const duplicates = databaseNames.filter(
        (name, index) => databaseNames.indexOf(name) !== index
      );
      console.log(
        `   Bancos duplicados: ${[...new Set(duplicates)].join(", ")}`
      );
    }

    // Verificar duplicatas de URLs
    const databaseUrls = databases.map(d => d.databaseUrl);
    const uniqueUrls = [...new Set(databaseUrls)];

    if (databaseUrls.length === uniqueUrls.length) {
      console.log("✅ Todas as URLs de banco são únicas");
    } else {
      console.log("⚠️  ATENÇÃO: Há tenants com URLs de banco duplicadas!");
    }

    console.log(`\n✅ Total de tenants: ${tenants.length}`);
    console.log(`✅ Total de bancos únicos: ${uniqueNames.length}`);
  } catch (error) {
    console.error("❌ Erro ao comparar bancos:", error);
  } finally {
    await prismaSuper.$disconnect();
  }
}

compareTenantDatabases();
