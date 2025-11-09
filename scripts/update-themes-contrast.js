/**
 * Script para atualizar temas existentes com melhor contraste
 * Atualiza apenas os 6 novos temas (3 pretos e 3 brancos)
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

const prismaSuper = new PrismaSuperClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

// Temas atualizados com melhor contraste
const updatedThemes = {
  "Preto Profundo": {
    "primary-main": "#ffffff",
    "primary-light": "#f5f5f5",
    "primary-dark": "#e5e5e5",
    "secondary-main": "#e5e5e5",
    "secondary-light": "#f5f5f5",
    "secondary-dark": "#d4d4d4",
    "background-main": "#000000",
    "background-secondary": "#0f0f0f",
    "background-tertiary": "#1a1a1a",
    "card-main": "#1a1a1a",
    "card-secondary": "#262626",
    "card-border": "#404040",
    "text-primary": "#ffffff",
    "text-secondary": "#e5e5e5",
    "text-muted": "#b3b3b3",
    "border-main": "#2a2a2a",
    "border-secondary": "#404040",
    "accent-main": "#ffffff",
    "accent-light": "#f5f5f5",
    "accent-dark": "#e5e5e5",
    "success-main": "#10b981",
    "warning-main": "#f59e0b",
    "error-main": "#ef4444",
    "info-main": "#3b82f6",
  },
  "Preto Moderno": {
    "primary-main": "#3b82f6",
    "primary-light": "#60a5fa",
    "primary-dark": "#2563eb",
    "secondary-main": "#8b5cf6",
    "secondary-light": "#a78bfa",
    "secondary-dark": "#7c3aed",
    "background-main": "#000000",
    "background-secondary": "#0f0f0f",
    "background-tertiary": "#1a1a1a",
    "card-main": "#1a1a1a",
    "card-secondary": "#262626",
    "card-border": "#404040",
    "text-primary": "#ffffff",
    "text-secondary": "#e5e7eb",
    "text-muted": "#b3b3b3",
    "border-main": "#2a2a2a",
    "border-secondary": "#404040",
    "accent-main": "#3b82f6",
    "accent-light": "#60a5fa",
    "accent-dark": "#2563eb",
    "success-main": "#10b981",
    "warning-main": "#f59e0b",
    "error-main": "#ef4444",
    "info-main": "#3b82f6",
  },
  "Preto Clássico": {
    "primary-main": "#fbbf24",
    "primary-light": "#fcd34d",
    "primary-dark": "#f59e0b",
    "secondary-main": "#fcd34d",
    "secondary-light": "#fde68a",
    "secondary-dark": "#f59e0b",
    "background-main": "#000000",
    "background-secondary": "#0f0f0f",
    "background-tertiary": "#1a1a1a",
    "card-main": "#1a1a1a",
    "card-secondary": "#262626",
    "card-border": "#404040",
    "text-primary": "#ffffff",
    "text-secondary": "#fcd34d",
    "text-muted": "#fbbf24",
    "border-main": "#2a2a2a",
    "border-secondary": "#404040",
    "accent-main": "#fbbf24",
    "accent-light": "#fcd34d",
    "accent-dark": "#f59e0b",
    "success-main": "#10b981",
    "warning-main": "#f59e0b",
    "error-main": "#ef4444",
    "info-main": "#3b82f6",
  },
  "Branco Puro": {
    "primary-main": "#000000",
    "primary-light": "#1a1a1a",
    "primary-dark": "#000000",
    "secondary-main": "#262626",
    "secondary-light": "#404040",
    "secondary-dark": "#1a1a1a",
    "background-main": "#ffffff",
    "background-secondary": "#f9fafb",
    "background-tertiary": "#f3f4f6",
    "card-main": "#ffffff",
    "card-secondary": "#f9fafb",
    "card-border": "#d1d5db",
    "text-primary": "#000000",
    "text-secondary": "#1f2937",
    "text-muted": "#4b5563",
    "border-main": "#d1d5db",
    "border-secondary": "#9ca3af",
    "accent-main": "#000000",
    "accent-light": "#1a1a1a",
    "accent-dark": "#000000",
    "success-main": "#10b981",
    "warning-main": "#f59e0b",
    "error-main": "#ef4444",
    "info-main": "#3b82f6",
  },
  "Branco Elegante": {
    "primary-main": "#1f2937",
    "primary-light": "#374151",
    "primary-dark": "#111827",
    "secondary-main": "#374151",
    "secondary-light": "#4b5563",
    "secondary-dark": "#1f2937",
    "background-main": "#ffffff",
    "background-secondary": "#fafafa",
    "background-tertiary": "#f5f5f5",
    "card-main": "#ffffff",
    "card-secondary": "#fafafa",
    "card-border": "#d1d5db",
    "text-primary": "#111827",
    "text-secondary": "#1f2937",
    "text-muted": "#4b5563",
    "border-main": "#d1d5db",
    "border-secondary": "#9ca3af",
    "accent-main": "#1f2937",
    "accent-light": "#374151",
    "accent-dark": "#111827",
    "success-main": "#10b981",
    "warning-main": "#f59e0b",
    "error-main": "#ef4444",
    "info-main": "#3b82f6",
  },
  "Branco Clássico": {
    "primary-main": "#7f00e6",
    "primary-light": "#9333ea",
    "primary-dark": "#6b21a8",
    "secondary-main": "#6b21a8",
    "secondary-light": "#9333ea",
    "secondary-dark": "#581c87",
    "background-main": "#ffffff",
    "background-secondary": "#f8f9fa",
    "background-tertiary": "#f1f3f5",
    "card-main": "#ffffff",
    "card-secondary": "#f8f9fa",
    "card-border": "#d1d5db",
    "text-primary": "#111827",
    "text-secondary": "#1f2937",
    "text-muted": "#4b5563",
    "border-main": "#d1d5db",
    "border-secondary": "#9ca3af",
    "accent-main": "#7f00e6",
    "accent-light": "#9333ea",
    "accent-dark": "#6b21a8",
    "success-main": "#10b981",
    "warning-main": "#f59e0b",
    "error-main": "#ef4444",
    "info-main": "#3b82f6",
  },
};

async function updateThemesContrast() {
  try {
    console.log("🚀 Atualizando temas com melhor contraste...\n");

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

    let totalUpdated = 0;
    let totalErrors = 0;

    for (const tenant of tenants) {
      try {
        console.log(`\n🏢 Processando tenant: ${tenant.name} (${tenant.subdomain})`);

        // Verificar se a URL está completa
        if (!tenant.databaseUrl || !tenant.databaseUrl.startsWith("mysql://")) {
          console.log(`   ⚠️  URL do banco inválida, pulando...`);
          totalErrors++;
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

        // Atualizar cada tema
        let updatedCount = 0;
        for (const [themeName, themeColors] of Object.entries(updatedThemes)) {
          try {
            const existing = await tenantDb.theme.findFirst({
              where: { name: themeName },
            });

            if (existing) {
              await tenantDb.theme.update({
                where: { id: existing.id },
                data: {
                  colors: themeColors,
                },
              });
              console.log(`   ✅ Tema "${themeName}" atualizado`);
              updatedCount++;
            } else {
              console.log(`   ⏭️  Tema "${themeName}" não encontrado, pulando...`);
            }
          } catch (error) {
            console.error(`   ❌ Erro ao atualizar tema "${themeName}":`, error.message);
          }
        }

        // Desconectar
        await tenantDb.$disconnect();

        if (updatedCount > 0) {
          totalUpdated += updatedCount;
          console.log(`   ✅ ${updatedCount} tema(s) atualizado(s)`);
        }
      } catch (error) {
        console.error(`   ❌ Erro ao processar tenant:`, error.message);
        totalErrors++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`\n✅ Processo concluído!`);
    console.log(`   ${totalUpdated} tema(s) atualizado(s) no total`);
    console.log(`   ${totalErrors} tenant(s) com erro`);
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
  updateThemesContrast()
    .then(() => {
      console.log("\n✅ Script finalizado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Erro:", error);
      process.exit(1);
    });
}

module.exports = { updateThemesContrast };

