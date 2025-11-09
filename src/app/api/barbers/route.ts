import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase } from "@/_lib/auth";

// Cache em memória com timestamp de última atualização (por tenant)
const cachedBarbers: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em ms

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    const hostname = request.headers.get("host") || "";
    const cacheKey = hostname;

    const now = Date.now();
    
    // Se cache válido, retorna direto
    const cached = cachedBarbers.get(cacheKey);
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      console.log('🚀 [BARBERS] Retornando do CACHE (válido)');
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Cache-Status': 'HIT',
          'X-Cache-Age': Math.floor((now - cached.timestamp) / 1000).toString(),
        }
      });
    }

    console.log('🔄 [BARBERS] Buscando no banco de dados do tenant...');
    
    // Buscar barbeiros com dados essenciais
    const barbers = await db.barber.findMany({
      select: {
        id: true,
        name: true,
        photo: true,
        phone: true,
        barberShopId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            id: true,
            name: true,
            IconUrl: true,
          },
        },
        workingHours: {
          select: {
            id: true,
            weekday: true,
            startTime: true,
            endTime: true,
            pauses: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
        _count: {
          select: {
            booking: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Atualizar cache para este tenant
    cachedBarbers.set(cacheKey, {
      data: barbers,
      timestamp: now,
    });
    
    console.log(`✅ [BARBERS] ${barbers.length} barbeiros encontrados e salvos em cache`);

    return NextResponse.json(barbers, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache-Status': 'MISS',
      }
    });
  } catch (error) {
    console.error('❌ [BARBERS] Erro:', error);
    return NextResponse.json({ error: "Erro ao buscar barbeiros" }, { status: 500 });
  }
}

// Função para invalidar cache (chamada quando barbeiro é criado/atualizado/deletado)
export function invalidateBarbersCache(hostname?: string) {
  if (hostname) {
    cachedBarbers.delete(hostname);
    console.log(`🧹 [BARBERS] Cache invalidado para tenant: ${hostname}`);
  } else {
    cachedBarbers.clear();
    console.log('🧹 [BARBERS] Cache invalidado para todos os tenants');
  }
}

