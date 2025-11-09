/**
 * Script para testar login e isolamento de tenants
 * Execute este script no console do navegador quando estiver em santos.localhost:3000
 *
 * Copie e cole este código no console do navegador (F12)
 */

(async function testTenantIsolation() {
  console.log(
    "%c🧪 TESTE DE ISOLAMENTO DE TENANTS",
    "color: cyan; font-size: 16px; font-weight: bold"
  );
  console.log("=".repeat(60));

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  function logSuccess(message) {
    console.log(`%c✅ ${message}`, "color: green");
    results.passed++;
  }

  function logError(message) {
    console.log(`%c❌ ${message}`, "color: red");
    results.failed++;
  }

  function logWarning(message) {
    console.log(`%c⚠️  ${message}`, "color: orange");
    results.warnings++;
  }

  function logInfo(message) {
    console.log(`%cℹ️  ${message}`, "color: blue");
  }

  // Teste 1: Verificar hostname atual
  console.log(
    "\n%cTeste 1: Verificação de hostname",
    "color: cyan; font-weight: bold"
  );
  const currentHostname = window.location.hostname;
  const currentPort = window.location.port;
  const fullHostname = `${currentHostname}${currentPort ? `:${currentPort}` : ""}`;

  logInfo(`Hostname atual: ${fullHostname}`);

  if (fullHostname.includes("santos.localhost")) {
    logSuccess("Estamos no tenant santos");
  } else if (fullHostname.includes("localhost")) {
    logWarning("Estamos no tenant padrão (não no santos)");
  } else {
    logError(`Hostname inesperado: ${fullHostname}`);
  }

  // Teste 2: Verificar cookies de sessão
  console.log(
    "\n%cTeste 2: Verificação de cookies",
    "color: cyan; font-weight: bold"
  );
  const allCookies = document.cookie
    .split(";")
    .map(c => c.trim())
    .filter(c => c);
  logInfo(`Total de cookies: ${allCookies.length}`);

  if (allCookies.length === 0) {
    logWarning("⚠️ NENHUM COOKIE ENCONTRADO no navegador!");
    logWarning("Isso pode significar:");
    logWarning("  1. Você não está logado");
    logWarning("  2. Os cookies estão bloqueados pelo navegador");
    logWarning("  3. Os cookies foram limpos");
    logWarning(
      "  4. O cookie está marcado como HttpOnly (não visível via JavaScript)"
    );
  } else {
    logInfo("Cookies encontrados:");
    allCookies.forEach(cookie => {
      const [name, value] = cookie.split("=");
      logInfo(`  - ${name}${value ? ` (${value.length} chars)` : ""}`);
    });
  }

  const sessionCookies = allCookies.filter(c =>
    c.includes("next-auth.session-token")
  );
  logInfo(`Cookies de sessão encontrados: ${sessionCookies.length}`);

  if (sessionCookies.length === 0) {
    logError("❌ PROBLEMA: Nenhum cookie de sessão encontrado!");
    logError(
      "Isso significa que você NÃO está logado ou o cookie não foi criado."
    );
    logError("SOLUÇÃO: Faça login novamente e verifique os logs do servidor.");
  } else {
    sessionCookies.forEach(cookie => {
      const [name] = cookie.split("=");
      logInfo(`  - ${name}`);

      if (name.includes(".santos")) {
        logSuccess(`✅ Cookie do tenant santos encontrado: ${name}`);
      } else if (
        name === "next-auth.session-token" ||
        name === "__Secure-next-auth.session-token"
      ) {
        logWarning(
          `⚠️ Cookie padrão encontrado (sem sufixo de tenant): ${name}`
        );
        logWarning("⚠️ PROBLEMA: Cookie não tem sufixo do tenant!");
        logWarning(
          "⚠️ Isso pode causar problemas de isolamento entre tenants!"
        );
      }
    });
  }

  // Verificar cookies HttpOnly via requisição fetch (cookies HttpOnly não aparecem em document.cookie)
  logInfo("\nVerificando cookies HttpOnly via requisição fetch...");
  try {
    const testResponse = await fetch("/api/auth/session");
    logInfo(`Status da requisição: ${testResponse.status}`);

    // Os cookies HttpOnly só são enviados automaticamente pelo navegador
    // Não podemos ler diretamente, mas podemos verificar se a sessão existe
    if (testResponse.status === 200) {
      const sessionData = await testResponse.json();
      if (sessionData && sessionData.user) {
        logSuccess(
          "✅ Cookie HttpOnly está presente (sessão válida encontrada)"
        );
        logInfo(`   User: ${sessionData.user.email || sessionData.user.name}`);
      } else {
        logWarning("⚠️ Requisição retornou 200 mas não há sessão válida");
      }
    } else {
      logWarning(`⚠️ Requisição retornou status ${testResponse.status}`);
    }
  } catch (error) {
    logError(`Erro ao verificar cookies HttpOnly: ${error.message}`);
  }

  // Teste 3: Verificar sessão atual
  console.log(
    "\n%cTeste 3: Verificação de sessão",
    "color: cyan; font-weight: bold"
  );
  try {
    const sessionResponse = await fetch("/api/auth/session");
    const sessionData = await sessionResponse.json();

    if (sessionData && sessionData.user) {
      logSuccess(
        `Sessão ativa para: ${sessionData.user.email || sessionData.user.name}`
      );
      logInfo(`User ID: ${sessionData.user.id}`);
      logInfo(`Role: ${sessionData.user.role}`);
    } else {
      logWarning("Nenhuma sessão ativa");
    }
  } catch (error) {
    logError(`Erro ao verificar sessão: ${error.message}`);
  }

  // Teste 4: Verificar endpoint /api/user/history
  console.log(
    "\n%cTeste 4: Teste do endpoint /api/user/history",
    "color: cyan; font-weight: bold"
  );
  try {
    const historyResponse = await fetch("/api/user/history");
    const historyData = await historyResponse.json();

    logInfo(`Status: ${historyResponse.status}`);

    if (historyResponse.status === 401) {
      logWarning("Endpoint requer autenticação (normal se não estiver logado)");
    } else if (historyResponse.status === 200) {
      logSuccess(
        `Endpoint retornou ${Array.isArray(historyData) ? historyData.length : 0} agendamentos`
      );

      // Verificar se os dados estão vazios (esperado se não houver agendamentos no tenant correto)
      if (Array.isArray(historyData) && historyData.length === 0) {
        logInfo("Nenhum agendamento encontrado (pode ser normal)");
      }
    } else {
      logError(`Status inesperado: ${historyResponse.status}`);
    }
  } catch (error) {
    logError(`Erro ao testar endpoint: ${error.message}`);
  }

  // Teste 5: Verificar isolamento entre tenants
  console.log(
    "\n%cTeste 5: Teste de isolamento entre tenants",
    "color: cyan; font-weight: bold"
  );

  // Tentar acessar endpoint do tenant default enquanto estamos no santos
  if (fullHostname.includes("santos.localhost")) {
    logInfo("Tentando acessar endpoint do tenant padrão...");

    try {
      // Fazer requisição para localhost:3000 (tenant padrão)
      const defaultResponse = await fetch(
        "http://localhost:3000/api/auth/session",
        {
          credentials: "include",
        }
      );

      const defaultData = await defaultResponse.json();

      if (defaultData && defaultData.user) {
        logError("⚠️ PROBLEMA: Sessão está ativa no tenant padrão também!");
        logError("Isso indica que os tenants NÃO estão isolados!");
        logError(
          `User no tenant padrão: ${defaultData.user.email || defaultData.user.name}`
        );
      } else {
        logSuccess(
          "Sessão NÃO está ativa no tenant padrão (isolamento funcionando)"
        );
      }
    } catch (error) {
      // Erro de CORS é esperado e indica isolamento
      if (
        error.message.includes("CORS") ||
        error.message.includes("Failed to fetch")
      ) {
        logSuccess(
          "Erro de CORS ao acessar outro tenant (isolamento funcionando)"
        );
      } else {
        logWarning(`Erro ao testar isolamento: ${error.message}`);
      }
    }
  } else {
    logWarning("Este teste só funciona quando estamos no tenant santos");
  }

  // Resumo
  console.log("\n" + "=".repeat(60));
  console.log("%c📊 RESUMO DOS TESTES", "color: cyan; font-weight: bold");
  console.log("=".repeat(60));
  console.log(`%c✅ Testes passados: ${results.passed}`, "color: green");
  console.log(`%c❌ Testes falhados: ${results.failed}`, "color: red");
  console.log(`%c⚠️  Avisos: ${results.warnings}`, "color: orange");

  const totalTests = results.passed + results.failed + results.warnings;
  if (totalTests > 0) {
    const successRate = ((results.passed / totalTests) * 100).toFixed(1);
    console.log(`\nTaxa de sucesso: ${successRate}%`);
  }

  // Instruções
  console.log(
    "\n%c📝 INSTRUÇÕES PARA TESTE COMPLETO:",
    "color: cyan; font-weight: bold"
  );
  console.log("1. Abra o DevTools (F12) no navegador");
  console.log("2. Vá para a aba Console");
  console.log("3. Cole este código completo e pressione Enter");
  console.log("4. Verifique os resultados dos testes");
  console.log("5. Se algum teste falhar, copie os logs e envie para análise");

  return results;
})();
