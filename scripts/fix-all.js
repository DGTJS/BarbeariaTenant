const { execSync } = require('child_process');

console.log('🔧 Iniciando correção completa do banco de dados...\n');

try {
  // Corrigir imagens
  console.log('📸 Etapa 1/2: Corrigindo imagens...');
  execSync('node scripts/fix-images.js', { stdio: 'inherit' });
  console.log('\n');

  // Corrigir ícones
  console.log('🎨 Etapa 2/2: Corrigindo ícones...');
  execSync('node scripts/fix-category-icons.js', { stdio: 'inherit' });
  console.log('\n');

  console.log('✅ Correção completa finalizada com sucesso!');
  console.log('\n💡 Dica: Reinicie o servidor de desenvolvimento para ver as mudanças.');
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ Erro durante a correção:', error.message);
  process.exit(1);
}

