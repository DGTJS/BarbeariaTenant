import { memo, useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import AppointmentsModal from "./appointments-modal";
import { Booking } from "@/_types/booking";

interface AppointmentsProps {
  bookings?: Booking[];
  user?: { name?: string | null; id?: string } | null;
}

const Appointments = memo(({ bookings = [], user }: AppointmentsProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Os agendamentos já vêm filtrados e ordenados da query
  // Mostrar apenas os próximos 3 agendamentos
  const upcomingBookings = bookings.slice(0, 3);
  
  const handleViewAllAppointments = () => {
    if (!user) {
      router.push('/api/auth/signin');
    } else {
      setIsModalOpen(true);
    }
  };

  if (upcomingBookings.length === 0) {
    return (
      <div className="space-y-4">
        {/* No appointments message */}
        <div className="rounded-lg border border-dashed border-border/50 p-6 text-center">
          <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          {!user ? (
            <>
              <p className="text-sm text-muted-foreground">
                Faça login para ver seus agendamentos
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Entre com sua conta para acessar seus agendamentos
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/api/auth/signin')}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Fazer login
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Nenhum agendamento próximo
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Agende um horário para aparecer aqui
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAllAppointments}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver todos os agendamentos
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingBookings.map((booking) => {
        const bookingDate = new Date(booking.dateTime);
        const month = bookingDate.toLocaleDateString('pt-BR', { month: 'short' });
        const day = bookingDate.getDate();
        const time = bookingDate.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        const getStatusBadge = (status: string) => {
          const normalizedStatus = status.toUpperCase();
          switch (normalizedStatus) {
            case 'CONFIRMED':
            case 'CONFIRMADO':
              return (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Confirmado
                </Badge>
              );
            case 'PENDING':
            case 'PENDENTE':
              return (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Agendado
                </Badge>
              );
            case 'CANCELLED':
            case 'CANCELADO':
              return (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Cancelado
                </Badge>
              );
            default:
              return (
                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                  {status}
                </Badge>
              );
          }
        };

        return (
          <Card key={booking.id} className="border-0 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    <span className="text-xs text-muted-foreground">ID: #{booking.id.slice(-6)}</span>
                  </div>
                  
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {booking.service.name}
                  </h3>
                  
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={booking.barber.photo}
                        alt={booking.barber.name}
                      />
                    </Avatar>
                    <span>{booking.barber.name}</span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Serviços Globais</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Duração: {booking.service.duration} min</span>
                    </div>
                    {booking.comment && (
                      <div className="mt-2 text-xs text-muted-foreground italic">
                        "{booking.comment}"
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 text-center">
                  <div className="rounded-lg bg-card/50 p-3 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground capitalize">{month}</div>
                    <div className="text-2xl font-bold text-white">{day}</div>
                    <div className="text-sm text-muted-foreground">{time}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Botão para ver todos os agendamentos */}
      {bookings.length > 3 && (
        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllAppointments}
            className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver todos os agendamentos ({bookings.length})
          </Button>
        </div>
      )}
      
      {/* Modal para ver todos os agendamentos */}
      <AppointmentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user || null}
        bookings={bookings}
      />
    </div>
  );
})  ;

Appointments.displayName = 'Appointments';

export default Appointments;
