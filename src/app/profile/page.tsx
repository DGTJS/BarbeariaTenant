"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { 
  User, 
  Calendar, 
  Settings, 
  LogOut,
  ArrowLeft,
  Edit,
  Bell
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import NotificationSettings from "@/_components/notification-settings";
import UserLogin from "@/_components/user-login";
import LoadingScreen, { LoadingSpinner } from "@/_components/loading-screen";

interface Booking {
  id: string;
  dateTime: string;
  status: string;
  service: {
    name: string;
  };
  barber: {
    name: string;
  };
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchBookings();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/history");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Mostrar tela de loading bonita
  if (status === "loading") {
    return <LoadingScreen message="Carregando seu perfil" />;
  }

  if (status === "unauthenticated") {
    return <UserLogin />;
  }

  const totalBookings = bookings.length;
  const isSubscriber = false; // Por enquanto, sempre false

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-card-border/20 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-card-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Voltar</span>
          </Link>
          <h1 className="text-lg font-semibold text-card-foreground">Meu Perfil</h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Perfil Principal - Design Moderno */}
        <div className="bg-gradient-to-br from-primary/10 via-card/50 to-card/90 backdrop-blur-sm rounded-2xl border border-card-border/30 shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-card-foreground mb-1">
              {session?.user?.name || "Usuário"}
            </h2>
            <p className="text-muted-foreground mb-3">
              {session?.user?.email}
            </p>
            <Badge variant="secondary" className={isSubscriber ? "bg-green-500/20 text-green-600 border-green-500/30" : "bg-gray-500/20 text-gray-600 border-gray-500/30"}>
              {isSubscriber ? "Assinante" : "Não Assinante"}
            </Badge>
          </div>
        </div>

        {/* Estatísticas - Cards Horizontais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold text-card-foreground">{totalBookings}</p>
              <p className="text-xs text-muted-foreground">Agendamentos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <User className={`h-6 w-6 mx-auto mb-2 ${isSubscriber ? "text-green-500" : "text-gray-500"}`} />
              <p className="text-xl font-bold text-card-foreground">{isSubscriber ? "Assinante" : "Não Assinante"}</p>
              <p className="text-xs text-muted-foreground">Status</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Bell className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xl font-bold text-card-foreground">Ativo</p>
              <p className="text-xs text-muted-foreground">Notificações</p>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configurações de Notificação */}
          {session?.user?.id && <NotificationSettings userId={session.user.id} />}

          {/* Ações Rápidas */}
          <Card className="bg-card/90 backdrop-blur-sm border border-card-border/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start h-auto py-3">
                <Edit className="h-4 w-4 mr-3" />
                <span className="text-sm">Editar Perfil</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start h-auto py-3">
                <Settings className="h-4 w-4 mr-3" />
                <span className="text-sm">Preferências</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-3 text-red-500 hover:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-sm">Sair da Conta</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Histórico Recente */}
        <Card className="bg-card/90 backdrop-blur-sm border border-card-border/30 shadow-sm mt-6">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendamentos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner size="md" text="Carregando agendamentos..." />
            ) : bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-card-secondary/30 to-card-secondary/10 rounded-xl border border-card-border/20 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {booking.service?.name || 'Serviço'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.barber?.name || 'Barbeiro'} • {' '}
                          {new Date(booking.dateTime).toLocaleDateString('pt-BR')} às {' '}
                          {new Date(booking.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={booking.status === 'completed' ? 'default' : 
                              booking.status === 'pending' ? 'secondary' : 'destructive'}
                      className="ml-2"
                    >
                      {booking.status === 'completed' ? 'Concluído' :
                       booking.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum agendamento</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não fez nenhum agendamento
                </p>
                <Link href="/">
                  <Button size="sm">
                    Fazer Primeiro Agendamento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
