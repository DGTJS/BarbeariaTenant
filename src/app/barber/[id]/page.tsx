import { db } from "@/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Suspense } from "react";
import BarberServicesWithFilter from "@/_components/barber-services-with-filter";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { ChevronLeftIcon, StarIcon, MapPin, Clock, Phone, Mail, Calendar } from "lucide-react";
import SideBarButton from "@/_components/sidebar-button";
import Link from "next/link";
import FavoriteBarberButton from "@/_components/favorite-barber-button";
import SpecialtyBadge from "@/_components/specialty-badge";

interface BarbersProps {
  params: {
    id: string;
  };
}

const BarberPage = async ({ params }: BarbersProps) => {
  const { id } = await params;
  
  // Função para converter número do dia da semana para nome
  const getDayName = (weekday: number): string => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[weekday] || 'Dia';
  };
  
  // Buscar dados do usuário logado
  const session = await getServerSession(authOptions);
  const user = session?.user || null;
  
  const Barbers = await db.barber.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      photo: true,
      phone: true,
      barberShopId: true,
      categories: true,
      workingHours: {
        include: {
          pauses: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
      barberShop: {
        select: {
          name: true,
          address: true,
        },
      },
    },
  });

  const [reviews, recentReviews] = await Promise.all([
    db.booking.aggregate({
    where: {
        barberId: id,
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
    }),
    db.booking.findMany({
      where: {
        barberId: id,
        rating: {
          not: null,
        },
      },
      select: {
        rating: true,
        comment: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        dateTime: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
      take: 5,
    }),
  ]);

  // Buscar dados adicionais para o modal de agendamento
  const [allServicesRaw, allBarbers, allBookings] = await Promise.all([
    // Buscar todos os serviços
    db.barberShopService.findMany({
      include: {
        category: true,
        priceAdjustments: true,
      },
    }),
    // Buscar todos os barbeiros com working hours
    db.barber.findMany({
      include: {
        workingHours: {
          include: {
            pauses: true,
          },
        },
      },
    }),
    // Buscar todos os agendamentos
    db.booking.findMany({
      select: {
        id: true,
        dateTime: true,
        status: true,
        barberId: true,
        serviceId: true,
        userId: true,
      },
    }),
  ]);

  // Serializar allServices para evitar erro de Decimal
  const allServices = allServicesRaw.map(service => ({
    ...service,
    price: Number(service.price),
    priceAdjustments: service.priceAdjustments?.map(adj => ({
      ...adj,
      priceAdjustment: Number(adj.priceAdjustment),
    })),
  }));

  // Buscar todos os serviços ativos
  const services = await db.barberShopService.findMany({
    where: {
      status: true,
    },
    include: {
      category: true,
      priceAdjustments: {
        where: {
          barberId: id,
        },
      },
    },
  });

  // Converter Decimal para number para evitar erro de serialização
  const serializedServices = services.map(service => ({
    ...service,
    price: Number(service.price),
    priceAdjustments: service.priceAdjustments?.map(adj => ({
      ...adj,
      priceAdjustment: Number(adj.priceAdjustment),
    })),
  }));

  // Extrair categorias únicas dos serviços reais do barbeiro
  const barberCategories = serializedServices
    .map(service => service.category)
    .filter((category, index, self) => 
      category && self.findIndex(c => c?.id === category.id) === index
    )
    .map(category => ({
      id: category!.id,
      name: category!.name,
      IconUrl: category!.IconUrl
    }));

  const averageRating = reviews._avg.rating
    ? Math.min(reviews._avg.rating, 5)
    : null;

  const totalReviews = reviews._count.rating || 0;

  if (!Barbers) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Barbeiro não encontrado</h1>
            <p className="text-gray-400 mb-4">O barbeiro que você está procurando não existe.</p>
            <Button asChild>
              <Link href="/">Voltar ao início</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-background">
      {/* Header com imagem de fundo */}
      <div className="relative h-[350px] lg:h-[400px] w-full overflow-hidden">
        <Image
          src={Barbers.photo || "/logo.png"}
          alt={Barbers.name}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

        {/* Botões de navegação */}
        <div className="absolute top-4 left-4 z-50">
      <Button
        variant="outline"
            size="sm"
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 shadow-sm hover:shadow-md transition-all duration-200"
        asChild
      >
        <Link href="/">
              <ChevronLeftIcon className="h-4 w-4 text-white" />
        </Link>
      </Button>
        </div>

        <div className="absolute top-4 right-4 z-50">
        <SideBarButton category={[]} />
      </div>

        {/* Informações do barbeiro no header */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">{Barbers.name}</h1>
              <p className="text-lg text-white/90 drop-shadow-md">{Barbers.barberShop?.name}</p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4" />
                <span className="drop-shadow-md">{Barbers.barberShop?.address || "Endereço não informado"}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              {averageRating && (
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-white">
                      <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div>
                        <div className="text-lg font-bold">{averageRating.toFixed(1)}</div>
                        <div className="text-xs text-white/80">{totalReviews} avaliações</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <FavoriteBarberButton barberId={Barbers.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal - Serviços */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categorias */}
            <Card className="bg-card-secondary/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Especialidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50 transition-colors">
                  {barberCategories.length > 0 ? (
                    barberCategories.map((category) => (
                      <SpecialtyBadge
                        key={category.id}
                        name={category.name}
                        IconUrl={category.IconUrl}
                        id={category.id}
                      />
                    ))
                  ) : (
                    <p className="text-foreground-muted text-sm">Nenhuma especialidade disponível</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Serviços com Filtro */}
            <BarberServicesWithFilter
              services={serializedServices}
              barber={{
                id: Barbers.id,
                name: Barbers.name,
                photo: Barbers.photo,
                workingHours: Barbers.workingHours?.map((hour: any & { pauses: { id: string; startTime: string; endTime: string }[] }) => ({
                  ...hour,
                  pauses: hour.pauses || [],
                })),
                barberShop: Barbers.barberShop?.name ? {
                  name: Barbers.barberShop.name,
                  address: Barbers.barberShop.address || undefined,
                } : undefined,
              }}
              user={user}
              allBookings={allBookings}
              allServices={allServices}
              allBarbers={allBarbers}
              categories={barberCategories}
            />
          </div>

          {/* Sidebar - Informações e avaliações */}
          <div className="space-y-6">
            {/* Informações de contato */}
            <Card className="bg-card-secondary/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Barbers.phone && (
                  <div className="flex items-center gap-3 text-foreground-muted">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{Barbers.phone}</span>
                  </div>
                )}
                {Barbers.user?.email && (
                  <div className="flex items-center gap-3 text-foreground-muted">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm">{Barbers.user.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-foreground-muted">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{Barbers.barberShop?.address || "Endereço não informado"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Horários de funcionamento */}
            {Barbers.workingHours && Barbers.workingHours.length > 0 && (
              <Card className="bg-card-secondary/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    Horários e Pausas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Barbers.workingHours.map((schedule, index) => (
                      <div key={index} className="space-y-2">
                        {/* Horário principal */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-foreground-muted capitalize font-medium">
                            {getDayName(schedule.weekday)}
                          </span>
                          <span className="text-card-foreground font-semibold">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                        
                        {/* Pausas */}
                        {schedule.pauses && schedule.pauses.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {schedule.pauses.map((pause: any, pauseIndex: number) => (
                              <div key={pauseIndex} className="flex justify-between items-center text-xs text-foreground-muted">
                                <span className="flex items-center gap-1">
                                  <div className="w-1 h-1 bg-foreground-muted rounded-full" />
                                  Pausa
                                </span>
                                <span>
                                  {pause.startTime} - {pause.endTime}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Avaliações recentes */}
            {recentReviews.length > 0 && (
              <Card className="bg-card-secondary/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    Avaliações Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review, index) => (
                      <div key={index} className="border-b border-card-border/30 pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (review.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-foreground-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-foreground-muted">
                            {review.user.name || "Usuário anônimo"}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-foreground-muted">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </Suspense>
  );
};

export default BarberPage;
