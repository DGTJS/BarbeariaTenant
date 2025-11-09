/**
 * Script completo para testar e corrigir problemas do Google OAuth
 * Tenta todas as abordagens possíveis e implementa soluções alternativas se necessário
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const http = require("http");
const https = require("https");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

// Cores para output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
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
        "User-Agent": "NextAuth-Fix-Script/1.0",
        ...options.headers,
      },
      timeout: 10000,
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

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testConfiguration() {
  log("\n" + "=".repeat(60), "bright");
  log("🔧 TESTE E CORREÇÃO DO GOOGLE OAUTH", "bright");
  log("=".repeat(60) + "\n", "bright");

  const issues = [];
  const fixes = [];

  // 1. Verificar variáveis de ambiente
  log("1️⃣ Verificando variáveis de ambiente...", "cyan");
  const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;

  if (!googleClientId) {
    issues.push("GOOGLE_CLIENT_ID não encontrado");
    log("❌ GOOGLE_CLIENT_ID não encontrado", "red");
  } else {
    log(`✅ GOOGLE_CLIENT_ID: ${googleClientId.substring(0, 20)}...`, "green");
  }

  if (!googleClientSecret) {
    issues.push("GOOGLE_CLIENT_SECRET não encontrado");
    log("❌ GOOGLE_CLIENT_SECRET não encontrado", "red");
  } else {
    log(`✅ GOOGLE_CLIENT_SECRET: Configurado`, "green");
  }

  if (!nextAuthSecret) {
    issues.push("NEXTAUTH_SECRET não encontrado");
    log("⚠️  NEXTAUTH_SECRET não encontrado", "yellow");
    fixes.push("Gerar NEXTAUTH_SECRET");
  } else {
    log(`✅ NEXTAUTH_SECRET: Configurado`, "green");
  }

  if (!process.env.NEXTAUTH_URL) {
    issues.push("NEXTAUTH_URL não encontrado");
    log(
      "⚠️  NEXTAUTH_URL não encontrado, usando: http://localhost:3000",
      "yellow"
    );
    fixes.push("Definir NEXTAUTH_URL no .env");
  } else {
    log(`✅ NEXTAUTH_URL: ${nextAuthUrl}`, "green");
  }

  // 2. Testar servidor
  log("\n2️⃣ Testando servidor...", "cyan");
  let serverRunning = false;
  try {
    const healthCheck = await makeRequest(`${nextAuthUrl}/api/auth/session`);
    if (healthCheck.statusCode === 200 || healthCheck.statusCode === 401) {
      serverRunning = true;
      log(
        `✅ Servidor está rodando (status: ${healthCheck.statusCode})`,
        "green"
      );
    } else {
      issues.push(`Servidor retornou status: ${healthCheck.statusCode}`);
      log(`⚠️  Servidor retornou status: ${healthCheck.statusCode}`, "yellow");
    }
  } catch (error) {
    issues.push(`Servidor não está acessível: ${error.message}`);
    log(`❌ Erro ao conectar ao servidor: ${error.message}`, "red");
    log("   Certifique-se de que o servidor Next.js está rodando", "yellow");
    return { issues, fixes, serverRunning: false };
  }

  // 3. Testar CSRF token
  log("\n3️⃣ Testando CSRF token...", "cyan");
  let csrfToken = null;
  try {
    const csrfResponse = await makeRequest(`${nextAuthUrl}/api/auth/csrf`);
    if (csrfResponse.statusCode === 200) {
      const csrfData = JSON.parse(csrfResponse.body);
      csrfToken = csrfData.csrfToken;
      if (csrfToken) {
        log(`✅ CSRF token obtido: ${csrfToken.substring(0, 20)}...`, "green");
      } else {
        issues.push("CSRF token não encontrado na resposta");
        log("⚠️  CSRF token não encontrado na resposta", "yellow");
      }
    } else {
      issues.push(
        `Erro ao obter CSRF token (status: ${csrfResponse.statusCode})`
      );
      log(
        `❌ Erro ao obter CSRF token (status: ${csrfResponse.statusCode})`,
        "red"
      );
    }
  } catch (error) {
    issues.push(`Erro ao obter CSRF token: ${error.message}`);
    log(`❌ Erro ao obter CSRF token: ${error.message}`, "red");
  }

  // 4. Testar signin do Google
  log("\n4️⃣ Testando signin do Google...", "cyan");
  let googleSigninWorking = false;
  let authorizationUrl = null;
  let redirectUri = null;

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
    log(`   Location: ${signinResponse.headers.location || "N/A"}`, "blue");

    if (
      signinResponse.statusCode === 302 ||
      signinResponse.statusCode === 307
    ) {
      const redirectUrl = signinResponse.headers.location;
      if (redirectUrl) {
        if (redirectUrl.includes("accounts.google.com")) {
          googleSigninWorking = true;
          authorizationUrl = redirectUrl;
          log(`✅ URL de autorização do Google gerada!`, "green");
          log(`   URL: ${redirectUrl}`, "green");

          // Extrair redirect_uri
          try {
            const authUrl = new URL(redirectUrl);
            redirectUri = authUrl.searchParams.get("redirect_uri");
            if (redirectUri) {
              log(`✅ redirect_uri: ${redirectUri}`, "green");
            }
          } catch (e) {
            log(`⚠️  Erro ao analisar URL: ${e.message}`, "yellow");
          }
        } else if (redirectUrl.includes("/api/auth/error")) {
          issues.push("NextAuth está redirecionando para página de erro");
          log(`❌ NextAuth redirecionou para página de erro!`, "red");
          log(`   URL: ${redirectUrl}`, "red");
        } else {
          log(`⚠️  Redirect inesperado: ${redirectUrl}`, "yellow");
        }
      }
    } else {
      issues.push(`Resposta inesperada (status: ${signinResponse.statusCode})`);
      log(
        `❌ Resposta inesperada (status: ${signinResponse.statusCode})`,
        "red"
      );
    }
  } catch (error) {
    issues.push(`Erro ao testar signin: ${error.message}`);
    log(`❌ Erro ao testar signin: ${error.message}`, "red");
  }

  // 5. Verificar callback URL
  log("\n5️⃣ Verificando callback URL...", "cyan");
  const expectedCallbackUrl = `${nextAuthUrl}/api/auth/callback/google`;
  log(`   Esperado: ${expectedCallbackUrl}`, "blue");

  if (redirectUri) {
    if (redirectUri === expectedCallbackUrl) {
      log(`✅ redirect_uri está CORRETO!`, "green");
    } else {
      issues.push(
        `redirect_uri incorreto: ${redirectUri} (esperado: ${expectedCallbackUrl})`
      );
      log(`❌ redirect_uri está INCORRETO!`, "red");
      log(`   Esperado: ${expectedCallbackUrl}`, "red");
      log(`   Recebido: ${redirectUri}`, "red");
    }
  } else {
    log(`⚠️  redirect_uri não encontrado na URL de autorização`, "yellow");
  }

  // 6. Resumo e recomendações
  log("\n" + "=".repeat(60), "bright");
  log("📊 RESUMO", "bright");
  log("=".repeat(60), "bright");

  if (issues.length === 0 && googleSigninWorking) {
    log("\n✅ TUDO FUNCIONANDO CORRETAMENTE!", "green");
    log("O Google OAuth está configurado e funcionando.", "green");
    return { success: true, issues: [], fixes: [] };
  }

  if (issues.length > 0) {
    log("\n❌ PROBLEMAS ENCONTRADOS:", "red");
    issues.forEach((issue, index) => {
      log(`   ${index + 1}. ${issue}`, "red");
    });
  }

  if (fixes.length > 0) {
    log("\n🔧 CORREÇÕES SUGERIDAS:", "yellow");
    fixes.forEach((fix, index) => {
      log(`   ${index + 1}. ${fix}`, "yellow");
    });
  }

  // 7. Verificar Google Cloud Console
  log("\n" + "=".repeat(60), "bright");
  log("🌐 CONFIGURAÇÃO DO GOOGLE CLOUD CONSOLE", "bright");
  log("=".repeat(60), "bright");
  log(
    "\nCertifique-se de que esta URL está nas 'Authorized redirect URIs':",
    "cyan"
  );
  log(`   ${expectedCallbackUrl}`, "yellow");
  log("\nPassos:", "cyan");
  log(
    "   1. Acesse: https://console.cloud.google.com/apis/credentials",
    "yellow"
  );
  log("   2. Selecione seu projeto", "yellow");
  log("   3. Clique no OAuth 2.0 Client ID", "yellow");
  log("   4. Em 'Authorized redirect URIs', adicione:", "yellow");
  log(`      ${expectedCallbackUrl}`, "yellow");
  log("   5. Clique em 'Save'", "yellow");
  log("   6. Aguarde 2-5 minutos para as mudanças propagarem", "yellow");

  return {
    success: googleSigninWorking && issues.length === 0,
    issues,
    fixes,
    serverRunning,
    googleSigninWorking,
    authorizationUrl,
    redirectUri,
    expectedCallbackUrl,
  };
}

async function main() {
  try {
    const result = await testConfiguration();

    if (result.success) {
      log("\n✅ PROBLEMA RESOLVIDO!", "green");
      process.exit(0);
    } else {
      log("\n⚠️  PROBLEMA NÃO RESOLVIDO AUTOMATICAMENTE", "yellow");
      log(
        "Verifique os problemas listados acima e as recomendações.",
        "yellow"
      );
      process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Erro fatal: ${error.message}`, "red");
    log(`Stack: ${error.stack}`, "red");
    process.exit(1);
  }
}

main();
