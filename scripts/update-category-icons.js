const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCategoryIcons() {
  try {
    console.log('🔄 Atualizando ícones das categorias...');

    // Atualizar categoria Combo
    const comboCategory = await prisma.barberCategory.findFirst({
      where: { name: { contains: 'Combo', mode: 'insensitive' } }
    });

    if (comboCategory) {
      await prisma.barberCategory.update({
        where: { id: comboCategory.id },
        data: { IconUrl: 'lucide:Package' }
      });
      console.log('✅ Categoria Combo atualizada com ícone Package');
    } else {
      console.log('⚠️  Categoria Combo não encontrada');
    }

    // Atualizar categoria Tratamento/Tratamentos
    const treatmentCategory = await prisma.barberCategory.findFirst({
      where: { 
        OR: [
          { name: { contains: 'Tratamento', mode: 'insensitive' } },
          { name: { contains: 'Hidratação', mode: 'insensitive' } }
        ]
      }
    });

    if (treatmentCategory) {
      await prisma.barberCategory.update({
        where: { id: treatmentCategory.id },
        data: { IconUrl: 'lucide:Sparkles' }
      });
      console.log('✅ Categoria Tratamento atualizada com ícone Sparkles');
    } else {
      console.log('⚠️  Categoria Tratamento não encontrada');
    }

    // Listar todas as categorias e seus ícones atuais
    const allCategories = await prisma.barberCategory.findMany({
      select: { id: true, name: true, IconUrl: true }
    });

    console.log('\n📋 Categorias atuais:');
    allCategories.forEach(cat => {
      const icon = cat.IconUrl || '❌ SEM ÍCONE';
      console.log(`  ${cat.name}: ${icon}`);
    });

    console.log('\n✨ Atualização concluída!');
  } catch (error) {
    console.error('❌ Erro ao atualizar ícones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategoryIcons();


