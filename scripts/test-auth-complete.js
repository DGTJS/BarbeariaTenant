#!/usr/bin/env node

/**
 * Script COMPLETO de teste de autenticação - Varredura de ponta a ponta
 * Testa TODOS os cenários possíveis para descobrir o erro
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");

// Configurações
const BASE_URL = "http://localhost:3000";
const TENANTS = ["santos", "teste"]; // Testar múltiplos tenants

// Credenciais de teste
const TEST_CREDENTIALS = {
  email: "admin@barbearia.com",
  name: "Administrador",
  password: "",
};

// Estatísticas
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  errors: [],
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

    const req = httpModule.request(requestOptions, res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        let parsedData = data;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          // Manter como texto
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
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Teste 1: Verificar se o servidor está rodando
async function testServer(tenantUrl) {
  console.log("\n🔍 [TESTE 1] Verificando servidor...");
  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/providers`);
    if (response.status === 200) {
      console.log("✅ Servidor respondendo");
      return true;
    }
    console.log(`❌ Servidor retornou status ${response.status}`);
    return false;
  } catch (error) {
    console.log(`❌ Erro ao conectar: ${error.message}`);
    return false;
  }
}

// Teste 2: Obter CSRF Token
async function testCsrfToken(tenantUrl) {
  console.log("\n🔍 [TESTE 2] Obtendo CSRF Token...");
  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/csrf`);
    if (response.status === 200 && response.data?.csrfToken) {
      console.log(
        `✅ CSRF Token obtido: ${response.data.csrfToken.substring(0, 20)}...`
      );
      return response.data.csrfToken;
    }
    console.log(`❌ Falha ao obter CSRF Token`);
    return null;
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return null;
  }
}

// Teste 3: Verificar Providers
async function testProviders(tenantUrl) {
  console.log("\n🔍 [TESTE 3] Verificando Providers...");
  try {
    const response = await makeRequest(`${tenantUrl}/api/auth/providers`);
    if (response.status === 200 && response.data) {
      const providers = Object.keys(response.data);
      console.log(`✅ Providers encontrados: ${providers.join(", ")}`);

      if (!providers.includes("credentials")) {
        console.log("❌ Provider 'credentials' não encontrado!");
        return false;
      }

      // Verificar detalhes do provider credentials
      const credsProvider = response.data.credentials;
      if (credsProvider) {
        console.log(`   Signin URL: ${credsProvider.signinUrl}`);
        console.log(`   Callback URL: ${credsProvider.callbackUrl}`);
      }

      return true;
    }
    console.log(`❌ Falha ao obter providers`);
    return false;
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return false;
  }
}

// Teste 4: Testar login com diferentes formatos de body
async function testLoginVariations(tenantUrl, csrfToken) {
  console.log("\n🔍 [TESTE 4] Testando diferentes formatos de login...");
  console.log(
    "\n⚠️  ATENÇÃO: Verifique os logs do servidor durante este teste!"
  );
  console.log("   Os logs devem mostrar se o authorize está sendo chamado.\n");

  const variations = [
    {
      name: "Form data padrão (com json=true)",
      body: new URLSearchParams({
        email: TEST_CREDENTIALS.email,
        name: TEST_CREDENTIALS.name,
        password: TEST_CREDENTIALS.password || "",
        csrfToken: csrfToken || "",
        callbackUrl: `${tenantUrl}/admin`,
        json: "true",
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
    {
      name: "Form data sem json",
      body: new URLSearchParams({
        email: TEST_CREDENTIALS.email,
        name: TEST_CREDENTIALS.name,
        password: TEST_CREDENTIALS.password || "",
        csrfToken: csrfToken || "",
        callbackUrl: `${tenantUrl}/admin`,
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  ];

  for (const variation of variations) {
    console.log(`\n  📝 Testando: ${variation.name}`);
    console.log(`     Body: ${variation.body.substring(0, 100)}...`);

    try {
      const startTime = Date.now();
      const response = await makeRequest(
        `${tenantUrl}/api/auth/callback/credentials`,
        {
          method: "POST",
          headers: {
            ...variation.headers,
            "Content-Length": variation.body.length.toString(),
          },
          body: variation.body,
        }
      );
      const duration = Date.now() - startTime;

      console.log(`     Status: ${response.status}`);
      console.log(`     Tempo de resposta: ${duration}ms`);

      if (response.data?.url) {
        console.log(`     URL retornada: ${response.data.url}`);

        if (
          response.data.url.includes("/api/auth/signin") &&
          !response.data.url.includes("error")
        ) {
          console.log(
            `     ❌ Redirecionando para signin (authorize não chamado ou retornou null)`
          );
        } else if (response.data.url.includes("/admin")) {
          console.log(`     ✅ Redirecionando para /admin (sucesso!)`);

          // Verificar cookies de sessão
          const cookies = response.headers["set-cookie"];
          if (cookies) {
            const sessionCookie = cookies.find(c =>
              c.includes("next-auth.session-token")
            );
            if (sessionCookie) {
              console.log(`     ✅ Cookie de sessão encontrado!`);
              return { success: true, cookies, variation: variation.name };
            } else {
              console.log(
                `     ⚠️  Cookies recebidos mas sem cookie de sessão`
              );
            }
          } else {
            console.log(`     ❌ Nenhum cookie recebido`);
          }
        } else {
          console.log(`     ⚠️  Redirecionando para: ${response.data.url}`);
        }
      }

      // Verificar cookies mesmo se não houver URL
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        const sessionCookie = cookies.find(c =>
          c.includes("next-auth.session-token")
        );
        if (sessionCookie) {
          console.log(
            `     ✅ Cookie de sessão encontrado na variação: ${variation.name}`
          );
          return { success: true, cookies, variation: variation.name };
        }
      }

      // Se for redirect 302, verificar location header
      if (response.status === 302) {
        const location = response.headers.location;
        console.log(`     Location header: ${location}`);

        if (location && location.includes("/admin")) {
          console.log(`     ✅ Redirect 302 para /admin (sucesso!)`);
          const cookies = response.headers["set-cookie"];
          if (cookies) {
            const sessionCookie = cookies.find(c =>
              c.includes("next-auth.session-token")
            );
            if (sessionCookie) {
              console.log(`     ✅ Cookie de sessão encontrado!`);
              return { success: true, cookies, variation: variation.name };
            }
          }
        }
      }
    } catch (error) {
      console.log(`     ❌ Erro: ${error.message}`);
    }
  }

  return { success: false };
}

// Teste 5: Verificar sessão após login
async function testSession(tenantUrl, cookies) {
  console.log("\n🔍 [TESTE 5] Verificando sessão...");

  if (!cookies || cookies.length === 0) {
    console.log("❌ Nenhum cookie para testar");
    return false;
  }

  try {
    const cookieString = Array.isArray(cookies) ? cookies.join("; ") : cookies;

    const response = await makeRequest(`${tenantUrl}/api/auth/session`, {
      headers: {
        Cookie: cookieString,
      },
    });

    if (response.status === 200 && response.data) {
      if (response.data.user) {
        console.log(`✅ Sessão válida!`);
        console.log(`   User: ${JSON.stringify(response.data.user, null, 2)}`);
        return true;
      } else {
        console.log(`❌ Sessão vazia (sem user)`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
        return false;
      }
    } else {
      console.log(`❌ Status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return false;
  }
}

// Função principal de teste para um tenant
async function testTenantComplete(subdomain) {
  console.log("\n" + "=".repeat(100));
  console.log(`🧪 TESTE COMPLETO - TENANT: ${subdomain || "default"}`);
  console.log("=".repeat(100));

  const tenantUrl = subdomain ? `http://${subdomain}.localhost:3000` : BASE_URL;

  console.log(`URL: ${tenantUrl}`);
  stats.total++;

  try {
    // Teste 1: Servidor
    const serverOk = await testServer(tenantUrl);
    if (!serverOk) {
      console.log("\n❌ Servidor não está respondendo. Abortando testes.");
      stats.failed++;
      stats.errors.push(`${subdomain || "default"}: Servidor não responde`);
      return;
    }

    // Teste 2: CSRF Token
    const csrfToken = await testCsrfToken(tenantUrl);
    if (!csrfToken) {
      console.log("\n❌ Não foi possível obter CSRF token. Abortando testes.");
      stats.failed++;
      stats.errors.push(`${subdomain || "default"}: CSRF token não obtido`);
      return;
    }

    // Teste 3: Providers
    const providersOk = await testProviders(tenantUrl);
    if (!providersOk) {
      console.log("\n❌ Providers não estão configurados corretamente.");
      stats.failed++;
      stats.errors.push(
        `${subdomain || "default"}: Providers não configurados`
      );
      return;
    }

    // Teste 4: Login com variações
    console.log("\n" + "─".repeat(100));
    console.log("🔑 INICIANDO TESTES DE LOGIN");
    console.log("─".repeat(100));
    console.log("\n⚠️  CRÍTICO: Verifique os logs do servidor AGORA!");
    console.log(
      "   Os logs devem aparecer no terminal onde o servidor está rodando."
    );
    console.log("   Procure por: [NextAuth POST] e [NextAuth Authorize]\n");

    // Aguardar um pouco para o usuário verificar os logs
    await new Promise(resolve => setTimeout(resolve, 1000));

    const loginResult = await testLoginVariations(tenantUrl, csrfToken);

    if (loginResult.success) {
      console.log(
        `\n✅ Login bem-sucedido com variação: ${loginResult.variation}`
      );

      // Teste 5: Sessão
      const sessionOk = await testSession(tenantUrl, loginResult.cookies);

      if (sessionOk) {
        console.log("\n" + "✅".repeat(50));
        console.log(
          "✅✅✅ LOGIN COMPLETO E SESSÃO CRIADA COM SUCESSO! ✅✅✅"
        );
        console.log("✅".repeat(50));
        stats.success++;
      } else {
        console.log("\n⚠️  Login bem-sucedido mas sessão não foi criada");
        stats.failed++;
        stats.errors.push(`${subdomain || "default"}: Sessão não criada`);
      }
    } else {
      console.log("\n❌ Todas as variações de login falharam");
      console.log("\n" + "─".repeat(100));
      console.log("📋 DIAGNÓSTICO DETALHADO:");
      console.log("─".repeat(100));
      console.log("   1. ⚠️  O authorize NÃO está sendo chamado");
      console.log("   2. ⚠️  Ou o authorize está retornando null");
      console.log("\n   📝 LOGS DO SERVIDOR QUE VOCÊ DEVE PROCURAR:");
      console.log(
        "      ✅ [NextAuth POST] ========== INICIANDO POST =========="
      );
      console.log("      ✅ [NextAuth POST] Body (text raw):");
      console.log("      ✅ [NextAuth POST] Body (form data):");
      console.log("      ✅ [NextAuth POST] CompatibleReq.email:");
      console.log("      ✅ [NextAuth POST] Handler executado");
      console.log(
        "      ❌ [NextAuth Authorize] ========== INICIANDO =========="
      );
      console.log("\n   📝 SE OS LOGS NÃO APARECEREM:");
      console.log("      → O request não está chegando ao handler POST");
      console.log("      → Verifique se o servidor está rodando");
      console.log("      → Verifique se há erros no servidor");
      console.log(
        "\n   📝 SE [NextAuth POST] APARECER MAS [NextAuth Authorize] NÃO:"
      );
      console.log(
        "      → O NextAuth não está processando o body corretamente"
      );
      console.log("      → O body pode não estar no formato esperado");
      console.log("      → O NextAuth pode não estar reconhecendo o callback");
      console.log("─".repeat(100));

      stats.failed++;
      stats.errors.push(
        `${subdomain || "default"}: Login falhou em todas as variações`
      );
    }
  } catch (error) {
    console.error("\n❌ ERRO FATAL:", error.message);
    console.error("Stack:", error.stack);
    stats.failed++;
    stats.errors.push(`${subdomain || "default"}: ${error.message}`);
  }

  console.log("\n" + "=".repeat(100));
}

// Função para gerar relatório final
function generateReport() {
  console.log("\n" + "=".repeat(100));
  console.log("📊 RELATÓRIO FINAL");
  console.log("=".repeat(100));
  console.log(`Total de testes: ${stats.total}`);
  console.log(`Sucessos: ${stats.success}`);
  console.log(`Falhas: ${stats.failed}`);
  console.log(
    `Taxa de sucesso: ${((stats.success / stats.total) * 100).toFixed(2)}%`
  );

  if (stats.errors.length > 0) {
    console.log("\n❌ ERROS ENCONTRADOS:");
    stats.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  console.log("\n📋 PRÓXIMOS PASSOS:");
  if (stats.failed > 0) {
    console.log("   1. ⚠️  Execute o servidor em um terminal: npm run dev");
    console.log("   2. ⚠️  Execute este teste em outro terminal");
    console.log(
      "   3. ⚠️  Copie TODOS os logs do servidor que começam com [NextAuth]"
    );
    console.log("   4. ⚠️  Envie os logs para análise");
    console.log("\n   📝 LOGS IMPORTANTES A PROCURAR:");
    console.log("      - [NextAuth POST] ========== INICIANDO POST ==========");
    console.log("      - [NextAuth POST] Body (text raw):");
    console.log("      - [NextAuth POST] Body (form data):");
    console.log("      - [NextAuth POST] CompatibleReq.email:");
    console.log("      - [NextAuth POST] Handler executado");
    console.log("      - [NextAuth Authorize] ========== INICIANDO ==========");
    console.log("      - [NextAuth JWT] ========== JWT CALLBACK ==========");
    console.log(
      "      - [NextAuth Session] ========== SESSION CALLBACK =========="
    );
  } else {
    console.log("   ✅ Todos os testes passaram!");
  }

  console.log("=".repeat(100) + "\n");
}

// Executar todos os testes
async function runAllTests() {
  console.log("\n" + "🚀".repeat(50));
  console.log("INICIANDO TESTES COMPLETOS DE AUTENTICAÇÃO");
  console.log("🚀".repeat(50));
  console.log("\n📝 Credenciais de teste:");
  console.log(`   Email: ${TEST_CREDENTIALS.email}`);
  console.log(`   Nome: ${TEST_CREDENTIALS.name}`);
  console.log(`   Password: ${TEST_CREDENTIALS.password || "(vazio)"}`);
  console.log("\n⚠️  IMPORTANTE:");
  console.log(
    "   Certifique-se de que o servidor está rodando em outro terminal!"
  );
  console.log("   Execute: npm run dev");
  console.log("\n   📝 Durante os testes, verifique os logs do servidor!");
  console.log("   Os logs devem mostrar se o authorize está sendo chamado.");
  console.log("\n" + "─".repeat(100));

  // Aguardar 3 segundos para garantir que o usuário leu a mensagem
  console.log(
    "\n⏳ Aguardando 3 segundos para você verificar se o servidor está rodando..."
  );
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Testar tenant default
  await testTenantComplete(null);

  // Testar cada tenant
  for (const tenant of TENANTS) {
    console.log("\n\n");
    await testTenantComplete(tenant);
  }

  // Gerar relatório
  generateReport();
}

// Executar
runAllTests().catch(error => {
  console.error("\n❌ ERRO FATAL:", error);
  process.exit(1);
});
