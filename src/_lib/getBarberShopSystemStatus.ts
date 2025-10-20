import { db } from "./prisma";

export async function getBarberShopSystemStatus(): Promise<boolean> {
  try {
    const config = await db.siteConfig.findUnique({
      where: { key: "barbershop_system_enabled" }
    });

    return config?.value === "true";
  } catch (error) {
    console.error("Erro ao verificar status do sistema de barbearias:", error);
    return false; // Default para sistema unificado
  }
}
