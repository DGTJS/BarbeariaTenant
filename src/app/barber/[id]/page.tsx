import { db } from "@/_lib/prisma";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { ChevronLeftIcon, StarIcon, MapPin, Clock, Phone, Mail, Calendar, Heart } from "lucide-react";
import SideBarButton from "@/_components/sidebar-button";
import Link from "next/link";
import Category from "@/_components/category";
import ServiceBarberCard from "@/_components/cardServiceBarber";
import { getCategories } from "@/_lib/getCategories";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Suspense } from "react";

interface BarbersProps {
  params: {
    id: string;
  };
}

const BarberPage = async ({ params }: BarbersProps) => {
  const { id } = await params;
  
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
      workingHours: true,
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

  const categories = await getCategories();

  // Buscar dados adicionais para o modal de agendamento
  const [allServices, allBarbers, allBookings] = await Promise.all([
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

  // Buscar serviços da barbearia do barbeiro ou serviços globais
  // Primeiro, tentar buscar serviços da barbearia específica
  let services = await db.barberShopService.findMany({
    where: {
      barberShopId: Barbers!.barberShopId,
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

  // Se não encontrar serviços na barbearia específica, buscar serviços globais
  if (services.length === 0) {
    const globalBarberShop = await db.barberShop.findFirst({
      where: {
        name: "Serviços Globais",
        status: true,
      },
    });

    if (globalBarberShop) {
      services = await db.barberShopService.findMany({
        where: {
          barberShopId: globalBarberShop.id,
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
    }
  }

  const averageRating = reviews._avg.rating
    ? Math.min(reviews._avg.rating, 5)
    : null;

  const totalReviews = reviews._count.rating || 0;

  if (!Barbers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header com imagem de fundo */}
      <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
        <Image
          src={Barbers.photo || "/logo.png"}
          alt={Barbers.name}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />

        {/* Botões de navegação */}
        <div className="absolute top-4 left-4 z-50">
      <Button
        variant="outline"
            size="sm"
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        asChild
      >
        <Link href="/">
              <ChevronLeftIcon className="h-4 w-4 text-white" />
        </Link>
      </Button>
        </div>

        <div className="absolute top-4 right-4 z-50">
        <SideBarButton category={categories} />
      </div>

        {/* Informações do barbeiro no header */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="text-white">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{Barbers.name}</h1>
              <p className="text-lg text-gray-300 mb-3">{Barbers.barberShop?.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{Barbers.barberShop?.address || "Endereço não informado"}</span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-3">
              {averageRating && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-white">
                      <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <div>
                        <div className="text-xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="text-xs text-gray-300">{totalReviews} avaliações</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Heart className="h-4 w-4 mr-2" />
                Favoritar
              </Button>
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
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Especialidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                  {Barbers.categories?.map((category) => (
            <Category
              key={category.id}
              name={category.name}
              IconUrl={category.IconUrl}
              id={category.id}
            />
          ))}
        </div>
              </CardContent>
            </Card>

            {/* Serviços */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Serviços Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <Suspense key={service.id} fallback={
                        <Card className="bg-slate-800 border-slate-700">
                          <CardContent className="p-6">
                            <div className="animate-pulse">
                              <div className="h-4 bg-slate-700 rounded mb-2"></div>
                              <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                              <div className="h-8 bg-slate-700 rounded"></div>
                            </div>
                          </CardContent>
                        </Card>
                      }>
                        <ServiceBarberCard
                          service={{
                            ...service,
                            price: Number(service.price),
                            priceAdjustments: service.priceAdjustments?.map((adj) => ({
                              ...adj,
                              priceAdjustment: Number(adj.priceAdjustment),
                            })),
                          }}
                          barber={{
                            id: Barbers.id,
                            name: Barbers.name,
                            photo: Barbers.photo,
                            workingHours: Barbers.workingHours,
                            barberShop: Barbers.barberShop,
                          }}
                          user={user}
                          bookings={allBookings}
                        />
                      </Suspense>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Nenhum serviço disponível</h3>
                      <p className="text-gray-400">Este barbeiro ainda não possui serviços cadastrados.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Informações e avaliações */}
          <div className="space-y-6">
            {/* Informações de contato */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Barbers.phone && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{Barbers.phone}</span>
                  </div>
                )}
                {Barbers.user?.email && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm">{Barbers.user.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{Barbers.barberShop?.address || "Endereço não informado"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Horários de funcionamento */}
            {Barbers.workingHours && Barbers.workingHours.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    Horários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Barbers.workingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300 capitalize">{schedule.dayOfWeek}</span>
                        <span className="text-white">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Avaliações recentes */}
            {recentReviews.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    Avaliações Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review, index) => (
                      <div key={index} className="border-b border-slate-700 pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (review.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">
                            {review.user.name || "Usuário anônimo"}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-300">{review.comment}</p>
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
