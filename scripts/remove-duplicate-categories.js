const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Removendo categorias duplicadas...\n');

  try {
    // Buscar todas as categorias
    const categories = await prisma.barberCategory.findMany({
      include: {
        _count: {
          select: { services: true }
        }
      }
    });

    console.log(`📋 Total de categorias encontradas: ${categories.length}\n`);

    // Agrupar por nome
    const grouped = new Map();
    categories.forEach(cat => {
      if (!grouped.has(cat.name)) {
        grouped.set(cat.name, []);
      }
      grouped.get(cat.name).push(cat);
    });

    // Processar duplicadas
    let removed = 0;
    for (const [name, cats] of grouped.entries()) {
      if (cats.length > 1) {
        console.log(`⚠️  Categoria "${name}" duplicada ${cats.length} vezes`);
        
        // Manter a que tem mais serviços ou a mais antiga
        cats.sort((a, b) => {
          if (a._count.services !== b._count.services) {
            return b._count.services - a._count.services;
          }
          return a.createdAt - b.createdAt;
        });

        const toKeep = cats[0];
        const toRemove = cats.slice(1);

        console.log(`   ✅ Mantendo: ${toKeep.id} (${toKeep._count.services} serviços)`);

        for (const cat of toRemove) {
          // Atualizar serviços para a categoria mantida
          if (cat._count.services > 0) {
            await prisma.barberShopService.updateMany({
              where: { categoryId: cat.id },
              data: { categoryId: toKeep.id }
            });
            console.log(`   📦 Movidos ${cat._count.services} serviços de ${cat.id} para ${toKeep.id}`);
          }

          // Remover categoria duplicada
          await prisma.barberCategory.delete({
            where: { id: cat.id }
          });
          console.log(`   🗑️  Removida: ${cat.id}`);
          removed++;
        }
        console.log('');
      }
    }

    console.log(`\n🎉 ${removed} categorias duplicadas removidas!`);

    // Listar categorias finais
    const final = await prisma.barberCategory.findMany({
      include: {
        _count: {
          select: { services: true }
        }
      }
    });

    console.log('\n📊 Categorias finais:');
    final.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat._count.services} serviços`);
    });

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


