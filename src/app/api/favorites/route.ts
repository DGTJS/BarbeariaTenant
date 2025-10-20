import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/_lib/prisma";

// Debug: verificar se o modelo está disponível
console.log("Modelos disponíveis no Prisma:", Object.keys(db));

// POST - Adicionar ou remover favorito
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { barberId, action } = await request.json();

    if (!barberId || !action) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (action === "add") {
      // Verificar se já é favorito usando SQL direto
      const existingFavorite = await db.$queryRaw`
        SELECT * FROM favorite_barbers 
        WHERE "userId" = ${session.user.id} AND "barberId" = ${barberId}
      `;

      if (Array.isArray(existingFavorite) && existingFavorite.length > 0) {
        return NextResponse.json({ message: "Já é favorito" });
      }

      // Adicionar favorito usando SQL direto
      await db.$executeRaw`
        INSERT INTO favorite_barbers (id, "userId", "barberId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${session.user.id}, ${barberId}, NOW(), NOW())
      `;

      return NextResponse.json({ message: "Favorito adicionado" });
    } else if (action === "remove") {
      // Remover favorito usando SQL direto
      await db.$executeRaw`
        DELETE FROM favorite_barbers 
        WHERE "userId" = ${session.user.id} AND "barberId" = ${barberId}
      `;

      return NextResponse.json({ message: "Favorito removido" });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao gerenciar favoritos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// GET - Buscar favoritos do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar favoritos usando Prisma ORM
    const favorites = await db.favoriteBarber.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        barber: {
          include: {
            barberShop: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Buscar avaliações para cada barbeiro individualmente
    const reviewsMap = new Map();
    
    for (const fav of favorites) {
      const reviews = await db.booking.aggregate({
        where: {
          barberId: fav.barberId,
          rating: {
            not: null,
          },
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });
      
      reviewsMap.set(fav.barberId, {
        average: reviews._avg.rating || 0,
        count: reviews._count.rating || 0,
      });
    }

    // Transformar dados para o formato esperado pelo modal
    const formattedFavorites = favorites.map(fav => {
      const review = reviewsMap.get(fav.barberId);
      return {
        id: fav.barber.id,
        name: fav.barber.name,
        photo: fav.barber.photo,
        phone: fav.barber.phone,
        rating: review?.average ? Math.min(review.average, 5) : null,
        totalReviews: review?.count || 0,
        barberShop: {
          name: fav.barber.barberShop?.name,
          address: fav.barber.barberShop?.address,
        },
        isFavorite: true,
      };
    });

    return NextResponse.json(formattedFavorites);
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
