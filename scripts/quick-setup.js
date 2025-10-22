#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Template do .env.local
const envTemplate = `# Mercado Pago Configuration
# Obtenha essas credenciais em: https://www.mercadopago.com.br/developers
MERCADOPAGO_CLIENT_ID=SEU_CLIENT_ID_AQUI
MERCADOPAGO_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID=SEU_CLIENT_ID_AQUI

# App URL (para callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET=GERADO_AUTOMATICAMENTE
NEXTAUTH_URL=http://localhost:3000

# Generated on: ${new Date().toISOString()}
`;

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Verificar se já existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local já existe!');
    console.log('📝 Abra o arquivo e substitua os valores:');
    console.log('   - SEU_CLIENT_ID_AQUI → Seu Client ID do Mercado Pago');
    console.log('   - SEU_CLIENT_SECRET_AQUI → Seu Client Secret do Mercado Pago');
    console.log('   - GERADO_AUTOMATICAMENTE → Um secret aleatório');
    return;
  }

  // Gerar NextAuth Secret
  const authSecret = generateRandomSecret();
  const envContent = envTemplate.replace('GERADO_AUTOMATICAMENTE', authSecret);

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env.local criado!');
    console.log('📁 Localização:', envPath);
    console.log('🔑 NextAuth Secret gerado:', authSecret);
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. Abra o arquivo .env.local');
    console.log('2. Substitua SEU_CLIENT_ID_AQUI pelo seu Client ID');
    console.log('3. Substitua SEU_CLIENT_SECRET_AQUI pelo seu Client Secret');
    console.log('4. Reinicie o servidor: npm run dev');
    console.log('5. Acesse: http://localhost:3000/admin/settings');
    console.log('6. Configure Redirect URI no Mercado Pago:');
    console.log('   http://localhost:3000/api/mercadopago/callback');
  } catch (error) {
    console.error('❌ Erro ao criar arquivo:', error.message);
  }
}

function generateRandomSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

createEnvFile();

