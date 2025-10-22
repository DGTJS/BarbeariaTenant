"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar, Clock, MapPin, User, X, Star, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Booking } from "@/_types/booking";
import RatingModal from "./rating-modal";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name?: string | null; id?: string } | null;
  bookings: Booking[];
}

const HistoryModal = ({ isOpen, onClose, user, bookings }: HistoryModalProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && user?.id) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/user/history");
          if (response.ok) {
            const historyBookings = await response.json();
            
            // Para teste, mostrar todos os agendamentos (passados e futuros)
            // Depois podemos filtrar apenas os passados
            console.log("Agendamentos recebidos:", historyBookings);
            
            // Aplicar filtro de status
            if (filter === "all") {
              setFilteredBookings(historyBookings);
            } else {
              setFilteredBookings(historyBookings.filter((booking: any) => 
                booking.status.toLowerCase() === filter.toLowerCase()
              ));
            }
          } else {
            console.error("Erro ao buscar histórico");
            setFilteredBookings([]);
          }
        } catch (error) {
          console.error("Erro ao buscar histórico:", error);
          setFilteredBookings([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();
  }, [isOpen, user?.id, filter]);

  const handleRateService = (booking: any) => {
    setSelectedBooking(booking);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      const response = await fetch("/api/booking/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          rating: rating,
          comment: comment,
        }),
      });

      if (response.ok) {
        // Atualizar a lista de agendamentos
        const updatedBookings = filteredBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, rating, comment }
            : booking
        );
        setFilteredBookings(updatedBookings);
        
        alert("Avaliação enviada com sucesso!");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Erro ao enviar avaliação");
      }
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      throw error;
    }
  };

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

  const formatDateTime = (dateTime: Date) => {
    try {
      return format(dateTime, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateTime.toString();
    }
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-card border-card-border shadow-lg [&>button]:hidden">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-primary/20 rounded-full w-fit">
              <User className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Acesso Necessário
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Faça login para visualizar seu histórico de agendamentos
            </p>
            <div className="space-y-3">
              <Button 
                onClick={onClose} 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-card-border shadow-lg [&>button]:hidden z-50">
        <DialogHeader className="flex-shrink-0 bg-card-secondary p-6 -m-6 mb-0 border-b border-card-border">
          <DialogTitle className="flex items-center justify-between text-xl font-bold text-foreground">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Histórico de Agendamentos
                </h2>
                <p className="text-sm text-muted-foreground font-normal">
                  {filteredBookings.length} agendamento{filteredBookings.length !== 1 ? 's' : ''} encontrado{filteredBookings.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-accent-hover"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Filtros */}
        <div className="flex-shrink-0 p-6 -m-6 mt-0 border-b border-card-border">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Todos</option>
              <option value="confirmado">Confirmados</option>
              <option value="pendente">Pendentes</option>
              <option value="cancelado">Cancelados</option>
              <option value="concluido">Concluídos</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 -m-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border-focus">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="bg-card-secondary p-8 rounded-xl shadow-lg border-card-border">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Carregando histórico...</h3>
                <p className="text-muted-foreground">
                  Buscando seus agendamentos
                </p>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-card-secondary p-8 rounded-xl shadow-lg border-card-border">
                <Calendar className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Nenhum agendamento encontrado</h3>
                <p className="text-muted-foreground">
                  {filter === "all" 
                    ? "Você ainda não tem agendamentos no histórico"
                    : `Nenhum agendamento com status "${filter}" encontrado`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="border-0 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-2">
                          {getStatusBadge(booking.status)}
                          <span className="text-xs text-muted-foreground">ID: #{booking.id.slice(-6)}</span>
                        </div>
                        
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
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
                            <span>Duração: {booking.service.duration} min</span>
                          </div>
                          {booking.comment && (
                            <div className="mt-2 text-xs text-muted-foreground italic">
                              "{booking.comment}"
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col items-center gap-3">
                        <div className="rounded-lg bg-card/50 p-3 backdrop-blur-sm">
                          <div className="text-xs text-muted-foreground capitalize">
                            {format(booking.dateTime, "MMM", { locale: ptBR })}
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {format(booking.dateTime, "dd")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(booking.dateTime, "HH:mm")}
                          </div>
                        </div>
                        
                        {/* Botão de Avaliar */}
                        {booking.status.toLowerCase() === "completed" && (
                          <Button
                            size="sm"
                            onClick={() => handleRateService(booking)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 py-1"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Avaliar
                          </Button>
                        )}
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
      
      {/* Modal de Avaliação */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        booking={selectedBooking}
        onRatingSubmit={handleRatingSubmit}
      />
    </Dialog>
  );
};

export default HistoryModal;
