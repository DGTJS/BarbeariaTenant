#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function updateEnvironment() {
  console.log('🔧 Atualizando Configuração do Mercado Pago');
  console.log('==========================================\n');

  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Arquivo .env.local não encontrado!');
    console.log('Execute: npm run setup:env');
    rl.close();
    return;
  }

  console.log('📝 Digite suas credenciais do Mercado Pago:');
  console.log('   (Obtenha em: https://www.mercadopago.com.br/developers)\n');

  const clientId = await question('🔑 Client ID: ');
  const clientSecret = await question('🔐 Client Secret: ');

  if (!clientId || !clientSecret) {
    console.log('❌ Client ID e Client Secret são obrigatórios!');
    rl.close();
    return;
  }

  // Ler arquivo atual
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Substituir valores
  envContent = envContent.replace(/SEU_CLIENT_ID_AQUI/g, clientId);
  envContent = envContent.replace(/SEU_CLIENT_SECRET_AQUI/g, clientSecret);

  // Salvar arquivo atualizado
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Arquivo .env.local atualizado com sucesso!');
    console.log('📁 Localização:', envPath);
    
    console.log('\n🔄 Próximos passos:');
    console.log('1. Reinicie o servidor: npm run dev');
    console.log('2. Acesse: http://localhost:3000/admin/settings');
    console.log('3. Clique em "Testar Configuração"');
    console.log('4. Configure Redirect URI no Mercado Pago:');
    console.log('   http://localhost:3000/api/mercadopago/callback');
    console.log('5. Clique em "Conectar Mercado Pago"');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar arquivo:', error.message);
  }

  rl.close();
}

updateEnvironment().catch(console.error);





