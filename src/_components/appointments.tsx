import { memo } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Booking {
  id: string;
  dateTime: Date;
  status: string;
  comment: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  barber: {
    id: string;
    name: string;
    photo: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
}

interface AppointmentsProps {
  bookings?: Booking[];
}

const Appointments = memo(({ bookings = [] }: AppointmentsProps) => {
  // Os agendamentos já vêm filtrados e ordenados da query
  // Mostrar apenas os próximos 3 agendamentos
  const upcomingBookings = bookings.slice(0, 3);

  if (upcomingBookings.length === 0) {
    return (
      <div className="space-y-4">
        {/* No appointments message */}
        <div className="rounded-lg border border-dashed border-border/50 p-6 text-center">
          <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhum agendamento próximo
          </p>
          <p className="text-xs text-muted-foreground">
            Agende um horário para aparecer aqui
          </p>
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
              return (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Confirmado
                </Badge>
              );
            case 'PENDING':
              return (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Agendado
                </Badge>
              );
            case 'CANCELLED':
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
    </div>
  );
})  ;

Appointments.displayName = 'Appointments';

export default Appointments;
