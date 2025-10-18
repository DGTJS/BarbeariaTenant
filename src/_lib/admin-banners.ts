import { db } from "./prisma";
import { Banner } from "@/generated/prisma";

export async function getBanners() {
  try {
    const banners = await db.banner.findMany({
      orderBy: { order: 'asc' }
    });
    return banners;
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    return [];
  }
}

export async function createBanner(data: {
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive?: boolean;
  order?: number;
}) {
  try {
    const banner = await db.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        isActive: data.isActive ?? true,
        order: data.order ?? 1
      }
    });
    return banner;
  } catch (error) {
    console.error('Erro ao criar banner:', error);
    throw error;
  }
}

export async function updateBanner(id: string, data: {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  isActive?: boolean;
  order?: number;
}) {
  try {
    const banner = await db.banner.update({
      where: { id },
      data
    });
    return banner;
  } catch (error) {
    console.error('Erro ao atualizar banner:', error);
    throw error;
  }
}

export async function deleteBanner(id: string) {
  try {
    await db.banner.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Erro ao deletar banner:', error);
    throw error;
  }
}

export async function toggleBannerStatus(id: string) {
  try {
    const banner = await db.banner.findUnique({
      where: { id }
    });
    
    if (!banner) {
      throw new Error('Banner não encontrado');
    }
    
    const updatedBanner = await db.banner.update({
      where: { id },
      data: { isActive: !banner.isActive }
    });
    
    return updatedBanner;
  } catch (error) {
    console.error('Erro ao alterar status do banner:', error);
    throw error;
  }
}
