const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_BARBER_IMAGES = [
  "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5heL6xqFaY08T2Xl3OGVyrkbWcAHSQzuBiDew",
  "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5Lds8GiMzFhV6fsG7iLg5rDx9CuHlwt1RdZeN",
  "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5hYKLNcoFaY08T2Xl3OGVyrkbWcAHSQzuBiDe",
];

const SERVICE_IMAGE_PLACEHOLDER = "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png";

async function fixImages() {
  try {
    console.log('🔧 Iniciando correção de imagens...\n');

    // Corrigir imagens de barbeiros
    console.log('📸 Corrigindo imagens de barbeiros...');
    const barbers = await prisma.barber.findMany();
    
    let barbersFixed = 0;
    for (const barber of barbers) {
      // Verificar se a foto é um caminho local
      if (barber.photo && (barber.photo.startsWith('/barbers/') || barber.photo.startsWith('/public/'))) {
        const randomImage = DEFAULT_BARBER_IMAGES[Math.floor(Math.random() * DEFAULT_BARBER_IMAGES.length)];
        await prisma.barber.update({
          where: { id: barber.id },
          data: { photo: randomImage }
        });
        console.log(`  ✅ Barbeiro "${barber.name}" - imagem atualizada`);
        barbersFixed++;
      }
    }
    console.log(`\n✨ ${barbersFixed} barbeiros corrigidos\n`);

    // Corrigir imagens de serviços
    console.log('🛠️  Corrigindo imagens de serviços...');
    const services = await prisma.barberShopService.findMany();
    
    let servicesFixed = 0;
    for (const service of services) {
      // Verificar se a imageUrl é um caminho local
      if (service.imageUrl && (service.imageUrl.startsWith('/services/') || service.imageUrl.startsWith('/public/'))) {
        await prisma.barberShopService.update({
          where: { id: service.id },
          data: { imageUrl: SERVICE_IMAGE_PLACEHOLDER }
        });
        console.log(`  ✅ Serviço "${service.name}" - imagem atualizada`);
        servicesFixed++;
      }
    }
    console.log(`\n✨ ${servicesFixed} serviços corrigidos\n`);

    // Corrigir imagens de usuários vinculados a barbeiros
    console.log('👤 Corrigindo imagens de usuários...');
    const users = await prisma.user.findMany({
      where: { role: 'Barbeiro' }
    });
    
    let usersFixed = 0;
    for (const user of users) {
      if (user.image && (user.image.startsWith('/barbers/') || user.image.startsWith('/public/'))) {
        const randomImage = DEFAULT_BARBER_IMAGES[Math.floor(Math.random() * DEFAULT_BARBER_IMAGES.length)];
        await prisma.user.update({
          where: { id: user.id },
          data: { image: randomImage }
        });
        console.log(`  ✅ Usuário "${user.name}" - imagem atualizada`);
        usersFixed++;
      }
    }
    console.log(`\n✨ ${usersFixed} usuários corrigidos\n`);

    console.log('🎉 Correção de imagens concluída com sucesso!');
    console.log(`\nResumo:`);
    console.log(`  - ${barbersFixed} barbeiros`);
    console.log(`  - ${servicesFixed} serviços`);
    console.log(`  - ${usersFixed} usuários`);

  } catch (error) {
    console.error('❌ Erro ao corrigir imagens:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixImages()
  .then(() => {
    console.log('\n✅ Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

