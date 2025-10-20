"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart, MapPin, Clock, User, X, Star, Phone, Mail } from "lucide-react";
import { Booking } from "@/_types/booking";
import Image from "next/image";

interface Barber {
  id: string;
  name: string;
  photo: string;
  phone?: string;
  email?: string;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  rating?: number;
  totalReviews?: number;
  isFavorite?: boolean;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name?: string | null; id?: string } | null;
  barbers: Barber[];
}

const FavoritesModal = ({ isOpen, onClose, user, barbers }: FavoritesModalProps) => {
  const [favoriteBarbers, setFavoriteBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isOpen && user?.id) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/favorites");
          if (response.ok) {
            const favorites = await response.json();
            setFavoriteBarbers(favorites);
          } else {
            console.error("Erro ao buscar favoritos");
            setFavoriteBarbers([]);
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error);
          setFavoriteBarbers([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [isOpen, user?.id]);

  const toggleFavorite = (barberId: string) => {
    setFavoriteBarbers(prev => 
      prev.map(barber => 
        barber.id === barberId 
          ? { ...barber, isFavorite: !barber.isFavorite }
          : barber
      ).filter(barber => barber.isFavorite)
    );
  };

  const getAverageRating = (barber: Barber) => {
    return barber.rating || 0;
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border shadow-lg [&>button]:hidden">
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
              Faça login para visualizar seus barbeiros favoritos
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
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  Meus Favoritos
                </h2>
                <p className="text-sm text-muted-foreground font-normal">
                  {favoriteBarbers.length} barbeiro{favoriteBarbers.length !== 1 ? 's' : ''} favorito{favoriteBarbers.length !== 1 ? 's' : ''}
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
          {isLoading ? (
            <div className="text-center py-16">
              <div className="bg-card-secondary p-8 rounded-xl shadow-lg border-card-border">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Carregando favoritos...</h3>
                <p className="text-muted-foreground">
                  Buscando seus barbeiros favoritos
                </p>
              </div>
            </div>
          ) : favoriteBarbers.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-card-secondary p-8 rounded-xl shadow-lg border-card-border">
                <Heart className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Nenhum favorito encontrado</h3>
                <p className="text-muted-foreground">
                  Adicione barbeiros aos seus favoritos para aparecer aqui
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {favoriteBarbers.map((barber) => (
                <Card key={barber.id} className="group relative border-card-border shadow-md hover:shadow-lg transition-all duration-300 bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Imagem do barbeiro */}
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={barber.photo}
                          alt={barber.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute -top-1 -right-1">
                          <Badge className="bg-red-500 text-white text-xs px-1 py-0.5">
                            <Heart className="h-2 w-2 mr-1 fill-current" />
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors truncate">
                              {barber.name}
                            </h3>
                            <p className="text-sm text-foreground-muted truncate">
                              {barber.barberShop?.name || "Barbearia"}
                            </p>
                            {barber.barberShop?.address && (
                              <p className="text-xs text-foreground-muted truncate mt-1">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {barber.barberShop.address}
                              </p>
                            )}
                          </div>
                          {barber.rating && barber.rating > 0 && (
                            <div className="flex items-center gap-1 text-sm text-foreground-muted flex-shrink-0">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{getAverageRating(barber).toFixed(1)}</span>
                              {barber.totalReviews && barber.totalReviews > 0 && (
                                <span className="text-xs">({barber.totalReviews})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Botões */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 transition-all duration-200 hover:scale-105"
                          size="sm"
                        >
                          Agendar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFavorite(barber.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 px-4 py-2"
                        >
                          <Heart className="h-4 w-4 mr-1 fill-current" />
                          Remover
                        </Button>
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

export default FavoritesModal;
