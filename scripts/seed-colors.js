const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function seedColors() {
  try {
    console.log('🎨 Iniciando seed de cores...');
    
    // Limpar cores existentes
    await prisma.colorConfig.deleteMany({});
    console.log('✅ Cores existentes removidas');

    const defaultColors = [
      // Cores de Fundo
      { name: 'background-main', category: 'background', value: 'oklch(24.776% 0.00003 271.152)', description: 'Fundo principal da aplicação', order: 1 },
      { name: 'background-secondary', category: 'background', value: 'oklch(20% 0.00003 271.152)', description: 'Fundo secundário', order: 2 },
      { name: 'background-tertiary', category: 'background', value: 'oklch(16% 0.00003 271.152)', description: 'Fundo terciário', order: 3 },

      // Cores de Cards
      { name: 'card-main', category: 'card', value: 'oklch(0.205 0 0)', description: 'Card principal', order: 1 },
      { name: 'card-secondary', category: 'card', value: 'oklch(0.18 0 0)', description: 'Card secundário', order: 2 },
      { name: 'card-tertiary', category: 'card', value: 'oklch(0.15 0 0)', description: 'Card terciário', order: 3 },
      { name: 'card-hover', category: 'card', value: 'oklch(0.22 0 0)', description: 'Hover de cards', order: 4 },
      { name: 'card-border', category: 'card', value: 'oklch(1 0 0 / 10%)', description: 'Borda de cards', order: 5 },

      // Cores de Agendamento
      { name: 'booking-card', category: 'booking', value: 'oklch(0.19 0 0)', description: 'Card de agendamento', order: 1 },
      { name: 'booking-hover', category: 'booking', value: 'oklch(0.21 0 0)', description: 'Hover de card de agendamento', order: 2 },
      { name: 'booking-border', category: 'booking', value: 'oklch(1 0 0 / 8%)', description: 'Borda de card de agendamento', order: 3 },
      { name: 'booking-status-confirmed', category: 'booking', value: 'oklch(0.6 0.15 142)', description: 'Status confirmado', order: 4 },
      { name: 'booking-status-pending', category: 'booking', value: 'oklch(0.7 0.15 60)', description: 'Status pendente', order: 5 },
      { name: 'booking-status-cancelled', category: 'booking', value: 'oklch(0.6 0.2 20)', description: 'Status cancelado', order: 6 },

      // Cores de Texto
      { name: 'text-foreground', category: 'text', value: 'oklch(0.985 0 0)', description: 'Texto principal', order: 1 },
      { name: 'text-secondary', category: 'text', value: 'oklch(0.8 0 0)', description: 'Texto secundário', order: 2 },
      { name: 'text-muted', category: 'text', value: 'oklch(0.708 0 0)', description: 'Texto muted', order: 3 },
      { name: 'text-disabled', category: 'text', value: 'oklch(0.5 0 0)', description: 'Texto desabilitado', order: 4 },

      // Cores de Estado
      { name: 'state-success', category: 'state', value: 'oklch(0.6 0.15 142)', description: 'Cor de sucesso', order: 1 },
      { name: 'state-warning', category: 'state', value: 'oklch(0.7 0.15 60)', description: 'Cor de aviso', order: 2 },
      { name: 'state-error', category: 'state', value: 'oklch(0.704 0.191 22.216)', description: 'Cor de erro', order: 3 },
      { name: 'state-info', category: 'state', value: 'oklch(0.6 0.15 240)', description: 'Cor de informação', order: 4 },

      // Cores de Input
      { name: 'input-main', category: 'input', value: 'oklch(1 0 0 / 15%)', description: 'Input principal', order: 1 },
      { name: 'input-border', category: 'input', value: 'oklch(1 0 0 / 20%)', description: 'Borda de input', order: 2 },
      { name: 'input-focus', category: 'input', value: 'oklch(1 0 0 / 30%)', description: 'Focus de input', order: 3 },

      // Cores de Borda
      { name: 'border-main', category: 'border', value: 'oklch(1 0 0 / 10%)', description: 'Borda principal', order: 1 },
      { name: 'border-secondary', category: 'border', value: 'oklch(1 0 0 / 5%)', description: 'Borda secundária', order: 2 },
      { name: 'border-focus', category: 'border', value: 'oklch(0.556 0 0)', description: 'Borda de focus', order: 3 },

      // Cores Principais
      { name: 'primary-main', category: 'primary', value: 'oklch(59.568% 0.24705 294.351)', description: 'Cor primária', order: 1 },
      { name: 'primary-secondary', category: 'primary', value: 'oklch(0.269 0 0)', description: 'Cor secundária', order: 2 },
      { name: 'primary-accent', category: 'primary', value: 'oklch(0.269 0 0)', description: 'Cor de acento', order: 3 },
      { name: 'primary-accent-hover', category: 'primary', value: 'oklch(0.3 0 0)', description: 'Hover de acento', order: 4 }
    ];

    for (const color of defaultColors) {
      await prisma.colorConfig.create({ data: color });
      console.log(`✅ Cor criada: ${color.category}-${color.name}`);
    }

    console.log('🎉 Seed de cores concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed de cores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedColors();
