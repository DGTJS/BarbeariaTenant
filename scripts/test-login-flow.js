#!/usr/bin/env node

/**
 * Script para testar o fluxo de login completo nos tenants
 */

const http = require("http");

// Configurações
const BASE_URL = "http://localhost:3000";
const TENANTS = ["santos", "teste"]; // Adicione os subdomínios dos seus tenants

// Credenciais de teste
const TEST_CREDENTIALS = {
  email: "admin@barbearia.com",
  name: "Administrador",
  password: "", // Sem senha para admin
};

// Função para fazer requisição HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 3000,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const req = http.request(requestOptions, res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
          });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: data });
        }
      });
    });

    req.on("error", error => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Função para testar CSRF token
async function testCsrfToken(tenantUrl) {
  console.log(`\n🔐 [TEST] Testando CSRF token em ${tenantUrl}`);
  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/csrf`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, response.data);
    return response.data?.csrfToken || null;
  } catch (error) {
    console.error(`   ❌ Erro:`, error.message);
    return null;
  }
}

// Função para testar providers
async function testProviders(tenantUrl) {
  console.log(`\n📋 [TEST] Testando providers em ${tenantUrl}`);
  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/providers`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Providers:`, Object.keys(response.data || {}));
    return response.data;
  } catch (error) {
    console.error(`   ❌ Erro:`, error.message);
    return null;
  }
}

// Função para testar login
async function testLogin(tenantUrl, csrfToken) {
  console.log(`\n🔑 [TEST] Testando login em ${tenantUrl}`);
  console.log(`   Credenciais:`, TEST_CREDENTIALS);
  console.log(`   CSRF Token:`, csrfToken);

  try {
    // Primeiro, fazer POST para /api/auth/callback/credentials
    const formData = new URLSearchParams({
      email: TEST_CREDENTIALS.email,
      name: TEST_CREDENTIALS.name,
      password: TEST_CREDENTIALS.password || "",
      csrfToken: csrfToken || "",
      callbackUrl: `${tenantUrl}/admin`,
      json: "true",
    }).toString();

    const response = await makeRequest(
      `${tenantUrl}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    console.log(`   Status: ${response.status}`);
    console.log(`   Headers:`, response.headers);
    console.log(`   Data:`, response.data);

    // Verificar cookies
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      console.log(`   ✅ Cookies recebidos:`, setCookie);
    } else {
      console.log(`   ❌ Nenhum cookie recebido`);
    }

    return response;
  } catch (error) {
    console.error(`   ❌ Erro:`, error.message);
    return null;
  }
}

// Função para testar sessão
async function testSession(tenantUrl, cookies) {
  console.log(`\n👤 [TEST] Testando sessão em ${tenantUrl}`);
  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/session`, {
      headers: {
        Cookie: cookies || "",
      },
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Session:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`   ❌ Erro:`, error.message);
    return null;
  }
}

// Função principal de teste
async function testTenant(subdomain) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🧪 TESTANDO TENANT: ${subdomain}`);
  console.log(`${"=".repeat(60)}`);

  const tenantUrl = subdomain ? `http://${subdomain}.localhost:3000` : BASE_URL;
  console.log(`URL: ${tenantUrl}`);

  // 1. Testar CSRF token
  const csrfToken = await testCsrfToken(tenantUrl);

  // 2. Testar providers
  const providers = await testProviders(tenantUrl);

  // 3. Testar login
  const loginResponse = await testLogin(tenantUrl, csrfToken);

  // 4. Extrair cookies
  const cookies = loginResponse?.headers["set-cookie"]?.join("; ") || "";

  // 5. Testar sessão
  if (cookies) {
    await testSession(tenantUrl, cookies);
  }

  console.log(`\n✅ Teste do tenant ${subdomain || "default"} concluído`);
}

// Executar testes
async function runTests() {
  console.log("🚀 Iniciando testes de login...\n");

  // Testar tenant default (localhost)
  await testTenant(null);

  // Testar cada tenant
  for (const tenant of TENANTS) {
    await testTenant(tenant);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("✅ Todos os testes concluídos!");
  console.log(`${"=".repeat(60)}\n`);
}

// Executar
runTests().catch(console.error);


