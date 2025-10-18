import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { CalendarIcon, UsersIcon, ScissorsIcon, DollarSignIcon, TrendingUpIcon, ClockIcon, RefreshCw } from "lucide-react";
import { db } from "@/_lib/prisma";

export default async function AdminDashboard() {
  // Buscar dados reais do banco de dados
  const [
    totalBookings,
    totalRevenue,
    totalBarbers,
    totalServices,
    todayBookings,
    pendingBookings,
    recentBookings
  ] = await Promise.all([
    db.booking.count(),
    // Calcular receita total baseada nos serviços
    db.barberShopService.findMany({
      select: { price: true }
    }).then(services => {
      return services.reduce((sum, service) => sum + Number(service.price), 0);
    }),
    db.barber.count(),
    db.barberShopService.count(),
    db.booking.count({
      where: {
        dateTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    }),
    db.booking.count({
      where: { status: "Pendente" }
    }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        },
        service: {
          select: { name: true, price: true, duration: true }
        },
        barber: {
          select: { name: true, photo: true }
        }
      }
    })
  ]);

  const stats = {
    totalBookings,
    totalRevenue,
    totalBarbers,
    totalServices,
    todayBookings,
    pendingBookings
  };

  // Converter dados do banco para o formato esperado
  const formattedRecentBookings = recentBookings.map(booking => ({
    id: booking.id,
    customerName: booking.user.name || "Cliente",
    service: booking.service.name,
    barber: booking.barber.name,
    time: booking.dateTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    status: booking.status.toLowerCase(),
    price: Number(booking.service.price),
    rating: booking.rating,
    comment: booking.comment
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Agendamentos
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Total
              </CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Barbeiros Ativos
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBarbers}</div>
              <p className="text-xs text-muted-foreground">
                Todos disponíveis hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Serviços Oferecidos
              </CardTitle>
              <ScissorsIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground">
                Em 6 categorias diferentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Hoje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Agendamentos de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats.todayBookings}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.pendingBookings} aguardando confirmação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500 mb-2">
                94%
              </div>
              <p className="text-sm text-muted-foreground">
                Taxa de ocupação hoje
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agendamentos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formattedRecentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`}></div>
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.service} • {booking.barber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.time}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {booking.price.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Ver Todos os Agendamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
