/**
 * Script para criar um plano de teste e um tenant de teste
 */

// Tentar carregar dotenv se disponível
try {
  require("dotenv").config({ path: ".env.local" });
  require("dotenv").config();
} catch (e) {
  // dotenv não está instalado, continuar sem ele
  // As variáveis devem estar no ambiente do sistema
}

// Verificar se DATABASE_URL_SUPER está definido
if (!process.env.DATABASE_URL_SUPER) {
  console.error("❌ Erro: DATABASE_URL_SUPER não está definido no .env");
  console.error(
    "   Adicione: DATABASE_URL_SUPER='mysql://user:password@localhost:3306/barberboss_super'"
  );
  process.exit(1);
}

// Usar o cliente Prisma gerado do schema-super
// O cliente é gerado em generated/prisma-super
let PrismaSuperClient;
try {
  // Tentar usar o cliente gerado do schema-super
  const prismaSuperModule = require("../generated/prisma-super");
  PrismaSuperClient = prismaSuperModule.PrismaClient;
} catch (e) {
  console.error("❌ Erro: Cliente Prisma do schema-super não encontrado");
  console.error("   Execute: npm run prisma:generate");
  console.error("   Erro detalhado:", e.message);
  process.exit(1);
}

// Cliente Prisma para o banco super
const prismaSuper = new PrismaSuperClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

async function createTestPlanAndTenant() {
  try {
    console.log("🚀 Criando plano e tenant de teste...\n");

    // 1. Criar ou buscar plano Starter
    console.log("📦 Criando plano Starter...");
    let plan = await prismaSuper.plan.findFirst({
      where: { name: "Starter" },
    });

    if (!plan) {
      plan = await prismaSuper.plan.create({
        data: {
          name: "Starter",
          price: 97.0,
          period: "monthly",
          description: "Plano inicial para pequenas barbearias",
          status: true,
          maxBarbers: 3,
          maxServices: 10,
          maxServiceOptions: 5,
          maxBookingsPerMonth: 0, // Ilimitado
          maxBarberShops: 1,
          maxStorageMB: 100,
          hasAnalytics: false,
          hasNotifications: true,
          hasCustomDomain: false,
          hasWhiteLabel: false,
          hasAPI: false,
          hasPrioritySupport: false,
          trialDays: 14,
          requiresCard: true,
        },
      });
      console.log(`✅ Plano criado: ${plan.name} (ID: ${plan.id})`);
    } else {
      console.log(`✅ Plano já existe: ${plan.name} (ID: ${plan.id})`);
    }

    // 2. Verificar se já existe um tenant de teste
    console.log("\n🏢 Verificando tenant de teste...");
    const existingTenant = await prismaSuper.tenant.findFirst({
      where: { subdomain: "teste" },
    });

    if (existingTenant) {
      console.log(`⚠️  Tenant de teste já existe: ${existingTenant.name}`);
      console.log(`   ID: ${existingTenant.id}`);
      console.log(`   Subdomínio: ${existingTenant.subdomain}.barberboss.com`);
      console.log(`   Status: ${existingTenant.status}`);
      console.log(`   Plano: ${existingTenant.planId || "Nenhum"}`);

      // Perguntar se quer atualizar
      console.log(
        "\n💡 Se quiser recriar, delete o tenant existente primeiro."
      );
      return;
    }

    // 3. Criar tenant de teste
    console.log("\n🏢 Criando tenant de teste...");

    // Gerar nome do banco e URL
    const databaseName = `barberboss_teste_${Date.now()}`;

    // Tentar obter a URL base do banco
    let baseUrl = process.env.DATABASE_BASE_URL;
    if (!baseUrl) {
      // Extrair a URL base do DATABASE_URL_SUPER
      const superUrl = process.env.DATABASE_URL_SUPER;
      if (superUrl) {
        const url = new URL(superUrl.replace(/^mysql:\/\//, "http://"));
        baseUrl = `mysql://${url.username}:${url.password}@${url.hostname}:${url.port || 3306}/`;
      } else {
        baseUrl =
          process.env.DATABASE_URL?.replace(/\/[^\/]+(\?|$)/, "/") || "";
      }
    }

    const databaseUrl = `${baseUrl}${databaseName}`;

    // Calcular datas do trial
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);

    const tenant = await prismaSuper.tenant.create({
      data: {
        name: "Barbearia Teste",
        subdomain: "teste",
        ownerName: "João Silva",
        ownerEmail: "joao@teste.com",
        ownerPhone: "(11) 99999-9999",
        databaseName,
        databaseUrl,
        planId: plan.id,
        status: "trial",
        isActive: true,
        trialStartDate,
        trialEndDate,
        trialUsed: true,
      },
      include: {
        plan: true,
      },
    });

    console.log(`✅ Tenant criado: ${tenant.name}`);
    console.log(`   ID: ${tenant.id}`);
    console.log(`   Subdomínio: ${tenant.subdomain}.barberboss.com`);
    console.log(`   Status: ${tenant.status}`);
    console.log(`   Plano: ${tenant.plan.name}`);
    console.log(`   Trial até: ${trialEndDate.toLocaleDateString("pt-BR")}`);

    // 4. Criar assinatura inicial
    console.log("\n💳 Criando assinatura inicial...");
    const subscription = await prismaSuper.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: plan.id,
        status: "trial",
        isActive: true,
        startDate: trialStartDate,
        endDate: trialEndDate,
        autoRenew: true,
        nextBillingDate: trialEndDate,
        amount: plan.price,
      },
    });

    console.log(`✅ Assinatura criada: ${subscription.id}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(
      `   Próxima cobrança: ${trialEndDate.toLocaleDateString("pt-BR")}`
    );

    console.log("\n🎉 Plano e tenant de teste criados com sucesso!");
    console.log("\n📝 Próximos passos:");
    console.log(
      `   1. Acesse o Super Admin: http://localhost:3000/super-admin`
    );
    console.log(`   2. Crie o banco de dados do tenant: ${databaseName}`);
    console.log(`   3. Execute as migrations no banco do tenant`);
    console.log(`   4. Acesse o tenant: http://teste.localhost:3000`);
  } catch (error) {
    console.error("❌ Erro ao criar plano e tenant:", error);
    throw error;
  } finally {
    await prismaSuper.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createTestPlanAndTenant()
    .then(() => {
      console.log("\n✅ Processo concluído");
      process.exit(0);
    })
    .catch(error => {
      console.error("\n❌ Erro:", error);
      process.exit(1);
    });
}

module.exports = { createTestPlanAndTenant };
