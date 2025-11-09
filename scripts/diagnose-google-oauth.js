/**
 * Script de diagnóstico para problemas com Google OAuth
 * Verifica configuração e identifica possíveis problemas
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const http = require("http");
const https = require("https");
const { URL } = require("url");

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = client.request(requestOptions, res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", error => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function diagnoseGoogleOAuth() {
  console.log("\n🔍 Diagnóstico do Google OAuth\n");
  console.log("=".repeat(60));

  // 1. Verificar variáveis de ambiente
  console.log("\n1️⃣ Variáveis de Ambiente:");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  console.log(
    `   GOOGLE_CLIENT_ID: ${clientId ? "✅ " + clientId.substring(0, 20) + "..." : "❌ NÃO CONFIGURADO"}`
  );
  console.log(
    `   GOOGLE_CLIENT_SECRET: ${clientSecret ? "✅ Configurado (" + clientSecret.length + " chars)" : "❌ NÃO CONFIGURADO"}`
  );
  console.log(
    `   NEXTAUTH_SECRET: ${nextAuthSecret ? "✅ Configurado" : "❌ NÃO CONFIGURADO"}`
  );
  console.log(
    `   NEXTAUTH_URL: ${nextAuthUrl ? "✅ " + nextAuthUrl : "⚠️  NÃO DEFINIDO (será detectado automaticamente)"}`
  );

  if (!clientId || !clientSecret) {
    console.error("\n❌ Variáveis de ambiente não configuradas!");
    return;
  }

  // 2. Verificar URLs esperadas
  console.log("\n2️⃣ URLs de Callback:");
  const expectedUrls = [];
  
  if (nextAuthUrl) {
    expectedUrls.push(`${nextAuthUrl}/api/auth/callback/google`);
    console.log(`   ✅ NEXTAUTH_URL definido: ${nextAuthUrl}`);
    console.log(`   📍 Callback esperado: ${expectedUrls[0]}`);
  } else {
    expectedUrls.push(`http://localhost:3000/api/auth/callback/google`);
    console.log(`   ⚠️  NEXTAUTH_URL não definido`);
    console.log(`   📍 Callback padrão (dev): ${expectedUrls[0]}`);
  }

  // 3. Verificar se servidor está rodando
  console.log("\n3️⃣ Conectividade do Servidor:");
  const testUrl = nextAuthUrl || "http://localhost:3000";
  try {
    const healthCheck = await makeRequest(`${testUrl}/api/auth/csrf`);
    if (healthCheck.statusCode === 200) {
      console.log("   ✅ Servidor está rodando e respondendo");
    } else {
      console.error(`   ❌ Servidor retornou status ${healthCheck.statusCode}`);
    }
  } catch (error) {
    console.error(`   ❌ Erro ao conectar: ${error.message}`);
    console.error("   💡 Certifique-se de que o servidor está rodando (npm run dev)");
    return;
  }

  // 4. Verificar configuração do Google Provider
  console.log("\n4️⃣ Configuração do Google Provider:");
  try {
    const signinResponse = await makeRequest(`${testUrl}/api/auth/signin`);
    if (signinResponse.body.includes("google") || signinResponse.body.includes("Google")) {
      console.log("   ✅ Google Provider está disponível na página de signin");
    } else {
      console.warn("   ⚠️  Google Provider pode não estar configurado");
    }
  } catch (error) {
    console.error(`   ❌ Erro ao verificar provider: ${error.message}`);
  }

  // 5. Diagnóstico do problema
  console.log("\n5️⃣ Diagnóstico do Problema:");
  console.log("\n   📋 Checklist para resolver o erro 'error=google':");
  console.log("\n   ✅ 1. Verifique se a URL de callback está EXATAMENTE como abaixo:");
  expectedUrls.forEach((url, index) => {
    console.log(`      ${index + 1}. ${url}`);
  });
  
  console.log("\n   ✅ 2. No Google Cloud Console:");
  console.log("      - Acesse: https://console.cloud.google.com/apis/credentials");
  console.log("      - Selecione seu projeto");
  console.log("      - Clique no OAuth 2.0 Client ID");
  console.log("      - Em 'URIs de redirecionamento autorizados', verifique:");
  
  expectedUrls.forEach((url, index) => {
    console.log(`         • ${url}`);
  });
  
  console.log("\n   ✅ 3. Verifique se:");
  console.log("      - Não há trailing slash (/) no final");
  console.log("      - Está usando http:// (não https://) para localhost");
  console.log("      - A URL está EXATAMENTE como mostrado acima");
  
  if (nextAuthUrl && !nextAuthUrl.includes("localhost")) {
    console.log("\n   ⚠️  ATENÇÃO: NEXTAUTH_URL está definido e não é localhost");
    console.log("      Certifique-se de que esta URL está configurada no Google Cloud Console");
  }

  // 6. Testar callback URL
  console.log("\n6️⃣ Testando Callback URL:");
  try {
    const callbackUrl = expectedUrls[0];
    const callbackResponse = await makeRequest(`${callbackUrl}?error=test`);
    
    if (callbackResponse.statusCode === 302 || callbackResponse.statusCode === 200) {
      console.log(`   ✅ Callback URL está acessível (status: ${callbackResponse.statusCode})`);
      const location = callbackResponse.headers.location;
      if (location) {
        console.log(`   📍 Redirecionando para: ${location}`);
      }
    } else {
      console.error(`   ❌ Callback URL retornou status ${callbackResponse.statusCode}`);
    }
  } catch (error) {
    console.error(`   ❌ Erro ao testar callback URL: ${error.message}`);
  }

  // 7. Recomendações
  console.log("\n7️⃣ Recomendações:");
  console.log("\n   💡 Se o erro persistir:");
  console.log("      1. Verifique os logs do servidor quando tentar fazer login");
  console.log("      2. Procure por mensagens que começam com '[NextAuth GET] ⚠️ CALLBACK DO GOOGLE'");
  console.log("      3. Verifique se há 'error' ou 'error_description' nos query params");
  console.log("      4. Certifique-se de que salvou as mudanças no Google Cloud Console");
  console.log("      5. Aguarde 2-5 minutos após salvar no Google Console");
  
  if (!nextAuthUrl) {
    console.log("\n   💡 Dica: Considere definir NEXTAUTH_URL no .env:");
    console.log("      NEXTAUTH_URL=http://localhost:3000");
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Diagnóstico concluído!\n");
}

if (require.main === module) {
  diagnoseGoogleOAuth().catch(console.error);
}

module.exports = { diagnoseGoogleOAuth };

