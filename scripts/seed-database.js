const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // 1. Limpar dados existentes (opcional - descomente se quiser resetar)
    // await prisma.booking.deleteMany();
    // await prisma.serviceOption.deleteMany();
    // await prisma.barberWorkingHour.deleteMany();
    // await prisma.barber.deleteMany();
    // await prisma.barberShopService.deleteMany();
    // await prisma.barberCategory.deleteMany();
    // await prisma.barberShop.deleteMany();
    // await prisma.siteConfig.deleteMany();

    // 2. Criar/Atualizar Barbearia
    console.log('📍 Criando barbearia...');
    const barberShop = await prisma.barberShop.upsert({
      where: { id: 'default-shop' },
      update: {},
      create: {
        id: 'default-shop',
        name: 'BarberBoss Premium',
        address: 'Rua das Flores, 123, Centro, São Paulo - SP',
        description: 'A melhor barbearia da cidade! Cortes modernos, barba bem feita e atendimento de qualidade.',
        phones: JSON.stringify(['(11) 98765-4321', '(11) 3456-7890']),
        imageUrl: 'https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png',
        rating: '4.8',
        status: true,
      },
    });
    console.log('✅ Barbearia criada!\n');

    // 3. Criar Categorias
    console.log('📂 Criando categorias...');
    const categories = [
      {
        id: 'cat-cabelo',
        name: 'Cabelo',
        IconUrl: 'https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png',
        description: 'Cortes de cabelo modernos e clássicos',
      },
      {
        id: 'cat-barba',
        name: 'Barba',
        IconUrl: 'https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png',
        description: 'Aparar e modelar barba',
      },
      {
        id: 'cat-sobrancelha',
        name: 'Sobrancelha',
        IconUrl: 'https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png',
        description: 'Design e modelagem de sobrancelhas',
      },
      {
        id: 'cat-acabamento',
        name: 'Acabamento',
        IconUrl: 'https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png',
        description: 'Pézinho e acabamentos finais',
      },
      {
        id: 'cat-massagem',
        name: 'Massagem',
        IconUrl: 'https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png',
        description: 'Massagens relaxantes',
      },
      {
        id: 'cat-hidratacao',
        name: 'Hidratação',
        IconUrl: 'https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png',
        description: 'Hidratação capilar e de barba',
      },
    ];

    for (const category of categories) {
      await prisma.barberCategory.upsert({
        where: { id: category.id },
        update: category,
        create: category,
      });
    }
    console.log(`✅ ${categories.length} categorias criadas!\n`);

    // 4. Criar Usuários para os Barbeiros
    console.log('👤 Criando usuários...');
    const users = [
      {
        id: 'user-joao',
        email: 'joao@barberboss.com',
        name: 'João Silva',
        role: 'Barbeiro',
      },
      {
        id: 'user-pedro',
        email: 'pedro@barberboss.com',
        name: 'Pedro Santos',
        role: 'Barbeiro',
      },
      {
        id: 'user-carlos',
        email: 'carlos@barberboss.com',
        name: 'Carlos Oliveira',
        role: 'Barbeiro',
      },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user,
      });
    }
    console.log(`✅ ${users.length} usuários criados!\n`);

    // 5. Criar Barbeiros
    console.log('💈 Criando barbeiros...');
    const barbers = [
      {
        id: 'barber-joao',
        name: 'João Silva',
        phone: '(11) 98765-4321',
        photo: 'https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png',
        userId: 'user-joao',
        barberShopId: barberShop.id,
        specialties: JSON.stringify(['Cortes Modernos', 'Degradê', 'Barba']),
        rating: 4.9,
      },
      {
        id: 'barber-pedro',
        name: 'Pedro Santos',
        phone: '(11) 98765-4322',
        photo: 'https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png',
        userId: 'user-pedro',
        barberShopId: barberShop.id,
        specialties: JSON.stringify(['Cortes Clássicos', 'Barba', 'Sobrancelha']),
        rating: 4.8,
      },
      {
        id: 'barber-carlos',
        name: 'Carlos Oliveira',
        phone: '(11) 98765-4323',
        photo: 'https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png',
        userId: 'user-carlos',
        barberShopId: barberShop.id,
        specialties: JSON.stringify(['Todos os Cortes', 'Hidratação', 'Massagem']),
        rating: 5.0,
      },
    ];

    for (const barber of barbers) {
      await prisma.barber.upsert({
        where: { id: barber.id },
        update: {},
        create: barber,
      });

      // Conectar barbeiro às categorias
      await prisma.barber.update({
        where: { id: barber.id },
        data: {
          categories: {
            connect: categories.map(cat => ({ id: cat.id })),
          },
        },
      });
    }
    console.log(`✅ ${barbers.length} barbeiros criados!\n`);

    // 6. Criar Horários de Trabalho
    console.log('🕐 Criando horários de trabalho...');
    const workingHours = [
      // Segunda a Sexta: 9h às 19h
      { weekday: 1, startTime: '09:00', endTime: '19:00' },
      { weekday: 2, startTime: '09:00', endTime: '19:00' },
      { weekday: 3, startTime: '09:00', endTime: '19:00' },
      { weekday: 4, startTime: '09:00', endTime: '19:00' },
      { weekday: 5, startTime: '09:00', endTime: '19:00' },
      // Sábado: 9h às 18h
      { weekday: 6, startTime: '09:00', endTime: '18:00' },
    ];

    for (const barber of barbers) {
      for (const wh of workingHours) {
        await prisma.barberWorkingHour.create({
          data: {
            barberId: barber.id,
            weekday: wh.weekday,
            startTime: wh.startTime,
            endTime: wh.endTime,
          },
        });
      }
    }
    console.log('✅ Horários de trabalho criados!\n');

    // 7. Criar Serviços
    console.log('✂️ Criando serviços...');
    const services = [
      {
        id: 'service-corte',
        name: 'Corte de Cabelo',
        description: 'Corte moderno e personalizado',
        price: 45.00,
        duration: 30,
        imageUrl: 'https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png',
        categoryId: 'cat-cabelo',
        barberShopId: barberShop.id,
        status: true,
      },
      {
        id: 'service-barba',
        name: 'Barba Completa',
        description: 'Aparar e modelar barba',
        price: 35.00,
        duration: 25,
        imageUrl: 'https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png',
        categoryId: 'cat-barba',
        barberShopId: barberShop.id,
        status: true,
      },
      {
        id: 'service-combo',
        name: 'Corte + Barba',
        description: 'Pacote completo',
        price: 70.00,
        duration: 50,
        imageUrl: 'https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png',
        categoryId: 'cat-cabelo',
        barberShopId: barberShop.id,
        status: true,
      },
      {
        id: 'service-sobrancelha',
        name: 'Design de Sobrancelha',
        description: 'Modelagem e design',
        price: 20.00,
        duration: 15,
        imageUrl: 'https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png',
        categoryId: 'cat-sobrancelha',
        barberShopId: barberShop.id,
        status: true,
      },
      {
        id: 'service-pezinho',
        name: 'Pézinho',
        description: 'Acabamento na nuca',
        price: 15.00,
        duration: 10,
        imageUrl: 'https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png',
        categoryId: 'cat-acabamento',
        barberShopId: barberShop.id,
        status: true,
      },
      {
        id: 'service-hidratacao',
        name: 'Hidratação Capilar',
        description: 'Hidratação profunda',
        price: 50.00,
        duration: 40,
        imageUrl: 'https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png',
        categoryId: 'cat-hidratacao',
        barberShopId: barberShop.id,
        status: true,
      },
    ];

    for (const service of services) {
      await prisma.barberShopService.upsert({
        where: { id: service.id },
        update: {},
        create: service,
      });
    }
    console.log(`✅ ${services.length} serviços criados!\n`);

    // 8. Criar Opções de Serviços
    console.log('🎨 Criando opções de serviços...');
    const serviceOptions = [
      // Opções para Corte de Cabelo
      {
        serviceId: 'service-corte',
        name: 'Degradê',
        description: 'Corte com degradê lateral',
        price: 45.00,
        duration: 30,
        status: true,
      },
      {
        serviceId: 'service-corte',
        name: 'Social',
        description: 'Corte social clássico',
        price: 40.00,
        duration: 25,
        status: true,
      },
      {
        serviceId: 'service-corte',
        name: 'Undercut',
        description: 'Corte undercut moderno',
        price: 50.00,
        duration: 35,
        status: true,
      },
      // Opções para Barba
      {
        serviceId: 'service-barba',
        name: 'Barba Completa',
        description: 'Barba completa com navalha',
        price: 35.00,
        duration: 25,
        status: true,
      },
      {
        serviceId: 'service-barba',
        name: 'Barba + Bigode',
        description: 'Barba e bigode',
        price: 40.00,
        duration: 30,
        status: true,
      },
    ];

    for (const option of serviceOptions) {
      await prisma.serviceOption.create({
        data: option,
      });
    }
    console.log(`✅ ${serviceOptions.length} opções de serviços criadas!\n`);

    // 9. Criar Configurações do Site
    console.log('⚙️ Criando configurações do site...');
    const siteConfigs = [
      { key: 'barbershop_name', value: 'BarberBoss Premium', type: 'string' },
      { key: 'barbershop_address', value: 'Rua das Flores, 123, Centro, São Paulo - SP', type: 'string' },
      { key: 'barbershop_email', value: 'contato@barberboss.com', type: 'string' },
      { key: 'barbershop_phone', value: '(11) 98765-4321', type: 'string' },
      { key: 'barbershop_description', value: 'A melhor barbearia da cidade!', type: 'string' },
      { key: 'seo_title', value: 'BarberBoss Premium - Barbearia Moderna', type: 'string' },
      { key: 'seo_description', value: 'Cortes modernos, barba bem feita e atendimento de qualidade.', type: 'string' },
      { key: 'seo_keywords', value: 'barbearia, corte de cabelo, barba, são paulo', type: 'string' },
      { key: 'primary_color', value: '#7f00e6', type: 'color' },
      { key: 'secondary_color', value: '#7f00e6', type: 'color' },
      { key: 'working_days', value: '[1,2,3,4,5,6]', type: 'array' },
    ];

    for (const config of siteConfigs) {
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: config,
      });
    }
    console.log(`✅ ${siteConfigs.length} configurações criadas!\n`);

    console.log('🎉 Seed concluído com sucesso!\n');
    console.log('📊 Resumo:');
    console.log(`   - 1 Barbearia`);
    console.log(`   - ${categories.length} Categorias`);
    console.log(`   - ${users.length} Usuários`);
    console.log(`   - ${barbers.length} Barbeiros`);
    console.log(`   - ${services.length} Serviços`);
    console.log(`   - ${serviceOptions.length} Opções de Serviços`);
    console.log(`   - ${siteConfigs.length} Configurações`);
    console.log(`   - ${barbers.length * workingHours.length} Horários de Trabalho\n`);
    console.log('✅ Banco de dados populado!\n');
    console.log('🚀 Inicie o projeto: npm run dev');
    console.log('🌐 Acesse: http://localhost:3000\n');

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
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

