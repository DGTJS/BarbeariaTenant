const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function seedThemes() {
  try {
    console.log('🎨 Iniciando seed de temas...');

    // Limpar temas existentes
    await prisma.theme.deleteMany({});
    console.log('✅ Temas existentes removidos');

    const themes = [
      {
        name: 'Dark Elegant',
        description: 'Tema escuro elegante com tons de azul e cinza',
        type: 'dark',
        isActive: true,
        colors: {
          // Cores de Fundo
          'background-main': 'oklch(0.08 0.005 240)',
          'background-secondary': 'oklch(0.12 0.005 240)',
          'background-tertiary': 'oklch(0.16 0.005 240)',
          
          // Cores de Cards
          'card-main': 'oklch(0.15 0.01 240)',
          'card-secondary': 'oklch(0.18 0.01 240)',
          'card-tertiary': 'oklch(0.12 0.01 240)',
          'card-hover': 'oklch(0.20 0.01 240)',
          'card-border': 'oklch(0.35 0.01 240)',
          
          // Cores de Agendamento
          'booking-card': 'oklch(0.14 0.01 240)',
          'booking-hover': 'oklch(0.17 0.01 240)',
          'booking-border': 'oklch(0.22 0.01 240)',
          'booking-status-confirmed': 'oklch(0.65 0.15 142)',
          'booking-status-pending': 'oklch(0.70 0.15 60)',
          'booking-status-cancelled': 'oklch(0.60 0.20 20)',
          
          // Cores de Texto
          'text-foreground': 'oklch(0.95 0.005 240)',
          'text-secondary': 'oklch(0.80 0.005 240)',
          'text-muted': 'oklch(0.65 0.005 240)',
          'text-disabled': 'oklch(0.45 0.005 240)',
          
          // Cores Principais
          'primary-main': 'oklch(0.60 0.20 240)',
          'primary-secondary': 'oklch(0.25 0.01 240)',
          'primary-accent': 'oklch(0.30 0.01 240)',
          'primary-accent-hover': 'oklch(0.35 0.01 240)',
          
          // Cores de Estado
          'state-success': 'oklch(0.65 0.15 142)',
          'state-warning': 'oklch(0.70 0.15 60)',
          'state-error': 'oklch(0.65 0.20 20)',
          'state-info': 'oklch(0.60 0.15 240)',
          
          // Cores de Input
          'input-main': 'oklch(0.20 0.01 240)',
          'input-border': 'oklch(0.30 0.01 240)',
          'input-focus': 'oklch(0.40 0.01 240)',
          
          // Cores de Borda
          'border-main': 'oklch(0.35 0.01 240)',
          'border-secondary': 'oklch(0.30 0.01 240)',
          'border-focus': 'oklch(0.50 0.01 240)'
        }
      },
      {
        name: 'Light Modern',
        description: 'Tema claro moderno com tons de azul e branco',
        type: 'light',
        isActive: false,
        colors: {
          // Cores de Fundo
          'background-main': 'oklch(0.98 0.005 240)',
          'background-secondary': 'oklch(0.95 0.005 240)',
          'background-tertiary': 'oklch(0.92 0.005 240)',
          
          // Cores de Cards
          'card-main': 'oklch(0.99 0.005 240)',
          'card-secondary': 'oklch(0.97 0.005 240)',
          'card-tertiary': 'oklch(0.94 0.005 240)',
          'card-hover': 'oklch(0.96 0.005 240)',
          'card-border': 'oklch(0.75 0.01 240)',
          
          // Cores de Agendamento
          'booking-card': 'oklch(0.98 0.005 240)',
          'booking-hover': 'oklch(0.96 0.005 240)',
          'booking-border': 'oklch(0.88 0.01 240)',
          'booking-status-confirmed': 'oklch(0.55 0.15 142)',
          'booking-status-pending': 'oklch(0.60 0.15 60)',
          'booking-status-cancelled': 'oklch(0.50 0.20 20)',
          
          // Cores de Texto - Escuras para tema claro
          'text-foreground': 'oklch(0.10 0.005 240)',
          'text-secondary': 'oklch(0.25 0.005 240)',
          'text-muted': 'oklch(0.40 0.005 240)',
          'text-disabled': 'oklch(0.60 0.005 240)',
          
          // Cores Principais
          'primary-main': 'oklch(0.50 0.20 240)',
          'primary-secondary': 'oklch(0.85 0.01 240)',
          'primary-accent': 'oklch(0.80 0.01 240)',
          'primary-accent-hover': 'oklch(0.75 0.01 240)',
          
          // Cores de Estado
          'state-success': 'oklch(0.55 0.15 142)',
          'state-warning': 'oklch(0.60 0.15 60)',
          'state-error': 'oklch(0.55 0.20 20)',
          'state-info': 'oklch(0.50 0.15 240)',
          
          // Cores de Input
          'input-main': 'oklch(0.95 0.005 240)',
          'input-border': 'oklch(0.80 0.01 240)',
          'input-focus': 'oklch(0.70 0.01 240)',
          
          // Cores de Borda
          'border-main': 'oklch(0.75 0.01 240)',
          'border-secondary': 'oklch(0.80 0.01 240)',
          'border-focus': 'oklch(0.60 0.01 240)'
        }
      },
      {
        name: 'Warm Dark',
        description: 'Tema escuro quente com tons de laranja e marrom',
        type: 'dark',
        isActive: false,
        colors: {
          // Cores de Fundo
          'background-main': 'oklch(0.10 0.01 30)',
          'background-secondary': 'oklch(0.14 0.01 30)',
          'background-tertiary': 'oklch(0.18 0.01 30)',
          
          // Cores de Cards
          'card-main': 'oklch(0.16 0.015 30)',
          'card-secondary': 'oklch(0.19 0.015 30)',
          'card-tertiary': 'oklch(0.13 0.015 30)',
          'card-hover': 'oklch(0.21 0.015 30)',
          'card-border': 'oklch(0.35 0.015 30)',
          
          // Cores de Agendamento
          'booking-card': 'oklch(0.15 0.015 30)',
          'booking-hover': 'oklch(0.18 0.015 30)',
          'booking-border': 'oklch(0.23 0.015 30)',
          'booking-status-confirmed': 'oklch(0.65 0.15 142)',
          'booking-status-pending': 'oklch(0.70 0.15 60)',
          'booking-status-cancelled': 'oklch(0.60 0.20 20)',
          
          // Cores de Texto
          'text-foreground': 'oklch(0.95 0.01 30)',
          'text-secondary': 'oklch(0.80 0.01 30)',
          'text-muted': 'oklch(0.65 0.01 30)',
          'text-disabled': 'oklch(0.45 0.01 30)',
          
          // Cores Principais
          'primary-main': 'oklch(0.65 0.20 30)',
          'primary-secondary': 'oklch(0.26 0.015 30)',
          'primary-accent': 'oklch(0.31 0.015 30)',
          'primary-accent-hover': 'oklch(0.36 0.015 30)',
          
          // Cores de Estado
          'state-success': 'oklch(0.65 0.15 142)',
          'state-warning': 'oklch(0.70 0.15 60)',
          'state-error': 'oklch(0.65 0.20 20)',
          'state-info': 'oklch(0.60 0.15 240)',
          
          // Cores de Input
          'input-main': 'oklch(0.21 0.015 30)',
          'input-border': 'oklch(0.31 0.015 30)',
          'input-focus': 'oklch(0.41 0.015 30)',
          
          // Cores de Borda
          'border-main': 'oklch(0.35 0.015 30)',
          'border-secondary': 'oklch(0.30 0.015 30)',
          'border-focus': 'oklch(0.51 0.015 30)'
        }
      },
      {
        name: 'Cool Light',
        description: 'Tema claro fresco com tons de verde e azul',
        type: 'light',
        isActive: false,
        colors: {
          // Cores de Fundo
          'background-main': 'oklch(0.98 0.005 180)',
          'background-secondary': 'oklch(0.95 0.005 180)',
          'background-tertiary': 'oklch(0.92 0.005 180)',
          
          // Cores de Cards
          'card-main': 'oklch(0.99 0.005 180)',
          'card-secondary': 'oklch(0.97 0.005 180)',
          'card-tertiary': 'oklch(0.94 0.005 180)',
          'card-hover': 'oklch(0.96 0.005 180)',
          'card-border': 'oklch(0.85 0.01 180)',
          
          // Cores de Agendamento
          'booking-card': 'oklch(0.98 0.005 180)',
          'booking-hover': 'oklch(0.96 0.005 180)',
          'booking-border': 'oklch(0.88 0.01 180)',
          'booking-status-confirmed': 'oklch(0.55 0.15 142)',
          'booking-status-pending': 'oklch(0.60 0.15 60)',
          'booking-status-cancelled': 'oklch(0.50 0.20 20)',
          
          // Cores de Texto - Escuras para tema claro
          'text-foreground': 'oklch(0.10 0.005 180)',
          'text-secondary': 'oklch(0.25 0.005 180)',
          'text-muted': 'oklch(0.40 0.005 180)',
          'text-disabled': 'oklch(0.60 0.005 180)',
          
          // Cores Principais
          'primary-main': 'oklch(0.50 0.20 180)',
          'primary-secondary': 'oklch(0.85 0.01 180)',
          'primary-accent': 'oklch(0.80 0.01 180)',
          'primary-accent-hover': 'oklch(0.75 0.01 180)',
          
          // Cores de Estado
          'state-success': 'oklch(0.55 0.15 142)',
          'state-warning': 'oklch(0.60 0.15 60)',
          'state-error': 'oklch(0.55 0.20 20)',
          'state-info': 'oklch(0.50 0.15 240)',
          
          // Cores de Input
          'input-main': 'oklch(0.95 0.005 180)',
          'input-border': 'oklch(0.80 0.01 180)',
          'input-focus': 'oklch(0.70 0.01 180)',
          
          // Cores de Borda
          'border-main': 'oklch(0.85 0.01 180)',
          'border-secondary': 'oklch(0.90 0.01 180)',
          'border-focus': 'oklch(0.60 0.01 180)'
        }
      }
    ];

    for (const theme of themes) {
      await prisma.theme.create({ data: theme });
      console.log(`✅ Tema criado: ${theme.name}`);
    }
    
    console.log('🎉 Seed de temas concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed de temas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedThemes();
