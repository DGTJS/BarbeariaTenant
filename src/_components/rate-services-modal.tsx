"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Star, X, Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import RatingModal from "./rating-modal";

interface RateServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name?: string | null; id?: string } | null;
}

interface CompletedBooking {
  id: string;
  dateTime: string;
  status: string;
  rating: number | null;
  comment: string | null;
  service: {
    name: string;
    duration: number;
  };
  serviceOption?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
  };
  barber: {
    name: string;
    photo: string;
  };
}

const RateServicesModal = ({ isOpen, onClose, user }: RateServicesModalProps) => {
  const [completedBookings, setCompletedBookings] = useState<CompletedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CompletedBooking | null>(null);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      if (isOpen && user?.id) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/user/history");
          if (response.ok) {
            const allBookings = await response.json();
            // Filtrar apenas agendamentos concluídos
            const completed = allBookings.filter((booking: any) => 
              booking.status.toLowerCase() === "completed"
            );
            setCompletedBookings(completed);
          } else {
            console.error("Erro ao buscar agendamentos concluídos");
            setCompletedBookings([]);
          }
        } catch (error) {
          console.error("Erro ao buscar agendamentos concluídos:", error);
          setCompletedBookings([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCompletedBookings();
  }, [isOpen, user?.id]);

  const handleRateService = (booking: CompletedBooking) => {
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
          bookingId: selectedBooking?.id,
          rating: rating,
          comment: comment,
        }),
      });

      if (response.ok) {
        // Atualizar a lista de agendamentos
        const updatedBookings = completedBookings.map(booking => 
          booking.id === selectedBooking?.id 
            ? { ...booking, rating, comment }
            : booking
        );
        setCompletedBookings(updatedBookings);
        
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

  const unratedBookings = completedBookings.filter(booking => !booking.rating);
  const ratedBookings = completedBookings.filter(booking => booking.rating);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-card-border shadow-lg [&>button]:hidden z-50">
          <DialogHeader className="flex-shrink-0 bg-card-secondary p-6 -m-6 mb-0 border-b border-card-border">
            <DialogTitle className="flex items-center justify-between text-xl font-bold">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">
                    Avaliar Serviços
                  </h2>
                  <p className="text-sm text-foreground-muted font-normal">
                    {unratedBookings.length} serviço{unratedBookings.length !== 1 ? 's' : ''} aguardando avaliação
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

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-foreground-muted mt-2">Carregando serviços...</p>
              </div>
            ) : unratedBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-card-secondary p-8 rounded-xl shadow-lg border-card-border">
                  <Star className="h-16 w-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                    Nenhum serviço para avaliar
                  </h3>
                  <p className="text-foreground-muted">
                    Você não tem serviços concluídos aguardando avaliação.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Serviços Aguardando Avaliação */}
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Serviços Aguardando Avaliação ({unratedBookings.length})
                  </h3>
                  <div className="space-y-4">
                    {unratedBookings.map((booking) => (
                      <Card key={booking.id} className="border-0 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="mb-3 flex items-center gap-2">
                                <span className="bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                                  Aguardando Avaliação
                                </span>
                                <span className="text-xs text-foreground-muted">ID: #{booking.id.slice(-6)}</span>
                              </div>
                              
                              <h4 className="mb-2 text-lg font-semibold text-card-foreground">
                                {booking.service.name}
                                {booking.serviceOption && (
                                  <span className="ml-2 text-sm font-normal text-primary">
                                    - {booking.serviceOption.name}
                                  </span>
                                )}
                              </h4>
                              
                              <div className="mb-3 flex items-center gap-2 text-sm text-foreground-muted">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={booking.barber.photo}
                                    alt={booking.barber.name}
                                  />
                                </Avatar>
                                <span>{booking.barber.name}</span>
                              </div>
                              
                              <div className="space-y-1 text-sm text-foreground-muted">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(booking.dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>Duração: {booking.service.duration} min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>Serviços</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <Button
                                onClick={() => handleRateService(booking)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Avaliar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Serviços Já Avaliados */}
                {ratedBookings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Serviços Já Avaliados ({ratedBookings.length})
                    </h3>
                    <div className="space-y-4">
                      {ratedBookings.map((booking) => (
                        <Card key={booking.id} className="border-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="mb-3 flex items-center gap-2">
                                  <span className="bg-green-500/20 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                    Avaliado
                                  </span>
                                  <span className="text-xs text-foreground-muted">ID: #{booking.id.slice(-6)}</span>
                                </div>
                                
                                <h4 className="mb-2 text-lg font-semibold text-card-foreground">
                                  {booking.service.name}
                                  {booking.serviceOption && (
                                    <span className="ml-2 text-sm font-normal text-primary">
                                      - {booking.serviceOption.name}
                                    </span>
                                  )}
                                </h4>
                                
                                <div className="mb-3 flex items-center gap-2 text-sm text-foreground-muted">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={booking.barber.photo}
                                      alt={booking.barber.name}
                                    />
                                  </Avatar>
                                  <span>{booking.barber.name}</span>
                                </div>
                                
                                <div className="space-y-1 text-sm text-foreground-muted">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(booking.dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Duração: {booking.service.duration} min</span>
                                  </div>
                                  {booking.comment && (
                                    <div className="mt-2 text-xs text-foreground-muted italic">
                                      "{booking.comment}"
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="ml-4 text-center">
                                <div className="flex justify-center mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= (booking.rating || 0)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-foreground-muted">
                                  {booking.rating === 1 && "Péssimo"}
                                  {booking.rating === 2 && "Ruim"}
                                  {booking.rating === 3 && "Regular"}
                                  {booking.rating === 4 && "Bom"}
                                  {booking.rating === 5 && "Excelente"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Avaliação */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        booking={selectedBooking}
        onRatingSubmit={handleRatingSubmit}
      />
    </>
  );
};

export default RateServicesModal;
