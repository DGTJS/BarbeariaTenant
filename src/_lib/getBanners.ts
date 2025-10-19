import { db } from "./prisma";

export async function getBanners() {
  try {
    const banners = await db.banner.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return banners;
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    return [];
  }
}
