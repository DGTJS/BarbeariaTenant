/**
 * Script para testar o login com Google OAuth via NextAuth
 * Este script tenta simular o fluxo completo e identificar erros
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const http = require("http");
const https = require("https");
const { URL } = require("url");

// Cores para output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

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
      headers: {
        "User-Agent": "NextAuth-Test-Script/1.0",
        ...options.headers,
      },
    };

    const req = client.request(requestOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
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

    req.on("error", (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testGoogleLogin() {
  log("\n=== TESTE DE LOGIN COM GOOGLE OAUTH ===\n", "bright");

  // 1. Verificar variáveis de ambiente
  log("1. Verificando variáveis de ambiente...", "cyan");
  const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;

  if (!googleClientId) {
    log("❌ GOOGLE_CLIENT_ID não encontrado", "red");
    return;
  }
  if (!googleClientSecret) {
    log("❌ GOOGLE_CLIENT_SECRET não encontrado", "red");
    return;
  }
  if (!nextAuthSecret) {
    log("⚠️  NEXTAUTH_SECRET não encontrado (pode causar problemas)", "yellow");
  }

  log(`✅ GOOGLE_CLIENT_ID: ${googleClientId.substring(0, 20)}...`, "green");
  log(`✅ GOOGLE_CLIENT_SECRET: ${googleClientSecret ? "Configurado" : "Não configurado"}`, "green");
  log(`✅ NEXTAUTH_URL: ${nextAuthUrl}`, "green");
  log(`✅ NEXTAUTH_SECRET: ${nextAuthSecret ? "Configurado" : "Não configurado"}`, "green");

  // 2. Testar se o servidor está rodando
  log("\n2. Testando se o servidor está rodando...", "cyan");
  try {
    const healthCheck = await makeRequest(`${nextAuthUrl}/api/auth/session`);
    if (healthCheck.statusCode === 200 || healthCheck.statusCode === 401) {
      log(`✅ Servidor está rodando (status: ${healthCheck.statusCode})`, "green");
    } else {
      log(`⚠️  Servidor retornou status: ${healthCheck.statusCode}`, "yellow");
    }
  } catch (error) {
    log(`❌ Erro ao conectar ao servidor: ${error.message}`, "red");
    log("   Certifique-se de que o servidor Next.js está rodando em", "yellow");
    log(`   ${nextAuthUrl}`, "yellow");
    return;
  }

  // 3. Obter CSRF token
  log("\n3. Obtendo CSRF token...", "cyan");
  let csrfToken = null;
  try {
    const csrfResponse = await makeRequest(`${nextAuthUrl}/api/auth/csrf`);
    if (csrfResponse.statusCode === 200) {
      const csrfData = JSON.parse(csrfResponse.body);
      csrfToken = csrfData.csrfToken;
      if (csrfToken) {
        log(`✅ CSRF token obtido: ${csrfToken.substring(0, 20)}...`, "green");
      } else {
        log("⚠️  CSRF token não encontrado na resposta", "yellow");
        log(`   Resposta: ${csrfResponse.body}`, "yellow");
      }
    } else {
      log(`❌ Erro ao obter CSRF token (status: ${csrfResponse.statusCode})`, "red");
      log(`   Resposta: ${csrfResponse.body}`, "red");
    }
  } catch (error) {
    log(`❌ Erro ao obter CSRF token: ${error.message}`, "red");
  }

  // 4. Tentar acessar a página de signin do Google
  log("\n4. Tentando acessar página de signin do Google...", "cyan");
  try {
    const signinUrl = `${nextAuthUrl}/api/auth/signin/google?callbackUrl=${encodeURIComponent(`${nextAuthUrl}/profile`)}`;
    log(`   URL: ${signinUrl}`, "blue");

    const signinResponse = await makeRequest(signinUrl, {
      method: "GET",
      headers: {
        Cookie: csrfToken ? `next-auth.csrf-token=${csrfToken}` : "",
      },
    });

    log(`   Status: ${signinResponse.statusCode}`, "blue");
    log(`   Headers Location: ${signinResponse.headers.location || "N/A"}`, "blue");

    if (signinResponse.statusCode === 302 || signinResponse.statusCode === 307) {
      const redirectUrl = signinResponse.headers.location;
      if (redirectUrl) {
        log(`✅ Redirect detectado para: ${redirectUrl}`, "green");

        // 5. Analisar URL de autorização do Google
        log("\n5. Analisando URL de autorização do Google...", "cyan");
        try {
          const authUrl = new URL(redirectUrl);
          log(`   Host: ${authUrl.hostname}`, "blue");
          log(`   Path: ${authUrl.pathname}`, "blue");

          const redirectUri = authUrl.searchParams.get("redirect_uri");
          const clientId = authUrl.searchParams.get("client_id");
          const responseType = authUrl.searchParams.get("response_type");
          const scope = authUrl.searchParams.get("scope");

          log(`   redirect_uri: ${redirectUri || "NÃO ENCONTRADO"}`, redirectUri ? "green" : "red");
          log(`   client_id: ${clientId ? clientId.substring(0, 20) + "..." : "NÃO ENCONTRADO"}`, clientId ? "green" : "red");
          log(`   response_type: ${responseType || "NÃO ENCONTRADO"}`, responseType ? "green" : "red");
          log(`   scope: ${scope ? scope.substring(0, 50) + "..." : "NÃO ENCONTRADO"}`, scope ? "green" : "red");

          // Verificar se o redirect_uri está correto
          const expectedRedirectUri = `${nextAuthUrl}/api/auth/callback/google`;
          if (redirectUri) {
            if (redirectUri === expectedRedirectUri) {
              log(`\n✅ redirect_uri está CORRETO!`, "green");
              log(`   Esperado: ${expectedRedirectUri}`, "green");
              log(`   Recebido: ${redirectUri}`, "green");
            } else {
              log(`\n❌ redirect_uri está INCORRETO!`, "red");
              log(`   Esperado: ${expectedRedirectUri}`, "red");
              log(`   Recebido: ${redirectUri}`, "red");
              log(`\n   ⚠️  Este é provavelmente o problema!`, "yellow");
              log(`   O Google Cloud Console precisa ter exatamente:`, "yellow");
              log(`   ${expectedRedirectUri}`, "yellow");
              log(`   Mas o NextAuth está enviando:`, "yellow");
              log(`   ${redirectUri}`, "yellow");
            }

            // Verificar se o client_id está correto
            if (clientId && clientId !== googleClientId) {
              log(`\n❌ client_id não corresponde!`, "red");
              log(`   Configurado: ${googleClientId.substring(0, 20)}...`, "red");
              log(`   Na URL: ${clientId.substring(0, 20)}...`, "red");
            } else if (clientId) {
              log(`\n✅ client_id está correto`, "green");
            }
          } else {
            log(`\n❌ redirect_uri não encontrado na URL de autorização!`, "red");
            log(`   Isso indica um problema na configuração do NextAuth`, "red");
          }

          // 6. Verificar se a URL está acessível no Google Cloud Console
          log("\n6. Verificando configuração do Google Cloud Console...", "cyan");
          log(`   Você precisa ter esta URL nas "Authorized redirect URIs":`, "yellow");
          log(`   ${redirectUri || expectedRedirectUri}`, "yellow");
          log(`\n   Para verificar:`, "yellow");
          log(`   1. Acesse: https://console.cloud.google.com/apis/credentials`, "yellow");
          log(`   2. Clique no seu OAuth 2.0 Client ID`, "yellow");
          log(`   3. Verifique se "${redirectUri || expectedRedirectUri}" está na lista`, "yellow");
          log(`   4. Se não estiver, adicione e salve`, "yellow");

        } catch (error) {
          log(`❌ Erro ao analisar URL: ${error.message}`, "red");
        }
      } else {
        log(`❌ Redirect sem Location header!`, "red");
        log(`   Resposta: ${signinResponse.body.substring(0, 200)}`, "red");
      }
    } else {
      log(`❌ Resposta inesperada (status: ${signinResponse.statusCode})`, "red");
      log(`   Body: ${signinResponse.body.substring(0, 500)}`, "red");
    }
  } catch (error) {
    log(`❌ Erro ao acessar página de signin: ${error.message}`, "red");
    log(`   Stack: ${error.stack}`, "red");
  }

  // 7. Testar callback (simular)
  log("\n7. Testando callback do Google...", "cyan");
  const callbackUrl = `${nextAuthUrl}/api/auth/callback/google`;
  log(`   URL do callback: ${callbackUrl}`, "blue");
  
  try {
    // Simular um callback com erro (para ver como o NextAuth responde)
    const testCallbackUrl = `${callbackUrl}?error=access_denied&error_description=User+cancelled+the+login`;
    log(`   Testando com erro simulado: ${testCallbackUrl}`, "blue");
    
    const callbackResponse = await makeRequest(testCallbackUrl);
    log(`   Status: ${callbackResponse.statusCode}`, "blue");
    
    if (callbackResponse.statusCode === 302 || callbackResponse.statusCode === 307) {
      const errorRedirect = callbackResponse.headers.location;
      log(`   Redirect para: ${errorRedirect}`, "blue");
      
      if (errorRedirect && errorRedirect.includes("/api/auth/error")) {
        log(`   ✅ NextAuth está redirecionando para página de erro corretamente`, "green");
      }
    } else {
      log(`   ⚠️  Resposta inesperada do callback`, "yellow");
    }
  } catch (error) {
    log(`   ⚠️  Erro ao testar callback: ${error.message}`, "yellow");
  }

  // Resumo
  log("\n=== RESUMO ===", "bright");
  log("Se você viu 'redirect_uri está INCORRETO' acima, esse é o problema.", "yellow");
  log("O NextAuth está gerando uma URL diferente da configurada no Google Cloud Console.", "yellow");
  log("\nSoluções possíveis:", "cyan");
  log("1. Verifique se NEXTAUTH_URL está definido corretamente no .env", "yellow");
  log("2. Adicione a URL exata que aparece no 'redirect_uri' no Google Cloud Console", "yellow");
  log("3. Ou ajuste o código para forçar o redirect_uri correto", "yellow");
  log("\n");
}

// Executar teste
testGoogleLogin().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, "red");
  log(`Stack: ${error.stack}`, "red");
  process.exit(1);
});

