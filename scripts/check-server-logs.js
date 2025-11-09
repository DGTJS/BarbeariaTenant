#!/usr/bin/env node

/**
 * Script para verificar se os logs do servidor estão aparecendo
 * e ajudar a diagnosticar o problema
 */

console.log("\n" + "=".repeat(100));
console.log("📋 CHECKLIST DE DIAGNÓSTICO");
console.log("=".repeat(100));

console.log("\n1️⃣  VERIFIQUE SE O SERVIDOR ESTÁ RODANDO:");
console.log("   Execute: npm run dev");
console.log("   O servidor deve estar rodando em http://localhost:3000");

console.log("\n2️⃣  VERIFIQUE OS LOGS DO SERVIDOR:");
console.log("   Quando você fizer login, procure por estas mensagens:");
console.log("   ✅ [NextAuth POST] ========== INICIANDO POST ==========");
console.log("   ✅ [NextAuth POST] Body (text raw):");
console.log("   ✅ [NextAuth POST] Body (form data):");
console.log("   ✅ [NextAuth Authorize] ========== INICIANDO ==========");
console.log("   ✅ [NextAuth JWT] ========== JWT CALLBACK ==========");
console.log("   ✅ [NextAuth Session] ========== SESSION CALLBACK ==========");

console.log("\n3️⃣  SE OS LOGS NÃO APARECEREM:");
console.log("   - O NextAuth pode não estar recebendo o request");
console.log("   - Verifique se o handler está sendo chamado");
console.log("   - Verifique se o body está sendo passado corretamente");

console.log("\n4️⃣  SE [NextAuth POST] APARECER MAS [NextAuth Authorize] NÃO:");
console.log("   - O NextAuth não está processando o body corretamente");
console.log("   - O body pode não estar no formato esperado");
console.log(
  "   - O NextAuth pode não estar reconhecendo o callback de credentials"
);

console.log("\n5️⃣  SE [NextAuth Authorize] APARECER MAS RETORNAR NULL:");
console.log("   - Verifique se o usuário existe no banco de dados");
console.log("   - Verifique se as credenciais estão corretas");
console.log(
  "   - Verifique se o banco de dados correto está sendo usado (tenant vs default)"
);

console.log("\n6️⃣  TESTE AGORA:");
console.log("   1. Execute o servidor: npm run dev");
console.log("   2. Execute o teste: node scripts/test-auth-complete.js");
console.log("   3. Ou faça login manualmente pela interface");
console.log("   4. Copie TODOS os logs do servidor e envie");

console.log("\n" + "=".repeat(100));
console.log("📝 PRÓXIMOS PASSOS:");
console.log("=".repeat(100));
console.log("1. Execute o servidor em um terminal");
console.log("2. Execute o teste em outro terminal");
console.log("3. Copie TODOS os logs do servidor que começam com [NextAuth]");
console.log("4. Envie os logs para análise");
console.log("=".repeat(100) + "\n");


