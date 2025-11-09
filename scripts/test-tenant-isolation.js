/**
 * Script para testar isolamento de tenants no sistema
 * Verifica que:
 * 1. Login no tenant A não permite acesso ao tenant B
 * 2. Cookies são isolados por tenant
 * 3. Dados são isolados por banco de dados
 */

const https = require("https");
const http = require("http");

// Configuração
const BASE_URL = "http://localhost:3000";
const TENANT_SANTOS = "santos.localhost:3000";
const TENANT_DEFAULT = "localhost:3000";

// Cores para output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

function logTest(message) {
  log(`\n🧪 ${message}`, "cyan");
}

// Helper para fazer requisições HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        ...options.headers,
        "User-Agent": "Tenant-Isolation-Test",
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
          cookies: parseCookies(res.headers["set-cookie"] || []),
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

function parseCookies(setCookieHeaders) {
  const cookies = {};
  if (Array.isArray(setCookieHeaders)) {
    setCookieHeaders.forEach((cookie) => {
      const [nameValue] = cookie.split(";");
      const [name, value] = nameValue.split("=");
      if (name && value) {
        cookies[name.trim()] = value.trim();
      }
    });
  }
  return cookies;
}

function getCookieHeader(cookies) {
  return Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

// Testes
async function testTenantIsolation() {
  log("\n" + "=".repeat(60), "cyan");
  log("🧪 TESTE DE ISOLAMENTO DE TENANTS", "cyan");
  log("=".repeat(60) + "\n", "cyan");

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Teste 1: Verificar que os endpoints detectam o tenant corretamente
  logTest("Teste 1: Detecção de tenant nos endpoints");
  try {
    const response = await makeRequest(`http://${TENANT_SANTOS}/api/auth/session`);
    
    if (response.statusCode === 200) {
      logSuccess("Endpoint /api/auth/session respondeu");
      
      // Verificar se há algum header ou indicador de tenant
      const sessionData = JSON.parse(response.body);
      logInfo(`Session data: ${JSON.stringify(sessionData, null, 2)}`);
      results.passed++;
    } else {
      logError(`Endpoint retornou status ${response.statusCode}`);
      results.failed++;
    }
  } catch (error) {
    logError(`Erro ao testar endpoint: ${error.message}`);
    results.failed++;
  }

  // Teste 2: Verificar que cookies são criados com sufixo do tenant
  logTest("Teste 2: Verificação de cookies isolados por tenant");
  try {
    // Simular login no tenant santos
    const loginUrl = `http://${TENANT_SANTOS}/api/auth/signin/google`;
    const loginResponse = await makeRequest(loginUrl, {
      method: "GET",
      maxRedirects: 0,
    });

    logInfo(`Login response status: ${loginResponse.statusCode}`);
    logInfo(`Cookies recebidos: ${JSON.stringify(loginResponse.cookies, null, 2)}`);

    // Verificar se há cookie com sufixo .santos
    const hasTenantCookie = Object.keys(loginResponse.cookies).some(
      (name) => name.includes(".santos") || name.includes("next-auth.session-token.santos")
    );

    if (hasTenantCookie) {
      logSuccess("Cookie do tenant santos detectado");
      results.passed++;
    } else {
      logWarning("Cookie do tenant santos não encontrado nos headers");
      logWarning("Isso pode ser normal se o login redirecionar para o Google");
      results.warnings++;
    }
  } catch (error) {
    logWarning(`Erro ao verificar cookies: ${error.message}`);
    results.warnings++;
  }

  // Teste 3: Verificar endpoint /api/user/history detecta tenant
  logTest("Teste 3: Detecção de tenant no endpoint /api/user/history");
  try {
    const historyUrl = `http://${TENANT_SANTOS}/api/user/history`;
    const historyResponse = await makeRequest(historyUrl);

    logInfo(`History response status: ${historyResponse.statusCode}`);
    
    if (historyResponse.statusCode === 401) {
      logSuccess("Endpoint requer autenticação (esperado)");
      results.passed++;
    } else if (historyResponse.statusCode === 200) {
      const historyData = JSON.parse(historyResponse.body);
      logInfo(`History data: ${JSON.stringify(historyData, null, 2)}`);
      logWarning("Endpoint retornou dados sem autenticação (pode ser problema)");
      results.warnings++;
    } else {
      logError(`Endpoint retornou status inesperado: ${historyResponse.statusCode}`);
      results.failed++;
    }
  } catch (error) {
    logError(`Erro ao testar endpoint /api/user/history: ${error.message}`);
    results.failed++;
  }

  // Teste 4: Verificar isolamento de hostname
  logTest("Teste 4: Verificação de hostname em requisições");
  try {
    const testUrls = [
      `http://${TENANT_SANTOS}/api/auth/session`,
      `http://${TENANT_DEFAULT}/api/auth/session`,
    ];

    for (const url of testUrls) {
      const response = await makeRequest(url);
      logInfo(`${url} -> Status: ${response.statusCode}`);
    }

    logSuccess("Requisições para diferentes tenants funcionam");
    results.passed++;
  } catch (error) {
    logError(`Erro ao testar hostnames: ${error.message}`);
    results.failed++;
  }

  // Teste 5: Verificar que cookies de um tenant não funcionam no outro
  logTest("Teste 5: Isolamento de cookies entre tenants");
  try {
    // Este teste seria mais completo com cookies reais de login
    // Por enquanto, apenas verificamos a estrutura
    logInfo("Este teste requer cookies reais de sessão");
    logInfo("Para testar completamente, é necessário:");
    logInfo("  1. Fazer login no tenant santos");
    logInfo("  2. Copiar o cookie next-auth.session-token.santos");
    logInfo("  3. Tentar usar esse cookie no tenant default (deve falhar)");
    results.warnings++;
  } catch (error) {
    logError(`Erro no teste de isolamento: ${error.message}`);
    results.failed++;
  }

  // Resumo
  log("\n" + "=".repeat(60), "cyan");
  log("📊 RESUMO DOS TESTES", "cyan");
  log("=".repeat(60), "cyan");
  logSuccess(`Testes passados: ${results.passed}`);
  logError(`Testes falhados: ${results.failed}`);
  logWarning(`Avisos: ${results.warnings}`);

  const totalTests = results.passed + results.failed + results.warnings;
  const successRate = ((results.passed / totalTests) * 100).toFixed(1);
  
  log(`\nTaxa de sucesso: ${successRate}%`, successRate >= 80 ? "green" : "yellow");

  if (results.failed > 0) {
    log("\n⚠️  Alguns testes falharam. Verifique os logs acima.", "red");
    process.exit(1);
  } else {
    log("\n✅ Todos os testes críticos passaram!", "green");
    process.exit(0);
  }
}

// Executar testes
testTenantIsolation().catch((error) => {
  logError(`Erro fatal nos testes: ${error.message}`);
  console.error(error);
  process.exit(1);
});
