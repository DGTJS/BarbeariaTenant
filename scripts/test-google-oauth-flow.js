/**
 * Script para testar o fluxo completo do Google OAuth
 * Verifica se a configuração está correta e simula o fluxo de autenticação
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

async function testGoogleOAuthFlow() {
  console.log("\n🔍 Testando fluxo do Google OAuth...\n");

  // 1. Verificar variáveis de ambiente
  console.log("1️⃣ Verificando variáveis de ambiente:");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  console.log(
    `   GOOGLE_CLIENT_ID: ${clientId ? "✅ Configurado" : "❌ NÃO CONFIGURADO"}`
  );
  console.log(
    `   GOOGLE_CLIENT_SECRET: ${clientSecret ? "✅ Configurado" : "❌ NÃO CONFIGURADO"}`
  );
  console.log(
    `   NEXTAUTH_SECRET: ${nextAuthSecret ? "✅ Configurado" : "❌ NÃO CONFIGURADO"}`
  );
  console.log(`   NEXTAUTH_URL: ${nextAuthUrl}`);

  if (!clientId || !clientSecret) {
    console.error("\n❌ Variáveis de ambiente não configuradas!");
    return;
  }

  // 2. Verificar se o servidor está rodando
  console.log("\n2️⃣ Verificando se o servidor está rodando:");
  try {
    const healthCheck = await makeRequest(`${nextAuthUrl}/api/auth/csrf`);
    if (healthCheck.statusCode === 200) {
      console.log("   ✅ Servidor está rodando");
    } else {
      console.error(`   ❌ Servidor retornou status ${healthCheck.statusCode}`);
      return;
    }
  } catch (error) {
    console.error(`   ❌ Erro ao conectar ao servidor: ${error.message}`);
    console.error(
      "   💡 Certifique-se de que o servidor está rodando (npm run dev)"
    );
    return;
  }

  // 3. Obter CSRF token
  console.log("\n3️⃣ Obtendo CSRF token:");
  try {
    const csrfResponse = await makeRequest(`${nextAuthUrl}/api/auth/csrf`);
    let csrfToken = null;

    if (csrfResponse.statusCode === 200) {
      try {
        const json = JSON.parse(csrfResponse.body);
        csrfToken = json.csrfToken;
      } catch (e) {
        // Tentar extrair do cookie
        const cookies = csrfResponse.headers["set-cookie"] || [];
        for (const cookie of cookies) {
          const match = cookie.match(/next-auth\.csrf-token=([^;]+)/);
          if (match) {
            csrfToken = match[1].split("|")[0];
            break;
          }
        }
      }

      if (csrfToken) {
        console.log(
          `   ✅ CSRF token obtido: ${csrfToken.substring(0, 20)}...`
        );
      } else {
        console.error("   ❌ Não foi possível obter CSRF token");
        return;
      }
    } else {
      console.error(
        `   ❌ Erro ao obter CSRF token: ${csrfResponse.statusCode}`
      );
      return;
    }

    // 4. Verificar se o Google Provider está disponível
    console.log("\n4️⃣ Verificando se o Google Provider está disponível:");
    try {
      const signinResponse = await makeRequest(
        `${nextAuthUrl}/api/auth/signin?csrf=true`,
        {
          headers: {
            Cookie: `next-auth.csrf-token=${csrfToken}`,
          },
        }
      );

      if (
        signinResponse.body.includes("google") ||
        signinResponse.body.includes("Google")
      ) {
        console.log("   ✅ Google Provider está disponível");
      } else {
        console.warn(
          "   ⚠️ Google Provider pode não estar configurado corretamente"
        );
        console.log(
          "   📄 Resposta do signin:",
          signinResponse.body.substring(0, 500)
        );
      }
    } catch (error) {
      console.error(`   ❌ Erro ao verificar provider: ${error.message}`);
    }

    // 5. Verificar URLs de callback esperadas
    console.log(
      "\n5️⃣ URLs de callback que devem estar no Google Cloud Console:"
    );
    const callbackUrls = [
      `${nextAuthUrl}/api/auth/callback/google`,
      // Para subdomínios comuns
      `http://santos.localhost:3000/api/auth/callback/google`,
      `http://teste.localhost:3000/api/auth/callback/google`,
    ];

    callbackUrls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });

    console.log("\n📝 Instruções:");
    console.log(
      "   1. Acesse: https://console.cloud.google.com/apis/credentials"
    );
    console.log("   2. Selecione seu projeto");
    console.log("   3. Clique no OAuth 2.0 Client ID");
    console.log(
      "   4. Em 'Authorized redirect URIs', adicione TODAS as URLs acima"
    );
    console.log("   5. Clique em 'Save'");
    console.log("   6. Aguarde alguns minutos para as mudanças propagarem");

    // 6. Verificar se o callback URL está correto
    console.log("\n6️⃣ Testando callback URL:");
    try {
      // Simular um callback do Google (sem code válido, mas verifica se a rota existe)
      const callbackResponse = await makeRequest(
        `${nextAuthUrl}/api/auth/callback/google?error=test`
      );

      if (
        callbackResponse.statusCode === 302 ||
        callbackResponse.statusCode === 200
      ) {
        console.log(
          `   ✅ Callback URL está acessível (status: ${callbackResponse.statusCode})`
        );
        const location = callbackResponse.headers.location;
        if (location) {
          console.log(`   📍 Redirecionando para: ${location}`);
        }
      } else {
        console.error(
          `   ❌ Callback URL retornou status ${callbackResponse.statusCode}`
        );
      }
    } catch (error) {
      console.error(`   ❌ Erro ao testar callback URL: ${error.message}`);
    }

    console.log("\n✅ Teste concluído!");
    console.log("\n💡 Se o erro persistir:");
    console.log(
      "   - Verifique se TODAS as URLs de callback estão no Google Cloud Console"
    );
    console.log(
      "   - Certifique-se de que não há trailing slash (/) no final das URLs"
    );
    console.log(
      "   - Verifique se está usando http:// (não https://) para localhost"
    );
    console.log("   - Aguarde alguns minutos após salvar no Google Console");
    console.log("   - Verifique os logs do servidor quando tentar fazer login");
  } catch (error) {
    console.error("\n❌ Erro durante o teste:", error);
  }
}

if (require.main === module) {
  testGoogleOAuthFlow();
}

module.exports = { testGoogleOAuthFlow };
