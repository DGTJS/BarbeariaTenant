#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixEnvironment() {
  console.log('🔧 Corrigindo Configuração do Mercado Pago');
  console.log('==========================================\n');

  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Arquivo .env.local não encontrado!');
    console.log('Execute: npm run setup:env');
    return;
  }

  // Ler arquivo atual
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  console.log('📄 Conteúdo atual do .env.local:');
  console.log('================================');
  console.log(envContent);
  
  console.log('\n🚨 PROBLEMA IDENTIFICADO:');
  console.log('O arquivo .env.local ainda contém valores de template!');
  console.log('Você precisa substituir manualmente:');
  console.log('');
  console.log('1. Abra o arquivo .env.local');
  console.log('2. Substitua SEU_CLIENT_ID_AQUI pelo seu Client ID real');
  console.log('3. Substitua SEU_CLIENT_SECRET_AQUI pelo seu Client Secret real');
  console.log('4. Salve o arquivo');
  console.log('5. Reinicie o servidor: npm run dev');
  console.log('');
  console.log('📋 Para obter as credenciais:');
  console.log('1. Acesse: https://www.mercadopago.com.br/developers');
  console.log('2. Faça login com sua conta Mercado Pago');
  console.log('3. Vá em "Suas integrações" > "Criar aplicação"');
  console.log('4. Configure Redirect URI: http://localhost:3000/api/mercadopago/callback');
  console.log('5. Copie Client ID e Client Secret');
  console.log('');
  console.log('🔧 Exemplo de como deve ficar:');
  console.log('MERCADOPAGO_CLIENT_ID=1234567890abcdef');
  console.log('MERCADOPAGO_CLIENT_SECRET=abcdef1234567890');
  console.log('NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID=1234567890abcdef');
}

fixEnvironment();





