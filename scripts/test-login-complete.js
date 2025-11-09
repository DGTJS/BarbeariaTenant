const http = require("http");
const https = require("https");
const { URL } = require("url");

// Configuração
const TEST_CONFIG = {
  baseUrl: "http://localhost:3000",
  tenants: ["santos", "teste"],
  defaultTenant: true,
  credentials: {
    email: "admin@barbearia.com",
    name: "Administrador",
    password: "",
  },
};

// Helper para validar e construir URL
function buildUrl(baseUrl, path) {
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return new URL(path);
    }
    const base = new URL(baseUrl);
    return new URL(path, base);
  } catch (error) {
    console.error(`❌ Erro ao construir URL: ${baseUrl} + ${path}`);
    console.error(`   Erro: ${error.message}`);
    throw error;
  }
}

// Helper para fazer requisições HTTP com tratamento de erros
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    let urlObj;
    try {
      urlObj = typeof url === "string" ? new URL(url) : url;
    } catch (error) {
      reject(new Error(`URL inválida: ${url} - ${error.message}`));
      return;
    }

    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": options.headers?.["Content-Type"] || "application/json",
        "User-Agent": "TestScript/1.0",
        ...options.headers,
      },
      timeout: options.timeout || 10000,
    };

    const req = client.request(requestOptions, res => {
      let data = "";

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        let parsedData;
        try {
          parsedData = data ? JSON.parse(data) : null;
        } catch (e) {
          parsedData = data;
        }

        // Extrair cookies da resposta
        const cookies = res.headers["set-cookie"] || [];
        const cookieMap = {};
        cookies.forEach(cookie => {
          const [keyValue] = cookie.split(";");
          const [key, value] = keyValue.split("=");
          if (key && value) {
            cookieMap[key.trim()] = value.trim();
          }
        });

        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsedData,
          rawData: data,
          cookies: cookieMap,
          cookieHeader: cookies.join("; "),
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

// Teste 1: Verificar servidor
async function testServer(tenantUrl) {
  console.log(`\n🔍 [TESTE 1] Verificando servidor...`);
  try {
    const url = buildUrl(tenantUrl, "/");
    const response = await makeRequest(url);

    if (response.status === 200 || response.status === 404) {
      console.log(`✅ Servidor respondendo (status: ${response.status})`);
      return { success: true, url: tenantUrl };
    } else {
      console.log(`⚠️ Servidor retornou status: ${response.status}`);
      return { success: false, url: tenantUrl, status: response.status };
    }
  } catch (error) {
    console.log(`❌ Erro ao conectar: ${error.message}`);
    return { success: false, url: tenantUrl, error: error.message };
  }
}

// Teste 2: Obter CSRF Token
async function testCsrfToken(tenantUrl) {
  console.log(`\n🔍 [TESTE 2] Obtendo CSRF Token...`);
  try {
    const url = buildUrl(tenantUrl, "/api/auth/signin?csrf=true");
    const response = await makeRequest(url);

    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers["content-type"]}`);

    let csrfToken = null;
    let cookieHeader = response.cookieHeader || "";

    // Tentar obter do body primeiro
    if (response.status === 200 && response.data?.csrfToken) {
      csrfToken = response.data.csrfToken;
      console.log(
        `✅ CSRF Token obtido do body: ${csrfToken.substring(0, 20)}...`
      );
    }
    // Tentar extrair do cookie
    else if (response.cookies && response.cookies["next-auth.csrf-token"]) {
      try {
        const cookieValue = decodeURIComponent(
          response.cookies["next-auth.csrf-token"]
        );
        csrfToken = cookieValue.split("|")[0];
        console.log(
          `✅ CSRF Token extraído do cookie: ${csrfToken.substring(0, 20)}...`
        );
      } catch (e) {
        console.log(`⚠️ Erro ao extrair token do cookie: ${e.message}`);
      }
    }
    // Se houver redirect, tentar seguir
    else if (response.status === 302 || response.status === 301) {
      console.log(`⚠️ Redirect recebido (status ${response.status})`);
      const location = response.headers.location;
      console.log(`   Location: ${location}`);

      if (location) {
        try {
          // Tentar construir URL absoluta
          let redirectUrl;
          if (
            location.startsWith("http://") ||
            location.startsWith("https://")
          ) {
            redirectUrl = new URL(location);
          } else {
            redirectUrl = buildUrl(tenantUrl, location);
          }

          console.log(`   Seguindo redirect para: ${redirectUrl.href}`);
          const redirectResponse = await makeRequest(redirectUrl);

          if (redirectResponse.data?.csrfToken) {
            csrfToken = redirectResponse.data.csrfToken;
            console.log(
              `✅ CSRF Token obtido após redirect: ${csrfToken.substring(0, 20)}...`
            );
            cookieHeader = redirectResponse.cookieHeader || cookieHeader;
          }
        } catch (e) {
          console.log(`⚠️ Erro ao seguir redirect: ${e.message}`);
        }
      }
    }

    if (!csrfToken) {
      console.log(`❌ Falha ao obter CSRF Token`);
      console.log(`   Response data:`, JSON.stringify(response.data, null, 2));
      return { success: false, token: null, cookieHeader: "" };
    }

    return { success: true, token: csrfToken, cookieHeader };
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    if (error.stack) {
      console.log(
        `   Stack: ${error.stack.split("\n").slice(0, 3).join("\n")}`
      );
    }
    return {
      success: false,
      token: null,
      cookieHeader: "",
      error: error.message,
    };
  }
}

// Teste 3: Verificar Providers
async function testProviders(tenantUrl) {
  console.log(`\n🔍 [TESTE 3] Verificando providers...`);
  try {
    const url = buildUrl(tenantUrl, "/api/auth/providers");
    const response = await makeRequest(url);

    console.log(`   Status: ${response.status}`);

    if (response.status === 200 && response.data) {
      const providers = Object.keys(response.data);
      console.log(`✅ Providers encontrados: ${providers.join(", ")}`);
      console.log(`   Detalhes:`, JSON.stringify(response.data, null, 2));
      return { success: true, providers, details: response.data };
    } else {
      console.log(`❌ Falha ao obter providers`);
      console.log(`   Data:`, JSON.stringify(response.data, null, 2));
      return { success: false, providers: [], details: response.data };
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return { success: false, providers: [], error: error.message };
  }
}

// Teste 4: Tentar fazer login
async function testLogin(tenantUrl, csrfToken, csrfCookieHeader = "") {
  console.log(`\n🔍 [TESTE 4] Tentando fazer login...`);

  const credentials = {
    email: TEST_CONFIG.credentials.email,
    name: TEST_CONFIG.credentials.name,
    password: TEST_CONFIG.credentials.password || "",
    csrfToken: csrfToken || "",
    redirect: "false",
    callbackUrl: `${tenantUrl}/admin`,
    json: "true",
  };

  console.log(`   Credenciais:`, {
    email: credentials.email,
    name: credentials.name,
    hasPassword: !!credentials.password,
    hasCsrfToken: !!credentials.csrfToken,
  });

  // Criar form data
  const formData = new URLSearchParams(credentials).toString();

  try {
    const url = buildUrl(tenantUrl, "/api/auth/callback/credentials");

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": formData.length.toString(),
    };

    // Adicionar cookies CSRF se disponíveis
    if (csrfCookieHeader) {
      headers["Cookie"] = csrfCookieHeader;
      console.log(
        `   Cookies incluídos: ${csrfCookieHeader.substring(0, 50)}...`
      );
    }

    console.log(`   URL: ${url.href}`);
    console.log(`   Method: POST`);
    console.log(`   Body length: ${formData.length}`);

    const response = await makeRequest(url, {
      method: "POST",
      headers,
      body: formData,
    });

    console.log(`\n   📊 RESPOSTA COMPLETA:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers["content-type"]}`);
    console.log(`   Headers:`, JSON.stringify(response.headers, null, 2));
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));
    console.log(
      `   Raw Data (primeiros 200 chars):`,
      response.rawData.substring(0, 200)
    );

    // Verificar cookies
    const cookies = response.headers["set-cookie"] || [];
    const sessionCookie = cookies.find(c =>
      c.includes("next-auth.session-token")
    );

    if (sessionCookie) {
      console.log(`\n✅ Cookie de sessão encontrado!`);
      console.log(`   Cookie: ${sessionCookie.substring(0, 80)}...`);
    } else {
      console.log(`\n❌ Nenhum cookie de sessão encontrado`);
      console.log(
        `   Cookies recebidos:`,
        cookies.map(c => c.substring(0, 50))
      );
    }

    // Verificar redirect
    let redirectUrl = null;
    if (response.status === 302 || response.status === 301) {
      redirectUrl = response.headers.location;
      console.log(`\n   🔀 Redirect detectado:`);
      console.log(`   Location: ${redirectUrl}`);

      if (redirectUrl) {
        try {
          let finalUrl;
          if (
            redirectUrl.startsWith("http://") ||
            redirectUrl.startsWith("https://")
          ) {
            finalUrl = new URL(redirectUrl);
          } else {
            finalUrl = buildUrl(tenantUrl, redirectUrl);
          }
          console.log(`   URL final: ${finalUrl.href}`);

          if (
            finalUrl.href.includes("/api/auth/signin") &&
            !finalUrl.href.includes("error")
          ) {
            console.log(
              `   ⚠️ Redirecionando para signin (authorize provavelmente não foi chamado ou retornou null)`
            );
          } else if (finalUrl.href.includes("/admin")) {
            console.log(`   ✅ Redirecionando para /admin (sucesso!)`);
          }
        } catch (e) {
          console.log(`   ⚠️ Erro ao processar URL de redirect: ${e.message}`);
        }
      }
    }

    const success =
      response.status === 200 ||
      (response.status === 302 && redirectUrl?.includes("/admin")) ||
      !!sessionCookie;

    return {
      success,
      status: response.status,
      hasSessionCookie: !!sessionCookie,
      redirectUrl,
      data: response.data,
      cookies: response.cookieHeader,
    };
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    if (error.stack) {
      console.log(`   Stack:`, error.stack.split("\n").slice(0, 5).join("\n"));
    }
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }
}

// Teste 5: Verificar sessão
async function testSession(tenantUrl, cookieHeader) {
  console.log(`\n🔍 [TESTE 5] Verificando sessão...`);

  try {
    const url = buildUrl(tenantUrl, "/api/auth/session");
    const response = await makeRequest(url, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data?.user) {
      console.log(`✅ Sessão válida!`);
      console.log(`   Usuário: ${response.data.user.email}`);
      console.log(`   Nome: ${response.data.user.name}`);
      console.log(`   Role: ${response.data.user.role}`);
      return {
        success: true,
        user: response.data.user,
        session: response.data,
      };
    } else {
      console.log(`❌ Sessão inválida ou não encontrada`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2));
      return { success: false, data: response.data };
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Teste completo para um tenant
async function testTenantComplete(tenantName) {
  const tenantUrl =
    tenantName === null
      ? TEST_CONFIG.baseUrl
      : `http://${tenantName}.localhost:3000`;

  console.log(`\n${"=".repeat(80)}`);
  console.log(`🧪 TESTE COMPLETO - TENANT: ${tenantName || "default"}`);
  console.log(`${"=".repeat(80)}`);
  console.log(`URL: ${tenantUrl}`);

  const results = {
    tenant: tenantName || "default",
    url: tenantUrl,
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Teste 1: Servidor
  const serverResult = await testServer(tenantUrl);
  results.tests.server = serverResult;

  if (!serverResult.success) {
    console.log(`\n❌ Servidor não está respondendo. Abortando testes.`);
    return results;
  }

  // Teste 2: CSRF Token
  const csrfResult = await testCsrfToken(tenantUrl);
  results.tests.csrf = csrfResult;
  const csrfToken = csrfResult.token || null;
  const csrfCookieHeader = csrfResult.cookieHeader || "";

  if (!csrfResult.success) {
    console.log(
      `\n⚠️ CSRF Token não obtido, mas continuando com teste de login...`
    );
  }

  // Teste 3: Providers
  const providersResult = await testProviders(tenantUrl);
  results.tests.providers = providersResult;

  // Teste 4: Login
  const loginResult = await testLogin(tenantUrl, csrfToken, csrfCookieHeader);
  results.tests.login = loginResult;

  // Teste 5: Sessão (se houver cookies)
  if (loginResult.cookies) {
    const sessionResult = await testSession(tenantUrl, loginResult.cookies);
    results.tests.session = sessionResult;
  } else {
    results.tests.session = {
      success: false,
      reason: "Sem cookies de sessão para testar",
    };
  }

  // Resumo final
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📊 RESUMO DO TENANT: ${tenantName || "default"}`);
  console.log(`${"=".repeat(80)}`);
  console.log(`Servidor: ${serverResult.success ? "✅" : "❌"}`);
  console.log(`CSRF: ${csrfResult.success ? "✅" : "❌"}`);
  console.log(`Providers: ${providersResult.success ? "✅" : "❌"}`);
  console.log(`Login: ${loginResult.success ? "✅" : "❌"}`);
  console.log(`Sessão: ${results.tests.session.success ? "✅" : "❌"}`);

  return results;
}

// Gerar relatório
function generateReport(allResults) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📊 RELATÓRIO FINAL`);
  console.log(`${"=".repeat(80)}`);

  const summary = {
    total: allResults.length,
    success: 0,
    failed: 0,
    details: [],
  };

  allResults.forEach(result => {
    const tenantSuccess =
      result.tests.server?.success &&
      result.tests.csrf?.success &&
      result.tests.providers?.success &&
      result.tests.login?.success &&
      result.tests.session?.success;

    if (tenantSuccess) {
      summary.success++;
    } else {
      summary.failed++;
    }

    summary.details.push({
      tenant: result.tenant,
      url: result.url,
      server: result.tests.server?.success ? "✅" : "❌",
      csrf: result.tests.csrf?.success ? "✅" : "❌",
      providers: result.tests.providers?.success ? "✅" : "❌",
      login: result.tests.login?.success ? "✅" : "❌",
      session: result.tests.session?.success ? "✅" : "❌",
      errors: {
        server: result.tests.server?.error || null,
        csrf: result.tests.csrf?.error || null,
        login: result.tests.login?.error || null,
        session: result.tests.session?.error || null,
      },
    });
  });

  console.log(`\nTotal de testes: ${summary.total}`);
  console.log(`Sucessos: ${summary.success}`);
  console.log(`Falhas: ${summary.failed}`);
  console.log(
    `Taxa de sucesso: ${((summary.success / summary.total) * 100).toFixed(2)}%`
  );

  console.log(`\n📋 DETALHES POR TENANT:`);
  summary.details.forEach(detail => {
    console.log(`\n  ${detail.tenant}:`);
    console.log(`    URL: ${detail.url}`);
    console.log(`    Servidor: ${detail.server}`);
    console.log(`    CSRF: ${detail.csrf}`);
    console.log(`    Providers: ${detail.providers}`);
    console.log(`    Login: ${detail.login}`);
    console.log(`    Sessão: ${detail.session}`);
    if (
      detail.errors.server ||
      detail.errors.csrf ||
      detail.errors.login ||
      detail.errors.session
    ) {
      console.log(`    Erros:`);
      Object.entries(detail.errors).forEach(([key, value]) => {
        if (value) {
          console.log(`      ${key}: ${value}`);
        }
      });
    }
  });

  // Salvar relatório JSON
  const reportData = {
    timestamp: new Date().toISOString(),
    summary,
    results: allResults,
  };

  const fs = require("fs");
  const reportPath = "test-login-complete-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\n💾 Relatório JSON salvo em: ${reportPath}`);

  return reportData;
}

// Executar todos os testes
async function runAllTests() {
  console.log(`\n🚀🚀🚀 INICIANDO TESTES COMPLETOS DE LOGIN 🚀🚀🚀\n`);
  console.log(`📝 Credenciais de teste:`);
  console.log(`   Email: ${TEST_CONFIG.credentials.email}`);
  console.log(`   Nome: ${TEST_CONFIG.credentials.name}`);
  console.log(`   Password: ${TEST_CONFIG.credentials.password || "(vazio)"}`);

  const allResults = [];

  // Testar tenant default (sem subdomain)
  if (TEST_CONFIG.defaultTenant) {
    const defaultResult = await testTenantComplete(null);
    allResults.push(defaultResult);
  }

  // Testar cada tenant
  for (const tenant of TEST_CONFIG.tenants) {
    const tenantResult = await testTenantComplete(tenant);
    allResults.push(tenantResult);
  }

  // Gerar relatório
  const report = generateReport(allResults);

  console.log(`\n✅ Todos os testes concluídos!\n`);
  return report;
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error(`\n❌ Erro fatal:`, error);
      if (error.stack) {
        console.error(`Stack:`, error.stack);
      }
      process.exit(1);
    });
}

module.exports = { runAllTests, testTenantComplete };


