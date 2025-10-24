const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  try {
    console.log('🧹 Iniciando limpeza de duplicados...\n');

    // 1. Encontrar e manter apenas uma barbearia
    console.log('📍 Consolidando barbearias...');
    const barbershops = await prisma.barberShop.findMany();
    console.log(`  Encontradas ${barbershops.length} barbearias`);

    if (barbershops.length > 1) {
      const mainBarbershop = barbershops[0];
      console.log(`  Mantendo: "${mainBarbershop.name}" (ID: ${mainBarbershop.id})`);

      // Mover todos os barbeiros para a barbearia principal
      for (let i = 1; i < barbershops.length; i++) {
        await prisma.barber.updateMany({
          where: { barberShopId: barbershops[i].id },
          data: { barberShopId: mainBarbershop.id }
        });
      }

      // Mover todos os serviços para a barbearia principal
      for (let i = 1; i < barbershops.length; i++) {
        await prisma.barberShopService.updateMany({
          where: { barberShopId: barbershops[i].id },
          data: { barberShopId: mainBarbershop.id }
        });
      }

      // Deletar barbearias extras
      for (let i = 1; i < barbershops.length; i++) {
        await prisma.barberShop.delete({
          where: { id: barbershops[i].id }
        });
        console.log(`  ✅ Removida: "${barbershops[i].name}"`);
      }
    } else {
      console.log('  ✅ Já existe apenas uma barbearia');
    }

    // 2. Remover serviços duplicados (mesmo nome)
    console.log('\n🔍 Buscando serviços duplicados...');
    const allServices = await prisma.barberShopService.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const servicesByName = new Map();
    const duplicatesToDelete = [];

    for (const service of allServices) {
      const key = service.name.toLowerCase().trim();
      if (servicesByName.has(key)) {
        // É duplicado, marcar para deletar
        duplicatesToDelete.push(service.id);
        console.log(`  ❌ Duplicado encontrado: "${service.name}" (ID: ${service.id})`);
      } else {
        // Primeiro com este nome, manter
        servicesByName.set(key, service);
        console.log(`  ✅ Mantendo: "${service.name}" (ID: ${service.id})`);
      }
    }

    // Deletar duplicados
    if (duplicatesToDelete.length > 0) {
      // Para cada duplicado, migrar bookings para o serviço mantido
      for (const duplicateId of duplicatesToDelete) {
        const duplicate = allServices.find(s => s.id === duplicateId);
        const key = duplicate.name.toLowerCase().trim();
        const keptService = servicesByName.get(key);

        // Migrar bookings
        await prisma.booking.updateMany({
          where: { serviceId: duplicateId },
          data: { serviceId: keptService.id }
        });

        // Deletar opções do duplicado
        await prisma.serviceOption.deleteMany({
          where: { serviceId: duplicateId }
        });
      }

      // Depois deletar os serviços duplicados
      await prisma.barberShopService.deleteMany({
        where: { id: { in: duplicatesToDelete } }
      });
      console.log(`\n  ✨ ${duplicatesToDelete.length} serviços duplicados removidos`);
    } else {
      console.log('  ✅ Nenhum serviço duplicado encontrado');
    }

    // 3. Remover categorias duplicadas
    console.log('\n🏷️  Buscando categorias duplicadas...');
    const allCategories = await prisma.barberCategory.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const categoriesByName = new Map();
    const categoriesToDelete = [];

    for (const category of allCategories) {
      const key = category.name.toLowerCase().trim();
      if (categoriesByName.has(key)) {
        // É duplicado
        const kept = categoriesByName.get(key);
        
        // Migrar serviços para a categoria mantida
        await prisma.barberShopService.updateMany({
          where: { categoryId: category.id },
          data: { categoryId: kept.id }
        });

        categoriesToDelete.push(category.id);
        console.log(`  ❌ Duplicado encontrado: "${category.name}" (ID: ${category.id})`);
      } else {
        categoriesByName.set(key, category);
        console.log(`  ✅ Mantendo: "${category.name}" (ID: ${category.id})`);
      }
    }

    if (categoriesToDelete.length > 0) {
      await prisma.barberCategory.deleteMany({
        where: { id: { in: categoriesToDelete } }
      });
      console.log(`\n  ✨ ${categoriesToDelete.length} categorias duplicadas removidas`);
    } else {
      console.log('  ✅ Nenhuma categoria duplicada encontrada');
    }

    // Resumo final
    const finalBarbershops = await prisma.barberShop.count();
    const finalServices = await prisma.barberShopService.count();
    const finalCategories = await prisma.barberCategory.count();
    const finalBarbers = await prisma.barber.count();

    console.log('\n📊 Resumo Final:');
    console.log(`  - Barbearias: ${finalBarbershops}`);
    console.log(`  - Serviços: ${finalServices}`);
    console.log(`  - Categorias: ${finalCategories}`);
    console.log(`  - Barbeiros: ${finalBarbers}`);

    console.log('\n✅ Limpeza concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante limpeza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates()
  .then(() => {
    console.log('\n✅ Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

