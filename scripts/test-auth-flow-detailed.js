#!/usr/bin/env node

/**
 * Script detalhado para testar o fluxo de autenticação completo
 * e descobrir onde está o problema
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");

// Configurações
const BASE_URL = "http://localhost:3000";
const TENANTS = ["santos"]; // Testar apenas um tenant por vez

// Credenciais de teste
const TEST_CREDENTIALS = {
  email: "admin@barbearia.com",
  name: "Administrador",
  password: "", // Sem senha para admin
};

// Função para fazer requisição HTTP com logs detalhados
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const httpModule = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "User-Agent": "Auth-Test-Script/1.0",
        ...options.headers,
      },
    };

    console.log("\n" + "=".repeat(80));
    console.log(`📡 [REQUEST] ${options.method || "GET"} ${url}`);
    console.log("─".repeat(80));
    console.log("Headers:", JSON.stringify(requestOptions.headers, null, 2));
    if (options.body) {
      console.log(
        "Body:",
        options.body.substring(0, 200) +
          (options.body.length > 200 ? "..." : "")
      );
    }
    console.log("─".repeat(80));

    const req = httpModule.request(requestOptions, res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`\n📥 [RESPONSE] Status: ${res.statusCode}`);
        console.log("Headers:", JSON.stringify(res.headers, null, 2));
        console.log("Body length:", data.length);

        let parsedData = data;
        try {
          parsedData = JSON.parse(data);
          console.log("Body (JSON):", JSON.stringify(parsedData, null, 2));
        } catch (e) {
          console.log(
            "Body (text):",
            data.substring(0, 500) + (data.length > 500 ? "..." : "")
          );
        }

        // Verificar cookies
        const setCookie = res.headers["set-cookie"];
        if (setCookie) {
          console.log("\n🍪 [COOKIES] Recebidos:");
          setCookie.forEach((cookie, index) => {
            console.log(`  ${index + 1}. ${cookie.substring(0, 100)}...`);
          });
        }

        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsedData,
          rawData: data,
        });
      });
    });

    req.on("error", error => {
      console.error(`\n❌ [ERROR] Request failed:`, error.message);
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Função para testar CSRF token
async function testCsrfToken(tenantUrl) {
  console.log("\n" + "🔐".repeat(40));
  console.log("TESTE 1: CSRF Token");
  console.log("🔐".repeat(40));

  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/csrf`);

    if (response.status === 200 && response.data?.csrfToken) {
      console.log("\n✅ CSRF Token obtido com sucesso");
      return response.data.csrfToken;
    } else {
      console.error("\n❌ Falha ao obter CSRF Token");
      return null;
    }
  } catch (error) {
    console.error("\n❌ Erro ao obter CSRF Token:", error.message);
    return null;
  }
}

// Função para testar providers
async function testProviders(tenantUrl) {
  console.log("\n" + "📋".repeat(40));
  console.log("TESTE 2: Providers");
  console.log("📋".repeat(40));

  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/providers`);

    if (response.status === 200 && response.data) {
      console.log("\n✅ Providers obtidos com sucesso");
      console.log("Providers disponíveis:", Object.keys(response.data));
      return response.data;
    } else {
      console.error("\n❌ Falha ao obter providers");
      return null;
    }
  } catch (error) {
    console.error("\n❌ Erro ao obter providers:", error.message);
    return null;
  }
}

// Função para testar login completo
async function testLogin(tenantUrl, csrfToken) {
  console.log("\n" + "🔑".repeat(40));
  console.log("TESTE 3: Login Completo");
  console.log("🔑".repeat(40));

  console.log("\n📝 Credenciais:");
  console.log("  Email:", TEST_CREDENTIALS.email);
  console.log("  Nome:", TEST_CREDENTIALS.name);
  console.log("  Password:", TEST_CREDENTIALS.password || "(vazio)");
  console.log("  CSRF Token:", csrfToken || "(ausente)");

  try {
    // Criar form data exatamente como o NextAuth espera
    const formData = new URLSearchParams({
      email: TEST_CREDENTIALS.email,
      name: TEST_CREDENTIALS.name,
      password: TEST_CREDENTIALS.password || "",
      csrfToken: csrfToken || "",
      callbackUrl: `${tenantUrl}/admin`,
      json: "true",
    });

    console.log("\n📤 Enviando POST para /api/auth/callback/credentials");
    console.log("Form data:", formData.toString());

    const response = await makeRequest(
      `${tenantUrl}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": formData.toString().length.toString(),
        },
        body: formData.toString(),
      }
    );

    console.log("\n📊 Análise da Resposta:");
    console.log("  Status:", response.status);

    if (response.status === 302) {
      const location = response.headers.location;
      console.log("  Location:", location);

      if (location && location.includes("/api/auth/signin")) {
        console.error("\n❌ PROBLEMA DETECTADO: Redirecionando para signin");
        console.error(
          "   Isso significa que o authorize retornou null ou não foi chamado"
        );
        console.error(
          "   Verifique os logs do servidor para ver se o authorize foi chamado"
        );
      } else if (location && location.includes("/admin")) {
        console.log("\n✅ Redirecionando para /admin (sucesso)");
      } else {
        console.log("\n⚠️  Redirecionando para:", location);
      }
    } else if (response.status === 200) {
      console.log("\n✅ Status 200 (pode ser sucesso)");
      console.log("  Response:", response.data);
    } else if (response.status === 401) {
      console.error("\n❌ Status 401 (não autorizado)");
      console.error("  Response:", response.data);
    } else {
      console.log("\n⚠️  Status inesperado:", response.status);
      console.log("  Response:", response.data);
    }

    // Verificar cookies de sessão
    const cookies = response.headers["set-cookie"];
    if (cookies) {
      const sessionCookie = cookies.find(c =>
        c.includes("next-auth.session-token")
      );
      if (sessionCookie) {
        console.log("\n✅ Cookie de sessão encontrado!");
      } else {
        console.log(
          "\n⚠️  Cookies recebidos mas nenhum cookie de sessão encontrado"
        );
      }
    } else {
      console.error("\n❌ Nenhum cookie recebido");
    }

    return response;
  } catch (error) {
    console.error("\n❌ Erro ao fazer login:", error.message);
    console.error("Stack:", error.stack);
    return null;
  }
}

// Função para testar sessão
async function testSession(tenantUrl, cookies) {
  console.log("\n" + "👤".repeat(40));
  console.log("TESTE 4: Verificar Sessão");
  console.log("👤".repeat(40));

  try {
    const cookieString = Array.isArray(cookies)
      ? cookies.join("; ")
      : cookies || "";

    console.log(
      "\n🍪 Cookies a enviar:",
      cookieString.substring(0, 200) + "..."
    );

    const response = await makeRequest(`${tenantUrl}/api/auth/session`, {
      headers: {
        Cookie: cookieString,
      },
    });

    console.log("\n📊 Análise da Sessão:");
    console.log("  Status:", response.status);

    if (response.status === 200 && response.data) {
      if (response.data.user) {
        console.log("\n✅ Sessão válida encontrada!");
        console.log("  User:", JSON.stringify(response.data.user, null, 2));
        return response.data;
      } else {
        console.error("\n❌ Sessão vazia (sem user)");
        console.log("  Response:", JSON.stringify(response.data, null, 2));
      }
    } else {
      console.error("\n❌ Falha ao obter sessão");
      console.log("  Response:", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("\n❌ Erro ao verificar sessão:", error.message);
    return null;
  }
}

// Função principal de teste
async function testTenant(subdomain) {
  console.log("\n" + "=".repeat(80));
  console.log("🧪 TESTANDO TENANT:", subdomain || "default");
  console.log("=".repeat(80));

  const tenantUrl = subdomain ? `http://${subdomain}.localhost:3000` : BASE_URL;
  console.log("URL:", tenantUrl);

  try {
    // 1. Testar CSRF token
    const csrfToken = await testCsrfToken(tenantUrl);
    if (!csrfToken) {
      console.error("\n❌ Não foi possível obter CSRF token. Abortando teste.");
      return;
    }

    // 2. Testar providers
    const providers = await testProviders(tenantUrl);
    if (!providers) {
      console.warn(
        "\n⚠️  Não foi possível obter providers, mas continuando..."
      );
    }

    // 3. Testar login
    const loginResponse = await testLogin(tenantUrl, csrfToken);
    if (!loginResponse) {
      console.error("\n❌ Falha no teste de login");
      return;
    }

    // 4. Extrair cookies
    const cookies = loginResponse.headers["set-cookie"];
    if (cookies && cookies.length > 0) {
      // 5. Testar sessão
      await testSession(tenantUrl, cookies);
    } else {
      console.error(
        "\n❌ Nenhum cookie recebido, não é possível testar sessão"
      );
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ Teste do tenant concluído");
    console.log("=".repeat(80));
  } catch (error) {
    console.error("\n" + "=".repeat(80));
    console.error("❌ ERRO NO TESTE:", error.message);
    console.error("Stack:", error.stack);
    console.log("=".repeat(80));
  }
}

// Executar testes
async function runTests() {
  console.log("\n" + "🚀".repeat(40));
  console.log("INICIANDO TESTES DE AUTENTICAÇÃO DETALHADOS");
  console.log("🚀".repeat(40));

  // Testar tenant default (localhost)
  await testTenant(null);

  // Testar cada tenant
  for (const tenant of TENANTS) {
    console.log("\n\n");
    await testTenant(tenant);
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ TODOS OS TESTES CONCLUÍDOS!");
  console.log("=".repeat(80));
  console.log("\n📋 RESUMO:");
  console.log(
    "  - Verifique os logs acima para identificar onde está o problema"
  );
  console.log(
    "  - Se o authorize não foi chamado, verifique os logs do servidor"
  );
  console.log(
    "  - Se o authorize foi chamado mas retornou null, verifique as credenciais"
  );
  console.log(
    "  - Se a sessão não foi criada, verifique os callbacks JWT e Session"
  );
  console.log("=".repeat(80) + "\n");
}

// Executar
runTests().catch(error => {
  console.error("\n❌ ERRO FATAL:", error);
  process.exit(1);
});


