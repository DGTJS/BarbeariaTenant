import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";
;

// Cache em memória com timestamp de última atualização (por tenant)
const cachedServices: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em ms

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    const cacheKey = hostname;

    const now = Date.now();

    // Se cache válido, retorna direto
    const cached = cachedServices.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      console.log("🚀 [SERVICES] Retornando do CACHE (válido)");
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Cache-Status": "HIT",
          "X-Cache-Age": Math.floor((now - cached.timestamp) / 1000).toString(),
        },
      });
    }

    console.log("🔄 [SERVICES] Buscando no banco de dados do tenant...");

    // Buscar serviços com dados essenciais
    const services = await db.barberShopService.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        categoryId: true,
        barberShopId: true,
        status: true,
        category: {
          select: {
            id: true,
            name: true,
            IconUrl: true,
          },
        },
        _count: {
          select: {
            booking: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Retornar serviços (sem preço, pois preço é apenas das opções)
    const serializedServices = services;

    // Atualizar cache para este tenant
    cachedServices.set(cacheKey, {
      data: serializedServices,
      timestamp: now,
    });

    console.log(
      `✅ [SERVICES] ${services.length} serviços encontrados e salvos em cache`
    );

    return NextResponse.json(serializedServices, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (error) {
    console.error("❌ [SERVICES] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviços" },
      { status: 500 }
    );
  }
}

// Função para invalidar cache (chamada quando serviço é criado/atualizado/deletado)
export function invalidateServicesCache(hostname?: string) {
  if (hostname) {
    cachedServices.delete(hostname);
    console.log(`🧹 [SERVICES] Cache invalidado para tenant: ${hostname}`);
  } else {
    cachedServices.clear();
    console.log("🧹 [SERVICES] Cache invalidado para todos os tenants");
  }
}
