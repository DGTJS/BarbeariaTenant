/**
 * Sistema de verificação de limites por plano
 */

import { getTenantDb } from "./tenant-db";
import { prismaSuper } from "./prisma-super";

interface PlanLimits {
  maxBarbers: number;
  maxServices: number;
  maxServiceOptions: number;
  maxBookingsPerMonth: number;
  maxBarberShops: number;
  maxStorageMB: number;
}

interface CurrentUsage {
  barbers: number;
  services: number;
  serviceOptions: number;
  bookingsThisMonth: number;
  barberShops: number;
  storageMB: number;
}

/**
 * Verifica se um tenant pode realizar uma ação baseado nos limites do plano
 */
export async function checkPlanLimit(
  tenantId: string,
  action:
    | "create_barber"
    | "create_service"
    | "create_service_option"
    | "create_booking"
    | "create_barbershop"
    | "upload_file"
): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}> {
  try {
    // Buscar tenant e plano
    const tenant = await prismaSuper.tenant.findUnique({
      where: { id: tenantId },
      include: {
        plan: true,
      },
    });

    if (!tenant || !tenant.plan) {
      return { allowed: false, reason: "Plano não encontrado" };
    }

    const plan = tenant.plan;
    const db = await getTenantDb(tenantId);

    // Verificar limites baseado na ação
    switch (action) {
      case "create_barber": {
        if (plan.maxBarbers === 0) return { allowed: true }; // Ilimitado

        const currentBarbers = await db.barber.count();
        if (currentBarbers >= plan.maxBarbers) {
          return {
            allowed: false,
            reason: `Limite de ${plan.maxBarbers} barbeiros atingido`,
            limit: plan.maxBarbers,
            current: currentBarbers,
          };
        }
        return {
          allowed: true,
          limit: plan.maxBarbers,
          current: currentBarbers,
        };
      }

      case "create_service": {
        if (plan.maxServices === 0) return { allowed: true }; // Ilimitado

        const currentServices = await db.barberShopService.count();
        if (currentServices >= plan.maxServices) {
          return {
            allowed: false,
            reason: `Limite de ${plan.maxServices} serviços atingido`,
            limit: plan.maxServices,
            current: currentServices,
          };
        }
        return {
          allowed: true,
          limit: plan.maxServices,
          current: currentServices,
        };
      }

      case "create_service_option": {
        if (plan.maxServiceOptions === 0) return { allowed: true }; // Ilimitado

        // Esta verificação precisa receber o serviceId como parâmetro adicional
        // Por enquanto, retornar permitido (será verificado no contexto da chamada)
        return { allowed: true };
      }

      case "create_booking": {
        if (plan.maxBookingsPerMonth === 0) return { allowed: true }; // Ilimitado

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const bookingsThisMonth = await db.booking.count({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
        });

        if (bookingsThisMonth >= plan.maxBookingsPerMonth) {
          return {
            allowed: false,
            reason: `Limite de ${plan.maxBookingsPerMonth} agendamentos mensais atingido`,
            limit: plan.maxBookingsPerMonth,
            current: bookingsThisMonth,
          };
        }
        return {
          allowed: true,
          limit: plan.maxBookingsPerMonth,
          current: bookingsThisMonth,
        };
      }

      case "create_barbershop": {
        if (plan.maxBarberShops === 0) return { allowed: true }; // Ilimitado

        const currentBarberShops = await db.barberShop.count();
        if (currentBarberShops >= plan.maxBarberShops) {
          return {
            allowed: false,
            reason: `Limite de ${plan.maxBarberShops} barbearias atingido`,
            limit: plan.maxBarberShops,
            current: currentBarberShops,
          };
        }
        return {
          allowed: true,
          limit: plan.maxBarberShops,
          current: currentBarberShops,
        };
      }

      case "upload_file": {
        // TODO: Calcular tamanho atual dos arquivos
        // Por enquanto, retornar permitido
        return { allowed: true };
      }

      default:
        return { allowed: false, reason: "Ação não reconhecida" };
    }
  } catch (error: any) {
    console.error("Erro ao verificar limite:", error);
    return { allowed: false, reason: error.message };
  }
}

/**
 * Atualiza o uso atual do tenant
 */
export async function updateTenantUsage(tenantId: string) {
  try {
    const db = await getTenantDb(tenantId);

    const [barbers, services, barberShops] = await Promise.all([
      db.barber.count(),
      db.barberShopService.count(),
      db.barberShop.count(),
    ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const bookingsThisMonth = await db.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Contar opções de serviço (máximo por serviço)
    const serviceOptions = await db.serviceOption.groupBy({
      by: ["serviceId"],
      _count: {
        id: true,
      },
    });
    const maxServiceOptions = Math.max(
      ...serviceOptions.map(s => s._count.id),
      0
    );

    await prismaSuper.tenant.update({
      where: { id: tenantId },
      data: {
        currentBarbers: barbers,
        currentServices: services,
        currentBookingsThisMonth: bookingsThisMonth,
        currentBarberShops: barberShops,
        // TODO: Calcular storage
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar uso do tenant:", error);
  }
}
