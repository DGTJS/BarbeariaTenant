const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAllCategoryIcons() {
  try {
    console.log('🔄 Corrigindo todos os ícones das categorias...\n');

    // Mapeamento de categorias para ícones apropriados
    const categoryIconMap = [
      { keywords: ['combo'], icon: 'lucide:Package' },
      { keywords: ['tratamento', 'hidratação', 'hidratacao'], icon: 'lucide:Sparkles' },
      { keywords: ['cabelo'], icon: 'lucide:Scissors' },
      { keywords: ['barba'], icon: 'lucide:Flame' },
      { keywords: ['sobrancelha'], icon: 'lucide:Eye' },
      { keywords: ['massagem'], icon: 'lucide:Hand' },
      { keywords: ['acabamento', 'acabemento'], icon: 'lucide:Sparkle' },
    ];

    // Buscar todas as categorias
    const allCategories = await prisma.barberCategory.findMany();

    for (const category of allCategories) {
      let iconToUse = null;

      // Verificar se a categoria já tem um ícone Lucide válido
      if (category.IconUrl && category.IconUrl.startsWith('lucide:')) {
        console.log(`✅ ${category.name}: já tem ícone Lucide (${category.IconUrl})`);
        continue;
      }

      // Tentar encontrar um ícone apropriado baseado no nome
      for (const mapping of categoryIconMap) {
        const categoryNameLower = category.name.toLowerCase();
        if (mapping.keywords.some(keyword => categoryNameLower.includes(keyword))) {
          iconToUse = mapping.icon;
          break;
        }
      }

      // Se não encontrou um ícone específico, usar um genérico
      if (!iconToUse) {
        iconToUse = 'lucide:CircleDot';
      }

      // Atualizar a categoria
      await prisma.barberCategory.update({
        where: { id: category.id },
        data: { IconUrl: iconToUse }
      });

      console.log(`🔧 ${category.name}: atualizado para ${iconToUse}`);
    }

    console.log('\n📋 Categorias finais:');
    const updatedCategories = await prisma.barberCategory.findMany({
      select: { name: true, IconUrl: true }
    });

    updatedCategories.forEach(cat => {
      console.log(`  ${cat.name}: ${cat.IconUrl}`);
    });

    console.log('\n✨ Todos os ícones atualizados!');
  } catch (error) {
    console.error('❌ Erro ao corrigir ícones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAllCategoryIcons();


