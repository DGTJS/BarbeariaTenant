const http = require("http");
const https = require("https");

// Configuração
const TEST_CONFIG = {
  baseUrl: "http://localhost:3000",
  tenants: ["santos", "teste"], // Adicione mais tenants se necessário
  defaultTenant: null, // null = sem subdomain
  credentials: {
    email: "admin@barbearia.com",
    name: "Administrador",
    password: "",
  },
};

// Helper para fazer requisições HTTP com suporte a cookies e redirects
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
        "Content-Type": options.headers?.["Content-Type"] || "application/json",
        ...options.headers,
      },
      maxRedirects: options.maxRedirects || 0, // Não seguir redirects automaticamente
    };

    const req = client.request(requestOptions, res => {
      let data = "";

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
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

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Teste 1: Verificar se o servidor está respondendo
async function testServer(tenantUrl) {
  console.log(`\n🔍 [TESTE 1] Verificando servidor em ${tenantUrl}...`);
  try {
    const response = await makeRequest(`${tenantUrl}/`);
    if (response.status === 200 || response.status === 404) {
      console.log(`✅ Servidor respondendo (status: ${response.status})`);
      return true;
    } else {
      console.log(`⚠️ Servidor retornou status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro ao conectar: ${error.message}`);
    return false;
  }
}

// Teste 2: Obter CSRF Token
async function testCsrfToken(tenantUrl) {
  console.log(`\n🔍 [TESTE 2] Obtendo CSRF Token de ${tenantUrl}...`);
  try {
    const response = await makeRequest(
      `${tenantUrl}/api/auth/signin?csrf=true`
    );

    console.log(`   Status: ${response.status}`);
    console.log(`   Headers:`, JSON.stringify(response.headers, null, 2));
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));
    console.log(`   Cookies:`, JSON.stringify(response.cookies, null, 2));

    let csrfToken = null;

    if (response.status === 200 && response.data?.csrfToken) {
      csrfToken = response.data.csrfToken;
      console.log(
        `✅ CSRF Token obtido do body: ${csrfToken.substring(0, 20)}...`
      );
    } else if (response.cookies && response.cookies["next-auth.csrf-token"]) {
      // Extrair token do cookie
      const cookieValue = decodeURIComponent(
        response.cookies["next-auth.csrf-token"]
      );
      csrfToken = cookieValue.split("|")[0];
      console.log(
        `✅ CSRF Token extraído do cookie: ${csrfToken.substring(0, 20)}...`
      );
    } else if (response.status === 302) {
      console.log(`⚠️ Redirect recebido (status 302)`);
      console.log(`   Location: ${response.headers.location}`);
      // Tentar extrair do cookie mesmo com redirect
      if (response.cookies && response.cookies["next-auth.csrf-token"]) {
        const cookieValue = decodeURIComponent(
          response.cookies["next-auth.csrf-token"]
        );
        csrfToken = cookieValue.split("|")[0];
        console.log(
          `✅ CSRF Token extraído do cookie (após redirect): ${csrfToken.substring(0, 20)}...`
        );
      }
    }

    if (!csrfToken) {
      console.log(`❌ Falha ao obter CSRF Token`);
      return null;
    }

    return { token: csrfToken, cookieHeader: response.cookieHeader };
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return null;
  }
}

// Teste 3: Verificar Providers
async function testProviders(tenantUrl) {
  console.log(`\n🔍 [TESTE 3] Verificando providers de ${tenantUrl}...`);
  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/providers`);

    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data) {
      const providers = Object.keys(response.data);
      console.log(`✅ Providers encontrados: ${providers.join(", ")}`);
      return providers;
    } else {
      console.log(`❌ Falha ao obter providers`);
      return [];
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return [];
  }
}

// Teste 4: Tentar fazer login
async function testLogin(tenantUrl, csrfToken, csrfCookieHeader = "") {
  console.log(`\n🔍 [TESTE 4] Tentando fazer login em ${tenantUrl}...`);

  const credentials = {
    email: TEST_CONFIG.credentials.email,
    name: TEST_CONFIG.credentials.name,
    password: TEST_CONFIG.credentials.password || "",
    csrfToken: csrfToken || "",
    redirect: "false",
    callbackUrl: `${tenantUrl}/admin`,
    json: "true",
  };

  // Criar form data
  const formData = new URLSearchParams(credentials).toString();

  try {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": formData.length.toString(),
    };

    // Adicionar cookies CSRF se disponíveis
    if (csrfCookieHeader) {
      headers["Cookie"] = csrfCookieHeader;
    }

    const response = await makeRequest(
      `${tenantUrl}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    console.log(`\n   📊 RESPOSTA COMPLETA:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Headers:`, JSON.stringify(response.headers, null, 2));
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));
    console.log(`   Raw Data:`, response.rawData);

    // Verificar cookies
    const cookies = response.headers["set-cookie"] || [];
    const sessionCookie = cookies.find(c =>
      c.includes("next-auth.session-token")
    );

    if (sessionCookie) {
      console.log(`\n✅ Cookie de sessão encontrado!`);
      console.log(`   Cookie: ${sessionCookie.substring(0, 50)}...`);
    } else {
      console.log(`\n❌ Nenhum cookie de sessão encontrado`);
    }

    // Verificar se houve redirect
    if (response.status === 302) {
      const location = response.headers.location;
      console.log(`\n   🔀 Redirect para: ${location}`);

      if (
        location?.includes("/api/auth/signin") &&
        !location.includes("error")
      ) {
        console.log(
          `   ⚠️ Redirecionando para signin (authorize provavelmente não foi chamado ou retornou null)`
        );
      } else if (location?.includes("/admin")) {
        console.log(`   ✅ Redirecionando para /admin (sucesso!)`);
      }
    }

    return {
      success:
        response.status === 200 ||
        (response.status === 302 &&
          response.headers.location?.includes("/admin")),
      status: response.status,
      hasSessionCookie: !!sessionCookie,
      redirectUrl: response.headers.location,
      data: response.data,
    };
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Teste 5: Verificar sessão
async function testSession(tenantUrl, cookies) {
  console.log(`\n🔍 [TESTE 5] Verificando sessão em ${tenantUrl}...`);

  try {
    const cookieHeader = cookies.join("; ");
    const response = await makeRequest(`${tenantUrl}/api/auth/session`, {
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
      return true;
    } else {
      console.log(`❌ Sessão inválida ou não encontrada`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return false;
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
    tests: {},
  };

  // Teste 1: Servidor
  const serverOk = await testServer(tenantUrl);
  results.tests.server = { success: serverOk };

  if (!serverOk) {
    console.log(`\n❌ Servidor não está respondendo. Abortando testes.`);
    return results;
  }

  // Teste 2: CSRF Token
  const csrfResult = await testCsrfToken(tenantUrl);
  const csrfToken = csrfResult?.token || null;
  const csrfCookieHeader = csrfResult?.cookieHeader || "";
  results.tests.csrf = {
    success: !!csrfToken,
    token: csrfToken ? csrfToken.substring(0, 20) + "..." : null,
  };

  // Teste 3: Providers
  const providers = await testProviders(tenantUrl);
  results.tests.providers = { success: providers.length > 0, providers };

  // Teste 4: Login
  const loginResult = await testLogin(tenantUrl, csrfToken, csrfCookieHeader);
  results.tests.login = loginResult;

  // Teste 5: Sessão (se houver cookies)
  if (loginResult.hasSessionCookie && loginResult.success) {
    const cookies = loginResult.headers?.["set-cookie"] || [];
    const sessionOk = await testSession(tenantUrl, cookies);
    results.tests.session = { success: sessionOk };
  } else {
    results.tests.session = { success: false, reason: "Sem cookie de sessão" };
  }

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
  });

  // Salvar relatório JSON
  const reportData = {
    timestamp: new Date().toISOString(),
    summary,
    results: allResults,
  };

  const fs = require("fs");
  const reportPath = "test-login-report.json";
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
  if (TEST_CONFIG.defaultTenant !== false) {
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
      process.exit(1);
    });
}

module.exports = { runAllTests, testTenantComplete };
