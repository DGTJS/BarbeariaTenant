import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";
import { db } from "@/_lib/prisma";
import { Card, CardContent } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { StarIcon, MapPin, Phone, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const FavoritesPage = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Buscar favoritos do usuário usando SQL direto
  const favorites = await db.$queryRaw`
    SELECT 
      fb.id,
      fb."createdAt",
      b.id as "barberId",
      b.name as "barberName",
      b.photo as "barberPhoto",
      b.phone as "barberPhone",
      bs.name as "barberShopName",
      bs.address as "barberShopAddress"
    FROM favorite_barbers fb
    JOIN barber b ON fb."barberId" = b.id
    LEFT JOIN "BarberShop" bs ON b."barberShopId" = bs.id
    WHERE fb."userId" = ${session.user.id}
    ORDER BY fb."createdAt" DESC
  ` as any[];

  // Buscar avaliações para cada barbeiro
  const barberIds = favorites.map(fav => fav.barberId);
  const reviews = await db.booking.aggregate({
    where: {
      barberId: {
        in: barberIds,
      },
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
    by: "barberId",
  });

  const reviewsMap = new Map();
  reviews.forEach(review => {
    reviewsMap.set(review.barberId, {
      average: review._avg.rating || 0,
      count: review._count.rating || 0,
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meus Favoritos</h1>
          <p className="text-foreground-muted">
            {favorites.length === 0 
              ? "Você ainda não tem barbeiros favoritos" 
              : `${favorites.length} barbeiro${favorites.length > 1 ? 's' : ''} favoritado${favorites.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card className="bg-card-secondary border-card-border">
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum favorito ainda
              </h3>
              <p className="text-foreground-muted mb-6">
                Explore barbeiros e adicione seus favoritos para encontrá-los facilmente.
              </p>
              <Button asChild>
                <Link href="/">Explorar Barbeiros</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const review = reviewsMap.get(favorite.barberId);
              const averageRating = review?.average ? Math.min(review.average, 5) : null;
              const totalReviews = review?.count || 0;

              return (
                <Card key={favorite.id} className="group hover:shadow-lg transition-all duration-300 bg-card-secondary border-card-border hover:border-primary/50">
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={favorite.barberPhoto}
                        alt={favorite.barberName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500 text-white">
                          <Heart className="h-3 w-3 mr-1 fill-current" />
                          Favorito
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {favorite.barberName}
                        </h3>
                        <p className="text-sm text-foreground-muted">
                          {favorite.barberShopName}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-foreground-muted">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">
                          {favorite.barberShopAddress || "Endereço não informado"}
                        </span>
                      </div>
                      
                      {favorite.barberPhone && (
                        <div className="flex items-center gap-2 text-sm text-foreground-muted">
                          <Phone className="h-4 w-4" />
                          <span>{favorite.barberPhone}</span>
                        </div>
                      )}
                      
                      {averageRating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-foreground">
                              {averageRating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs text-foreground-muted">
                            ({totalReviews} avaliações)
                          </span>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <Button 
                          asChild 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Link href={`/barber/${favorite.barberId}`}>
                            Ver Perfil
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
