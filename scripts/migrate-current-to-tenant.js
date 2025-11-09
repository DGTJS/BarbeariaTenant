/**
 * Script para migrar o sistema atual para ser o primeiro tenant
 * Este script:
 * 1. Cria um tenant no banco principal
 * 2. Cria um novo banco de dados para o tenant
 * 3. Copia todos os dados do banco atual para o novo banco
 */

const { PrismaClient } = require("@prisma/client");
const { PrismaClient: PrismaSuperClient } = require("@prisma/client");
const mysql = require("mysql2/promise");
const { createTenantDatabase } = require("./create-tenant-database");

async function migrateCurrentToTenant() {
  const prisma = new PrismaClient();
  const prismaSuper = new PrismaSuperClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_SUPER,
      },
    },
  });

  try {
    console.log(
      "🚀 Iniciando migração do sistema atual para primeiro tenant..."
    );

    // 1. Criar tenant no banco principal
    console.log("📝 Criando tenant no banco principal...");

    // Buscar primeiro plano (ou criar um padrão)
    let plan = await prismaSuper.plan.findFirst();

    if (!plan) {
      console.log("📦 Criando plano padrão...");
      plan = await prismaSuper.plan.create({
        data: {
          name: "Starter",
          price: 97,
          period: "monthly",
          description: "Plano inicial",
          maxBarbers: 3,
          maxServices: 10,
          maxServiceOptions: 5,
          maxBookingsPerMonth: 0, // ilimitado
          maxBarberShops: 1,
          maxStorageMB: 100,
          trialDays: 14,
          requiresCard: true,
        },
      });
    }

    // Buscar configurações atuais (nome da barbearia, etc)
    const siteConfig = await prisma.siteConfig.findMany();
    const barberShopName =
      siteConfig.find(c => c.key === "barbershop_name")?.value ||
      "Barbearia Principal";

    // Criar tenant
    const subdomain = "original"; // ou gerar baseado no nome
    const databaseName = `barberboss_${subdomain}_${Date.now()}`;
    const databaseUrl = process.env.DATABASE_URL.replace(
      /\/[^\/]+(\?|$)/,
      `/${databaseName}$1`
    );

    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);

    const tenant = await prismaSuper.tenant.create({
      data: {
        name: barberShopName,
        subdomain,
        ownerName: "Admin",
        ownerEmail: "admin@barberboss.com",
        databaseName,
        databaseUrl,
        planId: plan.id,
        status: "trial",
        trialStartDate,
        trialEndDate,
        trialUsed: true,
        isActive: true,
      },
    });

    console.log(`✅ Tenant criado: ${tenant.id}`);

    // 2. Criar banco de dados para o tenant
    console.log("📦 Criando banco de dados do tenant...");
    await createTenantDatabase(databaseName, databaseUrl);

    // 3. Conectar ao novo banco e copiar dados
    console.log("📋 Copiando dados do banco atual...");

    const tenantPrisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // Lista de tabelas para copiar (ajustar conforme necessário)
    const tables = [
      "User",
      "BarberShop",
      "BarberCategory",
      "BarberShopService",
      "ServiceOption",
      "barber",
      "BarberWorkingHour",
      "Pause",
      "booking",
      "ServiceOptionBooking",
      "BarberService",
      "ScheduleException",
      "AppointmentHold",
      "Banner",
      "SiteConfig",
      "ColorConfig",
      "Theme",
      "FavoriteBarber",
      "NotificationTemplate",
      "Notification",
      "PushSubscription",
    ];

    // TODO: Implementar lógica de cópia de dados
    // Por enquanto, apenas criar o banco e estrutura
    console.log(
      "✅ Banco de dados criado. Dados serão migrados manualmente ou via script SQL."
    );

    await tenantPrisma.$disconnect();

    // 4. Criar assinatura inicial
    await prismaSuper.subscription.create({
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

    console.log("✅ Assinatura inicial criada");
    console.log(`🎉 Migração concluída! Tenant ID: ${tenant.id}`);
    console.log(`📊 Subdomínio: ${tenant.subdomain}.barberboss.com`);
    console.log(`💾 Banco de dados: ${databaseName}`);

    return tenant;
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await prismaSuper.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  migrateCurrentToTenant()
    .then(() => {
      console.log("✅ Processo concluído");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Erro:", error);
      process.exit(1);
    });
}

module.exports = { migrateCurrentToTenant };
