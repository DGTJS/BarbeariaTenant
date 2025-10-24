const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeamento de categorias para ícones do Lucide
const CATEGORY_ICON_MAP = {
  'cabelo': 'lucide:Scissors',
  'barba': 'lucide:Wind',
  'acabamento': 'lucide:Sparkles',
  'sobrancelha': 'lucide:Eye',
  'massagem': 'lucide:Hand',
  'hidratação': 'lucide:Droplet',
  'hidratacao': 'lucide:Droplet',
  'tratamento': 'lucide:Sparkle',
  'combo': 'lucide:Package',
  'pintura': 'lucide:Palette',
  'coloração': 'lucide:Palette',
  'coloracao': 'lucide:Palette',
  'relaxamento': 'lucide:Bath',
  'estética': 'lucide:Star',
  'estetica': 'lucide:Star',
};

async function fixCategoryIcons() {
  try {
    console.log('🎨 Iniciando correção de ícones de categorias...\n');

    const categories = await prisma.barberCategory.findMany();
    
    let categoriesFixed = 0;
    
    for (const category of categories) {
      // Verificar se o ícone é uma URL externa (não é lucide: e não é data:)
      const needsUpdate = category.IconUrl && 
                         !category.IconUrl.startsWith('lucide:') && 
                         !category.IconUrl.startsWith('data:');
      
      if (needsUpdate) {
        const categoryNameLower = category.name.toLowerCase().trim();
        
        // Tentar encontrar um ícone apropriado baseado no nome
        let newIcon = CATEGORY_ICON_MAP[categoryNameLower];
        
        // Se não encontrar correspondência exata, tentar match parcial
        if (!newIcon) {
          for (const [key, icon] of Object.entries(CATEGORY_ICON_MAP)) {
            if (categoryNameLower.includes(key) || key.includes(categoryNameLower)) {
              newIcon = icon;
              break;
            }
          }
        }
        
        // Se ainda não encontrou, usar ícone padrão
        if (!newIcon) {
          newIcon = 'lucide:Scissors';
        }
        
        await prisma.barberCategory.update({
          where: { id: category.id },
          data: { IconUrl: newIcon }
        });
        
        console.log(`  ✅ Categoria "${category.name}" - ícone atualizado para ${newIcon}`);
        categoriesFixed++;
      } else if (category.IconUrl?.startsWith('lucide:') || category.IconUrl?.startsWith('data:')) {
        console.log(`  ℹ️  Categoria "${category.name}" - já possui ícone válido`);
      }
    }
    
    console.log(`\n✨ ${categoriesFixed} categorias corrigidas\n`);
    
    if (categoriesFixed === 0) {
      console.log('✅ Todas as categorias já possuem ícones válidos!');
    } else {
      console.log('🎉 Correção de ícones concluída com sucesso!');
    }

  } catch (error) {
    console.error('❌ Erro ao corrigir ícones:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixCategoryIcons()
  .then(() => {
    console.log('\n✅ Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

