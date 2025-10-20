"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Calendar, Clock, User, Scissors } from "lucide-react";
import { Button } from "@/_components/ui/button";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData?: {
    serviceName: string;
    serviceOption?: string;
    barberName: string;
    date: string;
    time: string;
    price: number;
  };
}

export default function BookingSuccessModal({ isOpen, onClose, bookingData }: BookingSuccessModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationStep(0);
      
      // Sequência de animações
      const timer1 = setTimeout(() => setAnimationStep(1), 100);
      const timer2 = setTimeout(() => setAnimationStep(2), 300);
      const timer3 = setTimeout(() => setAnimationStep(3), 500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setIsVisible(false);
      setAnimationStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-card border border-border rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header com animação */}
        <div className="p-6 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-all duration-500 ${
            animationStep >= 1 
              ? 'bg-green-500 scale-100' 
              : 'bg-gray-300 scale-75'
          }`}>
            <CheckCircle 
              className={`w-10 h-10 text-white transition-all duration-300 ${
                animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`} 
            />
          </div>
          
          <h2 className={`text-2xl font-bold text-foreground mb-2 transition-all duration-500 ${
            animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            Agendamento Confirmado!
          </h2>
          
          <p className={`text-foreground-muted transition-all duration-500 delay-200 ${
            animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            Seu agendamento foi realizado com sucesso
          </p>
        </div>

        {/* Detalhes do agendamento */}
        {bookingData && (
          <div className={`px-6 pb-6 transition-all duration-500 delay-300 ${
            animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <div className="bg-accent/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Serviço</p>
                  <p className="font-semibold text-foreground">
                    {bookingData.serviceName}
                    {bookingData.serviceOption && ` - ${bookingData.serviceOption}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Barbeiro</p>
                  <p className="font-semibold text-foreground">{bookingData.barberName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Data</p>
                  <p className="font-semibold text-foreground">{bookingData.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Horário</p>
                  <p className="font-semibold text-foreground">{bookingData.time}</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(bookingData.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className={`px-6 pb-6 transition-all duration-500 delay-500 ${
          animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => {
                onClose();
                // Aqui você pode adicionar navegação para a página de agendamentos
                // router.push('/profile');
              }}
              className="flex-1"
            >
              Ver Agendamentos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
