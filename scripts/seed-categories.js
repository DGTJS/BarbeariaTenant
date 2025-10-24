const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🎨 Criando categorias de serviços...\n');

  try {
    const categories = [
      {
        name: 'Cabelo',
        IconUrl: '/IconCategorycabelo.svg',
        description: 'Serviços relacionados a cabelo'
      },
      {
        name: 'Barba',
        IconUrl: '/IconCategoryBarba.svg',
        description: 'Serviços de barba e bigode'
      },
      {
        name: 'Sobrancelha',
        IconUrl: '/IconCategorySobrancelha.svg',
        description: 'Design e limpeza de sobrancelhas'
      },
      {
        name: 'Tratamentos',
        IconUrl: '/icons/treatments.svg',
        description: 'Tratamentos capilares e faciais'
      },
      {
        name: 'Combo',
        IconUrl: '/icons/combo.svg',
        description: 'Pacotes combinados de serviços'
      }
    ];

    let created = 0;
    for (const category of categories) {
      const existing = await prisma.barberCategory.findFirst({
        where: { name: category.name }
      });

      if (!existing) {
        await prisma.barberCategory.create({
          data: category
        });
        created++;
        console.log(`✅ Categoria criada: ${category.name}`);
      } else {
        console.log(`ℹ️  Categoria já existe: ${category.name}`);
      }
    }

    console.log(`\n🎉 ${created} novas categorias criadas!`);

    // Associar serviços existentes às categorias
    console.log('\n🔗 Associando serviços às categorias...\n');

    const services = await prisma.barberShopService.findMany();
    const categoriesMap = await prisma.barberCategory.findMany();

    let associated = 0;
    for (const service of services) {
      let categoryId = null;

      if (service.name.toLowerCase().includes('corte')) {
        categoryId = categoriesMap.find(c => c.name === 'Cabelo')?.id;
      } else if (service.name.toLowerCase().includes('barba')) {
        categoryId = categoriesMap.find(c => c.name === 'Barba')?.id;
      } else if (service.name.toLowerCase().includes('sobrancelha')) {
        categoryId = categoriesMap.find(c => c.name === 'Sobrancelha')?.id;
      } else if (service.name.toLowerCase().includes('combo') || service.name.includes('+')) {
        categoryId = categoriesMap.find(c => c.name === 'Combo')?.id;
      }

      if (categoryId && !service.categoryId) {
        await prisma.barberShopService.update({
          where: { id: service.id },
          data: { categoryId }
        });
        associated++;
        console.log(`✅ ${service.name} → ${categoriesMap.find(c => c.id === categoryId)?.name}`);
      }
    }

    console.log(`\n🎉 ${associated} serviços associados a categorias!`);

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


