import { db } from "./prisma";

export async function getActiveColors() {
  try {
    const colors = await db.colorConfig.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    // Organizar cores por categoria
    const colorsByCategory = colors.reduce((acc, color) => {
      if (!acc[color.category]) {
        acc[color.category] = {};
      }
      acc[color.category][color.name] = color.value;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    return colorsByCategory;
  } catch (error) {
    console.error("Error fetching active colors:", error);
    return {};
  }
}

export async function getColorsForCSS() {
  try {
    const colors = await db.colorConfig.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    // Gerar CSS custom properties
    const cssVariables = colors.map(color => {
      const cssName = `--${color.category}-${color.name}`;
      return `${cssName}: ${color.value};`;
    }).join('\n  ');

    return cssVariables;
  } catch (error) {
    console.error("Error generating CSS variables:", error);
    return '';
  }
}

