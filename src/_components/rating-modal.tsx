"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    service: {
      name: string;
      duration: number;
    };
    barber: {
      name: string;
      photo: string;
    };
    dateTime: string;
    status: string;
  } | null;
  onRatingSubmit: (rating: number, comment: string) => Promise<void>;
}

const RatingModal = ({ isOpen, onClose, booking, onRatingSubmit }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Por favor, selecione uma nota de 1 a 5 estrelas");
      return;
    }

    setIsSubmitting(true);
    try {
      await onRatingSubmit(rating, comment);
      // Reset form
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card border-card-border shadow-lg z-50">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground">
                  Avaliar Serviço
                </h2>
                <p className="text-sm text-foreground-muted font-normal">
                  Como foi sua experiência?
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-accent-hover"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Serviço */}
          <div className="bg-card-secondary/50 rounded-lg p-4 border border-card-border">
            <h3 className="font-semibold text-card-foreground mb-2">
              {booking.service.name}
            </h3>
            <div className="space-y-1 text-sm text-foreground-muted">
              <p><strong>Barbeiro:</strong> {booking.barber.name}</p>
              <p><strong>Data:</strong> {format(new Date(booking.dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              <p><strong>Duração:</strong> {booking.service.duration} minutos</p>
            </div>
          </div>

          {/* Avaliação por Estrelas */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">
              Avalie o serviço (1 a 5 estrelas):
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-foreground-muted">
                {rating === 1 && "Péssimo"}
                {rating === 2 && "Ruim"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bom"}
                {rating === 5 && "Excelente"}
              </p>
            )}
          </div>

          {/* Comentário */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">
              Comentário (opcional):
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte-nos como foi sua experiência..."
              className="min-h-[100px] bg-background border-border text-card-foreground placeholder:text-foreground-muted"
              maxLength={500}
            />
            <p className="text-xs text-foreground-muted text-right">
              {comment.length}/500 caracteres
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
