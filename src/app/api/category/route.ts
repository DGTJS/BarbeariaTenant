import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase } from "@/_lib/auth";

// Cache em memória com TTL (por tenant)
const cachedCategories: Map<string, { data: any[]; timestamp: number }> = new Map();
const CACHE_TTL = 300000; // 5 minutos (categorias mudam pouco)

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    const hostname = request.headers.get("host") || "";
    const cacheKey = hostname;

    // Verifica se há cache válido para este tenant
    const now = Date.now();
    const cached = cachedCategories.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log(`✨ [CATEGORIES] Retornando do cache para tenant: ${cacheKey}`);
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Cache-Status": "HIT",
        },
      });
    }

    console.log(`📖 [CATEGORIES] Buscando categorias no banco do tenant: ${cacheKey}`);
    const categories = await db.barberCategory.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        IconUrl: true,
        iconColor: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Atualiza o cache para este tenant
    cachedCategories.set(cacheKey, {
      data: categories,
      timestamp: Date.now(),
    });

    console.log(`✅ [CATEGORIES] ${categories.length} categorias retornadas para tenant: ${cacheKey}`);
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (error: any) {
    console.error("❌ [CATEGORIES] Erro ao buscar categorias:", error);
    return NextResponse.json(
      {
        error: error?.message || "Erro ao buscar categorias",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}

// Função para invalidar o cache (por tenant ou todos)
export function invalidateCategoriesCache(hostname?: string) {
  if (hostname) {
    cachedCategories.delete(hostname);
    console.log(`🔄 [CATEGORIES] Cache invalidado para tenant: ${hostname}`);
  } else {
    cachedCategories.clear();
    console.log("🔄 [CATEGORIES] Cache invalidado para todos os tenants");
  }
}
