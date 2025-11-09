const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Configurando sistema completo da barbearia...\n');
    
    // Configurações completas do sistema
    const allConfigs = [
      // ===== INFORMAÇÕES DA BARBEARIA =====
      { key: 'barbershop_name', value: 'BarberBoss Premium', type: 'string', description: 'Nome da barbearia' },
      { key: 'barbershop_phone', value: '(11) 98765-4321', type: 'string', description: 'Telefone de contato' },
      { key: 'barbershop_email', value: 'contato@barberboss.com', type: 'string', description: 'E-mail de contato' },
      { key: 'barbershop_description', value: 'A melhor barbearia da cidade! Cortes modernos e atendimento de qualidade.', type: 'string', description: 'Descrição da barbearia' },
      
      // ===== ENDEREÇO =====
      { key: 'barbershop_street', value: 'Rua das Flores', type: 'string', description: 'Rua/Avenida' },
      { key: 'barbershop_number', value: '123', type: 'string', description: 'Número' },
      { key: 'barbershop_complement', value: '', type: 'string', description: 'Complemento' },
      { key: 'barbershop_neighborhood', value: 'Centro', type: 'string', description: 'Bairro' },
      { key: 'barbershop_city', value: 'São Paulo', type: 'string', description: 'Cidade' },
      { key: 'barbershop_state', value: 'SP', type: 'string', description: 'Estado (UF)' },
      { key: 'barbershop_zipcode', value: '01310-100', type: 'string', description: 'CEP' },
      { key: 'barbershop_address', value: 'Rua das Flores, 123, Centro, São Paulo - SP', type: 'string', description: 'Endereço completo (legado)' },
      
      // ===== SEO =====
      { key: 'seo_title', value: 'BarberBoss Premium - Barbearia Moderna', type: 'string', description: 'Título SEO' },
      { key: 'seo_description', value: 'Cortes modernos, barba bem feita e atendimento de qualidade. Agende seu horário!', type: 'string', description: 'Descrição SEO' },
      { key: 'seo_keywords', value: 'barbearia, corte de cabelo, barba, masculino, são paulo', type: 'string', description: 'Palavras-chave SEO' },
      
      // ===== HORÁRIOS =====
      { key: 'working_days', value: '[1,2,3,4,5,6]', type: 'array', description: 'Dias de funcionamento (0=Dom, 1=Seg, ...6=Sáb)' },
      { key: 'working_hours_start', value: '09:00', type: 'string', description: 'Horário de abertura' },
      { key: 'working_hours_end', value: '19:00', type: 'string', description: 'Horário de fechamento' },
      
      // ===== TEMA - CORES PRINCIPAIS =====
      { key: 'primary_color', value: '#7f00e6', type: 'color', description: '🟣 Cor principal (roxo vibrante)' },
      { key: 'secondary_color', value: '#6b21a8', type: 'color', description: '🟣 Cor secundária (roxo escuro)' },
      { key: 'accent_color', value: '#9333ea', type: 'color', description: '🟣 Cor de destaque' },
      
      // ===== TEMA - FUNDOS E TEXTOS =====
      { key: 'background_color', value: '#0a0a0a', type: 'color', description: '⬛ Cor de fundo principal' },
      { key: 'foreground_color', value: '#fafafa', type: 'color', description: '⬜ Cor do texto principal' },
      { key: 'muted_color', value: '#27272a', type: 'color', description: '⬜ Cor neutra (fundo)' },
      { key: 'muted_foreground_color', value: '#a1a1aa', type: 'color', description: '⬜ Cor neutra (texto)' },
      
      // ===== TEMA - BORDAS E CARDS =====
      { key: 'border_color', value: '#27272a', type: 'color', description: '📦 Cor das bordas' },
      { key: 'card_color', value: '#18181b', type: 'color', description: '📦 Cor de fundo dos cards' },
      { key: 'card_foreground_color', value: '#fafafa', type: 'color', description: '📦 Cor do texto dos cards' },
      { key: 'card_secondary_color', value: '#1e1e23', type: 'color', description: '📦 Cor de fundo dos cards secundários' },
      { key: 'card_border_color', value: '#2d2d35', type: 'color', description: '📦 Cor da borda dos cards' },
      { key: 'foreground_muted_color', value: '#a8a8b3', type: 'color', description: '📝 Cor do texto secundário' },
      
      // ===== TEMA - CONFIGURAÇÕES GERAIS =====
      { key: 'theme_mode', value: 'dark', type: 'string', description: '🌙 Modo do tema' },
      { key: 'theme_name', value: 'Roxo Profissional', type: 'string', description: '🎨 Nome do tema' },
    ];

    console.log(`📋 Configurando ${allConfigs.length} configurações...\n`);

    let created = 0;
    let updated = 0;

    // Agrupar por categoria
    const categories = {
      '🏢 BARBEARIA': allConfigs.filter(c => c.key.startsWith('barbershop_') && !c.key.includes('street') && !c.key.includes('number') && !c.key.includes('city') && !c.key.includes('state') && !c.key.includes('zipcode') && !c.key.includes('neighborhood') && !c.key.includes('complement') && !c.key.includes('address')),
      '📍 ENDEREÇO': allConfigs.filter(c => c.key.includes('street') || c.key.includes('number') || c.key.includes('city') || c.key.includes('state') || c.key.includes('zipcode') || c.key.includes('neighborhood') || c.key.includes('complement') || c.key === 'barbershop_address'),
      '🔍 SEO': allConfigs.filter(c => c.key.startsWith('seo_')),
      '⏰ HORÁRIOS': allConfigs.filter(c => c.key.startsWith('working_')),
      '🎨 TEMA': allConfigs.filter(c => c.key.includes('color') || c.key.includes('theme')),
    };

    for (const [category, configs] of Object.entries(categories)) {
      console.log(`\n${category}`);
      console.log('─'.repeat(50));
      
      for (const config of configs) {
        try {
          const result = await prisma.siteConfig.upsert({
            where: { key: config.key },
            update: { 
              value: config.value,
              type: config.type,
            },
            create: {
              key: config.key,
              value: config.value,
              type: config.type,
            },
          });

          const wasCreated = result.createdAt.getTime() === result.updatedAt.getTime();
          if (wasCreated) {
            created++;
            console.log(`   ✨ ${config.key.padEnd(30)} = ${config.value.substring(0, 30).padEnd(30)} (NOVO)`);
          } else {
            updated++;
            console.log(`   🔄 ${config.key.padEnd(30)} = ${config.value.substring(0, 30).padEnd(30)} (ATUALIZADO)`);
          }
        } catch (error) {
          console.error(`   ❌ Erro ao salvar ${config.key}:`, error.message);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`\n✅ Configuração completa finalizada!`);
    console.log(`   ${created} configurações criadas`);
    console.log(`   ${updated} configurações atualizadas`);
    console.log(`   ${created + updated} total de configurações\n`);

    // Verificar total no banco
    const totalInDb = await prisma.siteConfig.count();
    console.log(`📊 Total de configurações no banco: ${totalInDb}\n`);

    console.log('🎉 Sistema pronto para uso!\n');
    console.log('📝 Próximos passos:');
    console.log('   1. Acesse /admin/settings para personalizar');
    console.log('   2. Adicione sua logo e favicon');
    console.log('   3. Configure os horários de funcionamento');
    console.log('   4. Adicione seus barbeiros e serviços\n');

  } catch (error) {
    console.error('❌ Erro ao configurar sistema:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });



