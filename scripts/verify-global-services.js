const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function verifyGlobalServices() {
  try {
    console.log('🔍 Verificando sistema de serviços globais...');
    
    // 1. Verificar barbearia global
    const globalBarberShop = await prisma.barberShop.findFirst({
      where: { name: 'Serviços Globais' }
    });

    if (!globalBarberShop) {
      console.error('❌ Barbearia global não encontrada!');
      return;
    }

    console.log(`✅ Barbearia global encontrada: ${globalBarberShop.name} (ID: ${globalBarberShop.id})`);

    // 2. Verificar serviços globais
    const globalServices = await prisma.barberShopService.findMany({
      where: {
        barberShopId: globalBarberShop.id,
        status: true
      },
      include: {
        category: true,
        barberShop: true
      }
    });

    console.log(`📊 Serviços globais encontrados: ${globalServices.length}`);
    
    if (globalServices.length === 0) {
      console.error('❌ Nenhum serviço global encontrado!');
      return;
    }

    // 3. Listar serviços globais
    console.log('\n📋 Serviços globais:');
    globalServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name}`);
      console.log(`      - Categoria: ${service.category?.name || 'Sem categoria'}`);
      console.log(`      - Preço: R$ ${service.price}`);
      console.log(`      - Duração: ${service.duration} minutos`);
      console.log(`      - ID: ${service.id}`);
    });

    // 4. Verificar barbearias regulares
    const regularBarberShops = await prisma.barberShop.findMany({
      where: {
        name: { not: 'Serviços Globais' },
        status: true
      }
    });

    console.log(`\n📊 Barbearias regulares: ${regularBarberShops.length}`);
    
    // 5. Verificar se não há serviços duplicados
    const allServices = await prisma.barberShopService.findMany({
      include: {
        barberShop: true,
        category: true
      }
    });

    const serviceNames = allServices.map(s => s.name);
    const uniqueServiceNames = [...new Set(serviceNames)];
    
    console.log(`\n📊 Verificação de duplicatas:`);
    console.log(`   - Total de serviços: ${allServices.length}`);
    console.log(`   - Nomes únicos: ${uniqueServiceNames.length}`);
    
    if (serviceNames.length === uniqueServiceNames.length) {
      console.log('   ✅ Nenhuma duplicata encontrada!');
    } else {
      console.log('   ⚠️  Possíveis duplicatas encontradas!');
    }

    // 6. Verificar categorias
    const categories = await prisma.barberCategory.findMany();
    console.log(`\n📊 Categorias: ${categories.length}`);
    
    // 7. Verificar barbeiros
    const barbers = await prisma.barber.findMany();
    console.log(`📊 Barbeiros: ${barbers.length}`);

    console.log('\n🎉 Verificação concluída!');
    console.log('\n📝 Resumo:');
    console.log(`   - ✅ Barbearia global: ${globalBarberShop.name}`);
    console.log(`   - ✅ Serviços globais: ${globalServices.length}`);
    console.log(`   - ✅ Barbearias regulares: ${regularBarberShops.length}`);
    console.log(`   - ✅ Categorias: ${categories.length}`);
    console.log(`   - ✅ Barbeiros: ${barbers.length}`);
    console.log(`   - ✅ Total de serviços: ${allServices.length}`);

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a verificação
verifyGlobalServices()
  .then(() => {
    console.log('✅ Verificação executada com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro ao executar verificação:', error);
    process.exit(1);
  });
