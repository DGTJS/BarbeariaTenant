const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultConfigs = [
  // Informações da barbearia
  { key: 'barbershop_name', value: 'BarberBoss', type: 'string' },
  { key: 'barbershop_address', value: '', type: 'string' },
  { key: 'barbershop_email', value: '', type: 'string' },
  { key: 'barbershop_phone', value: '', type: 'string' },
  { key: 'barbershop_description', value: '', type: 'string' },
  
  // Logo e favicon
  { key: 'barbershop_logo_base64', value: '', type: 'string' },
  { key: 'barbershop_logo_width', value: '0', type: 'number' },
  { key: 'barbershop_logo_height', value: '0', type: 'number' },
  { key: 'barbershop_favicon_base64', value: '', type: 'string' },
  { key: 'barbershop_favicon_ico', value: '', type: 'string' },
  { key: 'barbershop_favicon_width', value: '0', type: 'number' },
  { key: 'barbershop_favicon_height', value: '0', type: 'number' },
  
  // Horários de funcionamento
  { key: 'working_days', value: '[1,2,3,4,5]', type: 'array' }, // Segunda a sexta
  { key: 'working_hours_start', value: '08:00', type: 'string' },
  { key: 'working_hours_end', value: '18:00', type: 'string' },
  { key: 'custom_schedules', value: '[]', type: 'array' }, // Horários personalizados
  
  // SEO
  { key: 'seo_title', value: 'BarberBoss - Barbearia Premium', type: 'string' },
  { key: 'seo_description', value: 'A melhor barbearia da cidade. Corte de cabelo, barba e muito mais.', type: 'string' },
  { key: 'seo_keywords', value: 'barbearia, corte de cabelo, barba, masculino, premium', type: 'string' },
  
  // Cores do tema
  { key: 'primary_color', value: '#7f00e6', type: 'color' },
  { key: 'secondary_color', value: '#7f00e6', type: 'color' },
  { key: 'accent_color', value: '#7f00e6', type: 'color' },
  { key: 'background_color', value: '#101828', type: 'color' },
  { key: 'foreground_color', value: '#ffffff', type: 'color' },
  { key: 'muted_color', value: '#1f2937', type: 'color' },
  { key: 'muted_foreground_color', value: '#9ca3af', type: 'color' },
  { key: 'border_color', value: '#374151', type: 'color' },
  { key: 'card_color', value: '#101828', type: 'color' },
  { key: 'card_foreground_color', value: '#ffffff', type: 'color' }
];

async function initializeSiteConfig() {
  try {
    console.log('🚀 Inicializando configurações do site...');
    
    for (const config of defaultConfigs) {
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: { 
          value: config.value, 
          type: config.type,
          updatedAt: new Date()
        },
        create: {
          key: config.key,
          value: config.value,
          type: config.type
        }
      });
      
      console.log(`✅ Configuração ${config.key} inicializada`);
    }
    
    console.log('🎉 Todas as configurações foram inicializadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar configurações:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeSiteConfig();
