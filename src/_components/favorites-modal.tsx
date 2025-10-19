"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart, MapPin, Clock, User, X, Star, Phone, Mail } from "lucide-react";
import { Booking } from "@/_types/booking";

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

  useEffect(() => {
    if (isOpen && barbers) {
      // Simular barbeiros favoritos (em uma aplicação real, isso viria do banco de dados)
      const favorites = barbers.filter(barber => barber.isFavorite).slice(0, 10);
      setFavoriteBarbers(favorites);
    }
  }, [isOpen, barbers]);

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
    return barber.rating || 4.5; // Simular rating
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border shadow-lg [&>button]:hidden">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-primary/20 rounded-full w-fit">
              <User className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
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
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col bg-white dark:bg-slate-900 border shadow-lg [&>button]:hidden">
        <DialogHeader className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 p-6 -m-6 mb-0 border-b border-slate-200 dark:border-slate-700">
          <DialogTitle className="flex items-center justify-between text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
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
              className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 -m-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500">
          {favoriteBarbers.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border">
                <Heart className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Nenhum favorito encontrado</h3>
                <p className="text-muted-foreground">
                  Adicione barbeiros aos seus favoritos para aparecer aqui
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteBarbers.map((barber) => (
                <Card key={barber.id} className="group relative overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarImage src={barber.photo} />
                          <AvatarFallback className="bg-primary text-white font-bold">
                            {barber.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                            {barber.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">
                              {getAverageRating(barber).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(barber.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>

                    {barber.categories && barber.categories.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {barber.categories.slice(0, 2).map((category) => (
                            <Badge key={category.id} variant="outline" className="text-xs">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Serviços Globais</span>
                      </div>
                      {barber.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{barber.phone}</span>
                        </div>
                      )}
                      {barber.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{barber.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                      >
                        Agendar
                      </Button>
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
