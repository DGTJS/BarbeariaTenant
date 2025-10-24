const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando população do banco com dados de exemplo...\n');

  try {
    // 1. Verificar/Criar BarberShop
    console.log('🏪 Verificando barbearia...');
    let barberShop = await prisma.barberShop.findFirst();
    
    if (!barberShop) {
      barberShop = await prisma.barberShop.create({
        data: {
          name: 'Barbearia Exemplo',
          address: 'Rua Exemplo, 123 - São Paulo, SP',
          description: 'A melhor barbearia da região',
          phones: ['(11) 1234-5678'],
          rating: '4.8'
        }
      });
      console.log('✅ Barbearia criada');
    } else {
      console.log('✅ Barbearia já existe');
    }

    // 2. Criar usuários para os barbeiros
    console.log('\n👤 Criando usuários para barbeiros...');
    const barberUsers = [];
    
    const barberUserData = [
      { name: 'Carlos Santos', email: 'carlos@barbearia.com', phone: '(11) 98765-4321' },
      { name: 'Ana Costa', email: 'ana@barbearia.com', phone: '(11) 98765-4322' },
      { name: 'Pedro Silva', email: 'pedro@barbearia.com', phone: '(11) 98765-4323' }
    ];

    for (const userData of barberUserData) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
      barberUsers.push(user);
    }

    console.log(`✅ ${barberUsers.length} usuários de barbeiros criados`);

    // 3. Criar barbeiros
    console.log('\n📝 Criando barbeiros...');
    const barbers = [];

    for (let i = 0; i < barberUsers.length; i++) {
      const existingBarber = await prisma.barber.findUnique({
        where: { userId: barberUsers[i].id }
      });

      if (!existingBarber) {
        const barber = await prisma.barber.create({
          data: {
            name: barberUsers[i].name,
            phone: barberUsers[i].phone,
            photo: `/barbers/barber${i + 1}.jpg`,
            userId: barberUsers[i].id,
            barberShopId: barberShop.id
          }
        });
        barbers.push(barber);
      } else {
        barbers.push(existingBarber);
      }
    }

    console.log(`✅ ${barbers.length} barbeiros criados`);

    // 4. Criar serviços
    console.log('\n✂️ Criando serviços...');
    const services = [];
    
    const serviceData = [
      { name: 'Corte Masculino', description: 'Corte moderno e estiloso', price: 45, duration: 30, imageUrl: '/services/corte.jpg' },
      { name: 'Barba Completa', description: 'Barba desenhada e finalizada', price: 35, duration: 25, imageUrl: '/services/barba.jpg' },
      { name: 'Corte + Barba', description: 'Combo completo', price: 70, duration: 50, imageUrl: '/services/combo.jpg' },
      { name: 'Sobrancelha', description: 'Design de sobrancelhas', price: 20, duration: 15, imageUrl: '/services/sobrancelha.jpg' },
      { name: 'Corte Infantil', description: 'Corte para crianças', price: 30, duration: 30, imageUrl: '/services/infantil.jpg' }
    ];

    for (const service of serviceData) {
      const existing = await prisma.barberShopService.findFirst({
        where: { 
          name: service.name,
          barberShopId: barberShop.id
        }
      });

      if (!existing) {
        const created = await prisma.barberShopService.create({
          data: {
            ...service,
            barberShopId: barberShop.id
          }
        });
        services.push(created);
      } else {
        services.push(existing);
      }
    }

    console.log(`✅ ${services.length} serviços criados`);

    // 5. Criar usuários clientes
    console.log('\n👥 Criando clientes...');
    const clients = [];
    
    const clientData = [
      { name: 'João Silva', email: 'joao@example.com', phone: '(11) 91234-5678' },
      { name: 'Maria Santos', email: 'maria@example.com', phone: '(11) 91234-5679' },
      { name: 'José Oliveira', email: 'jose@example.com', phone: '(11) 91234-5680' },
      { name: 'Ana Paula', email: 'anapaula@example.com', phone: '(11) 91234-5681' },
      { name: 'Roberto Costa', email: 'roberto@example.com', phone: '(11) 91234-5682' }
    ];

    for (const clientUser of clientData) {
      const user = await prisma.user.upsert({
        where: { email: clientUser.email },
        update: {},
        create: clientUser
      });
      clients.push(user);
    }

    console.log(`✅ ${clients.length} clientes criados`);

    // 6. Criar agendamentos
    console.log('\n📅 Criando agendamentos...');
    
    const statuses = ['Confirmado', 'Confirmado', 'Confirmado', 'Concluído', 'Concluído'];
    let bookingsCreated = 0;

    for (let i = 0; i < 50; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const randomHour = Math.floor(Math.random() * 10) + 8;
      const randomMinute = Math.floor(Math.random() * 2) * 30;
      
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() - randomDaysAgo);
      bookingDate.setHours(randomHour, randomMinute, 0, 0);

      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const randomBarber = barbers[Math.floor(Math.random() * barbers.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      try {
        await prisma.booking.create({
          data: {
            userId: randomClient.id,
            barberId: randomBarber.id,
            serviceId: randomService.id,
            dateTime: bookingDate,
            status: randomStatus
          }
        });
        bookingsCreated++;
      } catch (error) {
        // Ignora erros
      }
    }

    console.log(`✅ ${bookingsCreated} agendamentos criados`);

    // 7. Adicionar avaliações aos agendamentos concluídos
    console.log('\n⭐ Adicionando avaliações...');
    
    const completedBookings = await prisma.booking.findMany({
      where: { status: 'Concluído' }
    });

    let ratingsCreated = 0;
    const comments = [
      'Excelente atendimento!',
      'Muito bom, recomendo!',
      'Profissional top!',
      'Adorei o resultado',
      'Voltarei com certeza'
    ];

    for (const booking of completedBookings) {
      if (!booking.rating) {
        try {
          const randomRating = Math.floor(Math.random() * 2) + 4;
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              rating: randomRating,
              comment: comments[Math.floor(Math.random() * comments.length)]
            }
          });
          ratingsCreated++;
        } catch (error) {
          // Ignora erros
        }
      }
    }

    console.log(`✅ ${ratingsCreated} avaliações adicionadas`);

    console.log('\n🎉 População do banco concluída com sucesso!');
    console.log(`
📊 Resumo:
   - Barbearia: ${barberShop.name}
   - Barbeiros: ${barbers.length}
   - Serviços: ${services.length}
   - Clientes: ${clients.length}
   - Agendamentos: ${bookingsCreated}
   - Avaliações: ${ratingsCreated}
    `);

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
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
