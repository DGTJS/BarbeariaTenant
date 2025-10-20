"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors
} from "lucide-react";

interface Booking {
  id: string;
  dateTime: string;
  status: string;
  user: {
    name: string;
  };
  service: {
    name: string;
    duration: number;
  };
  barber: {
    name: string;
  };
}

interface BookingCalendarProps {
  bookings: Booking[];
  onDateSelect?: (date: Date) => void;
}

export default function BookingCalendar({ bookings, onDateSelect }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Dias do próximo mês para completar a grade
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  }, []);

  const getBookingsForDate = useCallback((date: Date) => {
    const dateStr = date.toDateString();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.dateTime);
      return bookingDate.toDateString() === dateStr;
    });
  }, [bookings]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-emerald-500";
      case "Pendente":
        return "bg-amber-500";
      case "Cancelada":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "confirmado":
      case "confirmed":
        return "Confirmado";
      case "pendente":
      case "pending":
        return "Agendado";
      case "cancelada":
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  }, [onDateSelect]);

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate, getDaysInMonth]);
  const today = useMemo(() => new Date(), []);
  const selectedDateBookings = useMemo(() => 
    selectedDate ? getBookingsForDate(selectedDate) : [], 
    [selectedDate, getBookingsForDate]
  );

  return (
    <div className="space-y-6">
      {/* Calendário */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Calendário de Agendamentos
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayBookings = getBookingsForDate(day.date);
              const isToday = day.date.toDateString() === today.toDateString();
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
              
              return (
                <div
                  key={index}
                  className={`
                    relative p-2 h-20 border border-border/50 rounded-lg cursor-pointer transition-all duration-200
                    ${day.isCurrentMonth ? 'bg-background hover:bg-muted/50' : 'bg-muted/20 text-muted-foreground'}
                    ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${isSelected ? 'bg-primary/10 border-primary' : ''}
                  `}
                  onClick={() => handleDateClick(day.date)}
                >
                  <div className="text-sm font-medium mb-1">
                    {day.date.getDate()}
                  </div>
                  
                  {/* Indicadores de agendamentos */}
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((booking, bookingIndex) => (
                      <div
                        key={bookingIndex}
                        className={`h-1 w-full rounded-full ${getStatusColor(booking.status)}`}
                        title={`${booking.user.name} - ${booking.service.name}`}
                      />
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayBookings.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do dia selecionado */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Agendamentos de {selectedDate.toLocaleDateString('pt-BR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length > 0 ? (
              <div className="space-y-3">
                {selectedDateBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`} />
                      <div>
                        <p className="font-medium">{booking.user.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Scissors className="h-3 w-3" />
                          <span>{booking.service.name}</span>
                          <span>•</span>
                          <span>{booking.service.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(booking.dateTime).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <Badge
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md ${
                          booking.status === "Confirmado" || booking.status === "confirmed"
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/25"
                            : booking.status === "Pendente" || booking.status === "pending"
                            ? "bg-amber-500 text-white border-amber-600 shadow-amber-500/25"
                            : "bg-red-500 text-white border-red-600 shadow-red-500/25"
                        }`}
                      >
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum agendamento para este dia</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

