/**
 * Script para fazer commit do sistema antes das mudanças multi-tenant
 */

const { execSync } = require("child_process");

// Arquivos do multi-tenant que devem ser excluídos do commit
const multiTenantFiles = [
  "prisma/schema-super.prisma",
  "src/app/super-admin",
  "src/app/signup",
  "src/_lib/prisma-super.ts",
  "src/_lib/tenant-db.ts",
  "src/_lib/get-tenant-from-request.ts",
  "src/_lib/asaas.ts",
  "src/_lib/plan-limits.ts",
  "src/app/api/super-admin",
  "src/app/api/asaas",
  "scripts/create-tenant-database.js",
  "scripts/migrate-current-to-tenant.js",
  "scripts/check-expirations.js",
  "MULTI_TENANT_IMPLEMENTATION.md",
  "IMPLEMENTACAO_MULTI_TENANT.md",
  "RESUMO_FINAL_MULTI_TENANT.md",
  "SETUP_MULTI_TENANT.md",
  "SETUP_BANCO_SUPER.md",
  "README_MULTI_TENANT.md",
  "generated/prisma-super",
];

try {
  console.log("📦 Preparando commit do sistema antes do multi-tenant...\n");

  // Adicionar todos os arquivos
  console.log("➕ Adicionando todos os arquivos...");
  execSync("git add -A", { stdio: "inherit" });

  // Remover arquivos do multi-tenant do staging
  console.log("\n🚫 Removendo arquivos do multi-tenant do staging...");
  for (const file of multiTenantFiles) {
    try {
      execSync(`git reset HEAD "${file}"`, { stdio: "pipe" });
    } catch (e) {
      // Arquivo pode não existir no staging, ignorar
    }
  }

  // Verificar status
  console.log("\n📊 Verificando arquivos no staging...");
  const status = execSync("git status --short", { encoding: "utf8" });
  console.log(status);

  // Fazer commit
  console.log("\n💾 Fazendo commit...");
  const commitMessage = `feat: sistema completo antes da implementação multi-tenant

- Todas as funcionalidades de barbearia funcionando
- Remoção de duração e preço dos serviços (agora apenas nas opções)
- Sistema de agendamentos completo
- Painel administrativo completo
- Landing page implementada
- Sistema de temas e personalização
- Integração com Mercado Pago`;

  execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

  console.log("\n✅ Commit realizado com sucesso!");
  console.log("\n📝 Arquivos do multi-tenant ficaram como não commitados.");
  console.log("   Você pode commitá-los depois em um commit separado.");
} catch (error) {
  console.error("❌ Erro ao fazer commit:", error.message);
  process.exit(1);
}
