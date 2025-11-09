/**
 * Script completo para criar um tenant funcional
 * Cria: banco de dados, executa migrations, cria usuário admin
 */

// Tentar carregar dotenv se disponível
try {
  require("dotenv").config({ path: ".env.local" });
  require("dotenv").config();
} catch (e) {
  // dotenv não está instalado, continuar sem ele
}

const mysql = require("mysql2/promise");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

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

// Cliente Prisma para o banco super
const prismaSuper = new PrismaSuperClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

// Cliente Prisma para o banco do tenant (será criado)
let PrismaTenantClient;
try {
  const { PrismaClient } = require("@prisma/client");
  PrismaTenantClient = PrismaClient;
} catch (e) {
  console.error("❌ Erro: Cliente Prisma não encontrado");
  process.exit(1);
}

async function createTenantDatabase(databaseName, databaseUrl) {
  try {
    // Extrair dados da URL de conexão
    const urlObj = new URL(databaseUrl.replace(/^mysql:\/\//, "http://"));
    const host = urlObj.hostname;
    const port = urlObj.port || 3306;
    const user = urlObj.username;
    const password = urlObj.password;

    console.log(`📦 Criando banco de dados: ${databaseName}`);

    // Conectar ao MySQL (sem especificar database)
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
    });

    // Criar banco de dados
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Banco de dados criado: ${databaseName}`);
    await connection.end();

    // Executar migrations do Prisma no novo banco
    console.log(`🔄 Executando migrations...`);

    // Criar arquivo .env temporário para o tenant
    const tempEnvPath = path.join(process.cwd(), ".env.tenant.temp");
    fs.writeFileSync(tempEnvPath, `DATABASE_URL="${databaseUrl}"`);

    try {
      // Usar db push para criar o schema diretamente (mais confiável para banco novo)
      const isWindows = process.platform === "win32";
      const envCmd = isWindows
        ? `set DATABASE_URL=${databaseUrl} && npx prisma db push --schema=prisma/schema.prisma --accept-data-loss`
        : `DATABASE_URL="${databaseUrl}" npx prisma db push --schema=prisma/schema.prisma --accept-data-loss`;

      const { stdout, stderr } = await execAsync(envCmd, {
        cwd: process.cwd(),
        shell: true,
        env: { ...process.env, DATABASE_URL: databaseUrl },
      });

      if (
        stderr &&
        !stderr.includes("warning") &&
        !stderr.includes("Already in sync")
      ) {
        console.warn("⚠️ Avisos nas migrations:", stderr);
      }
    } finally {
      // Remover arquivo temporário
      try {
        if (fs.existsSync(tempEnvPath)) {
          fs.unlinkSync(tempEnvPath);
        }
      } catch (e) {
        // Ignorar erro de remoção
      }
    }

    console.log(`✅ Migrations executadas com sucesso`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao criar banco de dados:", error.message);
    throw error;
  }
}

async function createAdminUser(tenantDb, adminEmail, adminPassword) {
  try {
    console.log(`👤 Criando usuário admin no tenant...`);

    // Verificar se já existe
    const existing = await tenantDb.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      console.log(`✅ Usuário admin já existe: ${adminEmail}`);
      return existing;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Criar usuário admin
    const admin = await tenantDb.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        password: hashedPassword,
        role: 1, // Admin
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Usuário admin criado no tenant: ${adminEmail}`);
    return admin;
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin no tenant:", error.message);
    throw error;
  }
}

async function createFullTenant() {
  try {
    console.log("🚀 Criando tenant completo e funcional...\n");

    // 1. Buscar ou criar plano
    console.log("📦 Verificando plano...");
    let plan = await prismaSuper.plan.findFirst({
      where: { name: "Starter" },
    });

    if (!plan) {
      console.log("📦 Criando plano Starter...");
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
          maxBookingsPerMonth: 0,
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
      console.log(`✅ Plano criado: ${plan.name}`);
    } else {
      console.log(`✅ Plano encontrado: ${plan.name}`);
    }

    // 2. Verificar se já existe tenant de teste
    console.log("\n🏢 Verificando tenant...");
    let tenant = await prismaSuper.tenant.findFirst({
      where: { subdomain: "teste" },
    });

    if (tenant) {
      console.log(`⚠️  Tenant já existe: ${tenant.name}`);
      console.log(`   Usando tenant existente...`);
    } else {
      // 3. Criar tenant no banco principal
      console.log("\n🏢 Criando tenant no banco principal...");

      const databaseName = `barberboss_teste_${Date.now()}`;
      let baseUrl = process.env.DATABASE_BASE_URL;
      if (!baseUrl) {
        const superUrl = process.env.DATABASE_URL_SUPER;
        if (superUrl) {
          const urlObj = new URL(superUrl.replace(/^mysql:\/\//, "http://"));
          baseUrl = `mysql://${urlObj.username}:${urlObj.password}@${urlObj.hostname}:${urlObj.port || 3306}/`;
        }
      }
      const databaseUrl = `${baseUrl}${databaseName}`;

      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);

      tenant = await prismaSuper.tenant.create({
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
    }

    // 4. Criar banco de dados do tenant
    console.log(`\n💾 Criando banco de dados do tenant...`);
    await createTenantDatabase(tenant.databaseName, tenant.databaseUrl);

    // 5. Conectar ao banco do tenant e criar admin + configurações
    console.log(`\n⚙️  Configurando banco do tenant...`);
    const tenantDb = new PrismaTenantClient({
      datasources: {
        db: {
          url: tenant.databaseUrl,
        },
      },
    });

    // Criar usuário admin no tenant
    const adminEmail = `${tenant.subdomain}@admin.com`;
    const adminPassword = "admin123";
    await createAdminUser(tenantDb, adminEmail, adminPassword);

    // Criar configuração básica
    console.log(`⚙️  Criando configurações básicas...`);
    try {
      await tenantDb.siteConfig.createMany({
        data: [
          { key: "barbershop_name", value: tenant.name },
          {
            key: "barbershop_description",
            value: "Sistema de agendamento completo",
          },
        ],
        skipDuplicates: true,
      });
      console.log(`✅ Configurações criadas`);
    } catch (e) {
      console.log(`⚠️  Configurações já existem ou erro: ${e.message}`);
    }

    // Criar temas padrão
    console.log(`\n🎨 Criando temas padrão...`);
    try {
      const { seedDefaultThemes } = require("./seed-default-themes");
      await seedDefaultThemes(tenantDb);
    } catch (e) {
      console.log(`⚠️  Erro ao criar temas padrão: ${e.message}`);
    }

    await tenantDb.$disconnect();

    // 6. Criar assinatura se não existir
    console.log(`\n💳 Verificando assinatura...`);
    let subscription = await prismaSuper.subscription.findFirst({
      where: { tenantId: tenant.id },
    });

    if (!subscription) {
      const trialStartDate = tenant.trialStartDate || new Date();
      const trialEndDate = tenant.trialEndDate || new Date();
      trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);

      subscription = await prismaSuper.subscription.create({
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
      console.log(`✅ Assinatura criada`);
    } else {
      console.log(`✅ Assinatura já existe`);
    }

    console.log("\n🎉 Tenant completo criado com sucesso!");
    console.log("\n📋 Informações de Acesso:");
    console.log(`   Subdomínio: ${tenant.subdomain}.barberboss.com`);
    console.log(`   URL Local: http://${tenant.subdomain}.localhost:3000`);
    console.log(`   Banco de Dados: ${tenant.databaseName}`);
    console.log("\n🔗 Links:");
    console.log(`   Super Admin: http://localhost:3000/super-admin`);
    console.log(
      `   Super Admin Login: http://localhost:3000/super-admin/login`
    );
    console.log(
      `   Tenant Admin: http://${tenant.subdomain}.localhost:3000/admin`
    );
    console.log(`   Tenant Home: http://${tenant.subdomain}.localhost:3000`);
    console.log("\n👤 Credenciais do Admin do Tenant:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Senha: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Erro ao criar tenant completo:", error);
    throw error;
  } finally {
    await prismaSuper.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createFullTenant()
    .then(() => {
      console.log("\n✅ Processo concluído");
      process.exit(0);
    })
    .catch(error => {
      console.error("\n❌ Erro:", error);
      process.exit(1);
    });
}

module.exports = { createFullTenant };
