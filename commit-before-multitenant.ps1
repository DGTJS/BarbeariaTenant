# Script para fazer commit do sistema antes do multi-tenant

Write-Host "📦 Preparando commit do sistema antes do multi-tenant..." -ForegroundColor Cyan
Write-Host ""

# Adicionar todos os arquivos
Write-Host "➕ Adicionando todos os arquivos..." -ForegroundColor Yellow
git add -A

# Remover arquivos do multi-tenant
Write-Host ""
Write-Host "🚫 Removendo arquivos do multi-tenant do staging..." -ForegroundColor Yellow

$multiTenantFiles = @(
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
    "generated/prisma-super"
)

foreach ($file in $multiTenantFiles) {
    git reset HEAD $file 2>$null
}

# Verificar status
Write-Host ""
Write-Host "📊 Status do staging:" -ForegroundColor Cyan
git status --short

# Fazer commit
Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow

$commitMessage = @"
feat: sistema completo antes da implementação multi-tenant

- Todas as funcionalidades de barbearia funcionando
- Remoção de duração e preço dos serviços (agora apenas nas opções)
- Sistema de agendamentos completo
- Painel administrativo completo
- Landing page implementada
- Sistema de temas e personalização
- Integração com Mercado Pago
"@

git commit -m $commitMessage

Write-Host ""
Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Arquivos do multi-tenant ficaram como não commitados." -ForegroundColor Yellow
Write-Host "   Você pode commitá-los depois em um commit separado." -ForegroundColor Yellow

