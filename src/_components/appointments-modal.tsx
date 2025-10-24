"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar, Clock, MapPin, User, X, Star, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Booking } from "@/_types/booking";

interface AppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name?: string | null; id?: string } | null;
  bookings: Booking[];
}

const AppointmentsModal = ({ isOpen, onClose, user, bookings }: AppointmentsModalProps) => {

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
            <DialogTitle className="text-xl font-bold text-card-foreground">
              Acesso Necessário
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Faça login para visualizar e gerenciar seus agendamentos
            </p>
            <div className="space-y-3">
              <Button 
                onClick={onClose} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5"
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
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-card-border shadow-lg [&>button]:hidden">
        <DialogHeader className="flex-shrink-0 bg-card-secondary p-6 -m-6 mb-0 border-b border-card-border">
          <DialogTitle className="flex items-center justify-between text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  Meus Agendamentos
                </h2>
                <p className="text-sm text-muted-foreground font-normal">
                  {bookings.length} agendamento{bookings.length !== 1 ? 's' : ''} encontrado{bookings.length !== 1 ? 's' : ''}
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

        <div className="flex-1 overflow-y-auto p-6 -m-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border-focus">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-card-secondary p-8 rounded-xl shadow-lg border-card-border">
                <Calendar className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Nenhum agendamento encontrado</h3>
                <p className="text-muted-foreground">
                  Faça seu primeiro agendamento para aparecer aqui
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
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
                          <div className="text-xs text-muted-foreground capitalize">
                            {format(booking.dateTime, "MMM", { locale: ptBR })}
                          </div>
                          <div className="text-2xl font-bold text-card-foreground">
                            {format(booking.dateTime, "dd")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(booking.dateTime, "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentsModal;
