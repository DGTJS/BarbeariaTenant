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
        <div className="rounded-lg border border-dashed border-booking-card-border p-6 text-center bg-booking-card">
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
    <div className="space-y-4 pb-20 sm:pb-4">
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
                <Badge className="bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:text-white dark:border-emerald-700 font-semibold px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/25 text-sm">
                  ✓ Confirmado
                </Badge>
              );
            case 'PENDING':
            case 'PENDENTE':
              return (
                <Badge className="bg-amber-500 text-white border-amber-600 dark:bg-amber-600 dark:text-white dark:border-amber-700 font-semibold px-4 py-2 rounded-lg shadow-lg shadow-amber-500/25 text-sm">
                  ⏳ Agendado
                </Badge>
              );
            case 'CANCELLED':
            case 'CANCELADO':
              return (
                <Badge className="bg-red-500 text-white border-red-600 dark:bg-red-600 dark:text-white dark:border-red-700 font-semibold px-4 py-2 rounded-lg shadow-lg shadow-red-500/25 text-sm">
                  ✕ Cancelado
                </Badge>
              );
            case 'COMPLETED':
            case 'CONCLUIDO':
              return (
                <Badge className="bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:text-white dark:border-blue-700 font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/25 text-sm">
                  ✓ Concluído
                </Badge>
              );
            default:
              return (
                <Badge className="bg-gray-500 text-white border-gray-600 dark:bg-gray-600 dark:text-white dark:border-gray-700 font-semibold px-4 py-2 rounded-lg shadow-lg shadow-gray-500/25 text-sm">
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
                  
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                    {booking.service.name}
                    {booking.serviceOption && (
                      <span className="ml-2 text-sm font-normal text-primary">
                        - {booking.serviceOption.name}
                      </span>
                    )}
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
                      <span>Serviços</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Duração: {booking.serviceOption?.duration || booking.service.duration} min</span>
                    </div>
                    {booking.comment && (
                      <div className="mt-2 text-xs text-muted-foreground italic">
                        "{booking.comment}"
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 text-center">
                  <div className="rounded-lg bg-booking-card p-3 backdrop-blur-sm">
                    <div className="text-xs text-foreground-muted capitalize">{month}</div>
                    <div className="text-2xl font-bold text-card-foreground">{day}</div>
                    <div className="text-sm text-foreground-muted">{time}</div>
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
