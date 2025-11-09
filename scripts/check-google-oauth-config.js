/**
 * Script para verificar a configuração do Google OAuth
 * Mostra o callback URL que deve ser configurado no Google Cloud Console
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando configuração do Google OAuth...\n");

// Verificar variáveis de ambiente
const envPath = path.join(process.cwd(), ".env");
const envLocalPath = path.join(process.cwd(), ".env.local");

let envContent = "";
if (fs.existsSync(envPath)) {
  envContent += fs.readFileSync(envPath, "utf8");
}
if (fs.existsSync(envLocalPath)) {
  envContent += "\n" + fs.readFileSync(envLocalPath, "utf8");
}

const hasClientId = envContent.includes("GOOGLE_CLIENT_ID=");
const hasClientSecret = envContent.includes("GOOGLE_CLIENT_SECRET=");
const hasNextAuthSecret = envContent.includes("NEXTAUTH_SECRET=");
const hasNextAuthUrl = envContent.includes("NEXTAUTH_URL=");

console.log("📋 Status das variáveis de ambiente:");
console.log(
  `   GOOGLE_CLIENT_ID: ${hasClientId ? "✅ Configurado" : "❌ Não configurado"}`
);
console.log(
  `   GOOGLE_CLIENT_SECRET: ${hasClientSecret ? "✅ Configurado" : "❌ Não configurado"}`
);
console.log(
  `   NEXTAUTH_SECRET: ${hasNextAuthSecret ? "✅ Configurado" : "❌ Não configurado"}`
);
console.log(
  `   NEXTAUTH_URL: ${hasNextAuthUrl ? "✅ Configurado" : "⚠️ Não configurado (usará URL do request)"}`
);

if (hasNextAuthUrl) {
  const nextAuthUrlMatch = envContent.match(/NEXTAUTH_URL=(.+)/);
  if (nextAuthUrlMatch) {
    const nextAuthUrl = nextAuthUrlMatch[1].trim().replace(/['"]/g, "");
    console.log(`\n   NEXTAUTH_URL encontrado: ${nextAuthUrl}`);
  }
}

console.log("\n🔗 URLs de Callback que devem estar no Google Cloud Console:\n");

// URLs padrão
const baseUrls = [
  "http://localhost:3000",
  "https://localhost:3000", // Se usar HTTPS
];

// Verificar se há NEXTAUTH_URL configurado
if (hasNextAuthUrl) {
  const nextAuthUrlMatch = envContent.match(/NEXTAUTH_URL=(.+)/);
  if (nextAuthUrlMatch) {
    const nextAuthUrl = nextAuthUrlMatch[1].trim().replace(/['"]/g, "");
    if (!baseUrls.includes(nextAuthUrl)) {
      baseUrls.unshift(nextAuthUrl);
    }
  }
}

baseUrls.forEach((baseUrl, index) => {
  const callbackUrl = `${baseUrl}/api/auth/callback/google`;
  console.log(`   ${index + 1}. ${callbackUrl}`);
});

console.log("\n📝 Instruções para configurar no Google Cloud Console:\n");
console.log("   1. Acesse: https://console.cloud.google.com/apis/credentials");
console.log("   2. Selecione seu projeto");
console.log("   3. Clique no OAuth 2.0 Client ID");
console.log("   4. Em 'Authorized redirect URIs', adicione as URLs acima");
console.log("   5. Clique em 'Save'");
console.log("\n⚠️  IMPORTANTE:");
console.log(
  "   - As URLs devem corresponder EXATAMENTE (incluindo http/https e porta)"
);
console.log("   - Se usar subdomínios, adicione também:");
console.log("     http://santos.localhost:3000/api/auth/callback/google");
console.log("     http://teste.localhost:3000/api/auth/callback/google");
console.log("     (adicione para cada subdomínio que você usa)");

if (!hasClientId || !hasClientSecret) {
  console.log("\n❌ ERRO: Variáveis de ambiente não configuradas!");
  console.log("   Adicione ao arquivo .env ou .env.local:");
  console.log("   GOOGLE_CLIENT_ID=seu_client_id_aqui");
  console.log("   GOOGLE_CLIENT_SECRET=seu_client_secret_aqui");
  process.exit(1);
}

if (!hasNextAuthSecret) {
  console.log("\n⚠️  AVISO: NEXTAUTH_SECRET não configurado!");
  console.log("   Adicione ao arquivo .env ou .env.local:");
  console.log("   NEXTAUTH_SECRET=seu_secret_aqui");
  console.log("   (Gere um secret seguro com: openssl rand -base64 32)");
}

console.log("\n✅ Verificação concluída!\n");

