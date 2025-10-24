const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeamento de opções por nome de serviço
const SERVICE_OPTIONS_MAP = {
  "Corte de Cabelo": [
    { name: "Degradê", description: "Corte com degradê nas laterais", price: 5, duration: 5 },
    { name: "Social", description: "Corte social clássico", price: 0, duration: 0 },
    { name: "Militar", description: "Corte militar curto", price: -2, duration: -5 },
    { name: "Moicano", description: "Corte moicano moderno", price: 10, duration: 10 },
    { name: "Undercut", description: "Corte undercut moderno", price: 8, duration: 7 },
    { name: "Pompadour", description: "Corte pompadour clássico", price: 12, duration: 10 }
  ],
  "Corte Masculino": [
    { name: "Degradê", description: "Corte com degradê nas laterais", price: 5, duration: 5 },
    { name: "Social", description: "Corte social clássico", price: 0, duration: 0 },
    { name: "Militar", description: "Corte militar curto", price: -2, duration: -5 },
    { name: "Moicano", description: "Corte moicano moderno", price: 10, duration: 10 },
    { name: "Undercut", description: "Corte undercut moderno", price: 8, duration: 7 },
    { name: "Pompadour", description: "Corte pompadour clássico", price: 12, duration: 10 }
  ],
  "Barba": [
    { name: "Barba Completa", description: "Aparar e modelar barba completa", price: 0, duration: 0 },
    { name: "Bigode", description: "Aparar e modelar bigode", price: -5, duration: -5 },
    { name: "Barba + Bigode", description: "Barba e bigode completos", price: 5, duration: 5 },
    { name: "Barba Riscada", description: "Barba com riscos e desenhos", price: 10, duration: 10 },
    { name: "Barba Longa", description: "Modelagem de barba longa", price: 3, duration: 5 }
  ],
  "Barba Completa": [
    { name: "Barba Completa", description: "Aparar e modelar barba completa", price: 0, duration: 0 },
    { name: "Bigode", description: "Aparar e modelar bigode", price: -5, duration: -5 },
    { name: "Barba + Bigode", description: "Barba e bigode completos", price: 5, duration: 5 },
    { name: "Barba Riscada", description: "Barba com riscos e desenhos", price: 10, duration: 10 },
    { name: "Barba Longa", description: "Modelagem de barba longa", price: 3, duration: 5 }
  ],
  "Sobrancelha": [
    { name: "Design Simples", description: "Design básico das sobrancelhas", price: 0, duration: 0 },
    { name: "Design Completo", description: "Design completo com modelagem", price: 6, duration: 5 },
    { name: "Henna", description: "Design com henna para realçar", price: 13, duration: 10 },
    { name: "Microblading", description: "Técnica de microblading", price: 23, duration: 30 }
  ],
  "Pézinho": [
    { name: "Pézinho Simples", description: "Acabamento básico do pézinho", price: 0, duration: 0 },
    { name: "Pézinho Detalhado", description: "Acabamento detalhado e preciso", price: 5, duration: 5 },
    { name: "Pézinho + Nuca", description: "Acabamento completo da nuca", price: 10, duration: 10 }
  ],
  "Acabamento": [
    { name: "Pézinho Simples", description: "Acabamento básico do pézinho", price: 0, duration: 0 },
    { name: "Pézinho Detalhado", description: "Acabamento detalhado e preciso", price: 5, duration: 5 },
    { name: "Pézinho + Nuca", description: "Acabamento completo da nuca", price: 10, duration: 10 }
  ],
  "Massagem": [
    { name: "Massagem Relaxante", description: "Massagem para relaxamento total", price: 0, duration: 0 },
    { name: "Massagem Terapêutica", description: "Massagem para alívio de tensões", price: 10, duration: 10 },
    { name: "Massagem Facial", description: "Massagem facial revitalizante", price: -5, duration: -5 },
    { name: "Massagem Capilar", description: "Massagem no couro cabeludo", price: -15, duration: -10 }
  ],
  "Hidratação": [
    { name: "Hidratação Básica", description: "Hidratação simples do cabelo", price: 0, duration: 0 },
    { name: "Hidratação Profunda", description: "Hidratação profunda e nutritiva", price: 10, duration: 10 },
    { name: "Hidratação + Barba", description: "Hidratação completa cabelo e barba", price: 15, duration: 15 },
    { name: "Tratamento Premium", description: "Tratamento premium com queratina", price: 25, duration: 25 }
  ],
  "Corte + Barba": [
    { name: "Combo Padrão", description: "Corte e barba padrão", price: 0, duration: 0 },
    { name: "Combo Degradê", description: "Corte degradê + barba completa", price: 10, duration: 10 },
    { name: "Combo Premium", description: "Corte e barba com acabamento premium", price: 15, duration: 15 }
  ],
  "Corte Infantil": [
    { name: "Corte Simples", description: "Corte infantil simples", price: 0, duration: 0 },
    { name: "Corte com Desenho", description: "Corte com desenho nas laterais", price: 10, duration: 10 }
  ]
};

async function seedServiceOptions() {
  try {
    console.log('🎨 Iniciando seed de opções de serviço...\n');

    // Buscar todos os serviços
    const services = await prisma.barberShopService.findMany();
    
    let totalOptionsCreated = 0;
    let servicesWithOptions = 0;

    for (const service of services) {
      // Verificar se já tem opções
      const existingOptions = await prisma.serviceOption.findMany({
        where: { serviceId: service.id }
      });

      if (existingOptions.length > 0) {
        console.log(`  ℹ️  Serviço "${service.name}" já possui ${existingOptions.length} opção(ões)`);
        continue;
      }

      // Buscar opções baseadas no nome do serviço
      const options = SERVICE_OPTIONS_MAP[service.name];

      if (!options) {
        // Criar opção padrão se não encontrar no mapa
        await prisma.serviceOption.create({
          data: {
            serviceId: service.id,
            name: "Padrão",
            description: "Serviço padrão",
            price: 0,
            duration: 0,
            status: true
          }
        });
        console.log(`  ✅ Serviço "${service.name}" - criada opção padrão`);
        totalOptionsCreated++;
        servicesWithOptions++;
        continue;
      }

      // Criar as opções
      for (const option of options) {
        await prisma.serviceOption.create({
          data: {
            serviceId: service.id,
            name: option.name,
            description: option.description,
            price: option.price,
            duration: option.duration,
            status: true
          }
        });
        totalOptionsCreated++;
      }

      console.log(`  ✅ Serviço "${service.name}" - ${options.length} opções criadas`);
      servicesWithOptions++;
    }

    console.log(`\n✨ Seed concluído com sucesso!`);
    console.log(`  - ${servicesWithOptions} serviços configurados`);
    console.log(`  - ${totalOptionsCreated} opções criadas`);

  } catch (error) {
    console.error('❌ Erro ao fazer seed de opções:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedServiceOptions()
  .then(() => {
    console.log('\n✅ Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

