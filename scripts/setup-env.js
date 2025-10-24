#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 Configuração Automática do Ambiente');
  console.log('=====================================\n');

  // Verificar se .env.local já existe
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local já existe. Deseja sobrescrever? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Operação cancelada.');
      rl.close();
      return;
    }
  }

  console.log('📝 Preencha as informações do Mercado Pago:');
  console.log('   (Deixe em branco para usar valores padrão)\n');

  // Coletar informações
  const clientId = await question('🔑 Client ID do Mercado Pago: ');
  const clientSecret = await question('🔐 Client Secret do Mercado Pago: ');
  const appUrl = await question('🌐 URL da aplicação (padrão: http://localhost:3000): ') || 'http://localhost:3000';
  const nextAuthSecret = await question('🔒 NextAuth Secret (deixe em branco para gerar automaticamente): ');
  const databaseUrl = await question('🗄️  Database URL (padrão: file:./dev.db): ') || 'file:./dev.db';

  // Gerar NextAuth Secret se não fornecido
  const authSecret = nextAuthSecret || generateRandomSecret();

  // Criar conteúdo do .env.local
  const envContent = `# Mercado Pago Configuration
# Obtenha essas credenciais em: https://www.mercadopago.com.br/developers
MERCADOPAGO_CLIENT_ID=${clientId}
MERCADOPAGO_CLIENT_SECRET=${clientSecret}
NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID=${clientId}

# App URL (para callbacks)
NEXT_PUBLIC_APP_URL=${appUrl}

# Database
DATABASE_URL="${databaseUrl}"

# NextAuth
NEXTAUTH_SECRET=${authSecret}
NEXTAUTH_URL=${appUrl}

# Generated on: ${new Date().toISOString()}
`;

  // Salvar arquivo
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Arquivo .env.local criado com sucesso!');
    console.log('📁 Localização:', envPath);
    
    if (!nextAuthSecret) {
      console.log('🔑 NextAuth Secret gerado automaticamente:', authSecret);
    }
    
    console.log('\n🔄 Próximos passos:');
    console.log('1. Reinicie o servidor: npm run dev');
    console.log('2. Acesse: http://localhost:3000/admin/settings');
    console.log('3. Clique em "Testar Configuração"');
    console.log('4. Configure o Redirect URI no Mercado Pago:');
    console.log(`   ${appUrl}/api/mercadopago/callback`);
    
  } catch (error) {
    console.error('❌ Erro ao criar arquivo:', error.message);
  }

  rl.close();
}

function generateRandomSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Executar se chamado diretamente
if (require.main === module) {
  setupEnvironment().catch(console.error);
}

module.exports = { setupEnvironment };





