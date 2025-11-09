/**
 * Script para verificar informações de um tenant
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

// Tentar importar do caminho correto
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

const prismaSuper = new PrismaSuperClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

async function checkTenant(subdomain) {
  try {
    console.log(`🔍 Verificando tenant com subdomain: "${subdomain}"\n`);

    const tenant = await prismaSuper.tenant.findUnique({
      where: { subdomain: subdomain.toLowerCase() },
      include: {
        plan: true,
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!tenant) {
      console.log(`❌ Tenant não encontrado com subdomain: "${subdomain}"`);
      console.log("\n📋 Tentando buscar todos os tenants...");
      const allTenants = await prismaSuper.tenant.findMany({
        select: {
          id: true,
          name: true,
          subdomain: true,
          status: true,
          isActive: true,
        },
      });
      console.log("\nTenants encontrados:");
      allTenants.forEach(t => {
        console.log(
          `  - ${t.name} (subdomain: ${t.subdomain}, status: ${t.status}, ativo: ${t.isActive})`
        );
      });
      return;
    }

    console.log("✅ Tenant encontrado!");
    console.log("\n📋 Informações do Tenant:");
    console.log(`   ID: ${tenant.id}`);
    console.log(`   Nome: ${tenant.name}`);
    console.log(`   Subdomínio: ${tenant.subdomain}`);
    console.log(`   Status: ${tenant.status}`);
    console.log(`   Ativo: ${tenant.isActive ? "Sim" : "Não"}`);
    console.log(`   Email: ${tenant.ownerEmail}`);
    console.log(`   Banco de Dados: ${tenant.databaseName}`);
    console.log(`   URL do Banco: ${tenant.databaseUrl}`);
    console.log(`   Plano: ${tenant.plan?.name || "N/A"}`);
    console.log(
      `   Trial até: ${tenant.trialEndDate ? new Date(tenant.trialEndDate).toLocaleDateString("pt-BR") : "N/A"}`
    );

    console.log("\n🔗 URLs de Acesso:");
    console.log(`   Local: http://${tenant.subdomain}.localhost:3000`);
    console.log(`   Produção: https://${tenant.subdomain}.barberboss.com`);
    if (tenant.customDomain) {
      console.log(`   Domínio Customizado: https://${tenant.customDomain}`);
    }

    console.log("\n⚠️  Verificações:");
    if (!tenant.isActive) {
      console.log("   ❌ Tenant está INATIVO - precisa ser ativado");
    } else {
      console.log("   ✅ Tenant está ativo");
    }

    if (tenant.status === "expired") {
      console.log("   ❌ Tenant está EXPIRADO");
    } else if (tenant.status === "suspended") {
      console.log("   ❌ Tenant está SUSPENSO");
    } else {
      console.log(`   ✅ Status: ${tenant.status}`);
    }

    if (!tenant.databaseUrl) {
      console.log("   ❌ URL do banco de dados não configurada");
    } else {
      console.log("   ✅ URL do banco configurada");
    }
  } catch (error) {
    console.error("❌ Erro ao verificar tenant:", error);
  } finally {
    await prismaSuper.$disconnect();
  }
}

const subdomain = process.argv[2] || "santos";
checkTenant(subdomain);
