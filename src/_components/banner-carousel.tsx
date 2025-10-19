"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filtrar apenas banners ativos e ordenar por ordem
  const activeBanners = banners
    .filter(banner => banner.isActive)
    .sort((a, b) => a.order - b.order);

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying || activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, activeBanners.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? activeBanners.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false); // Pausa o auto-play quando usuário interage
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === activeBanners.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false); // Pausa o auto-play quando usuário interage
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pausa o auto-play quando usuário interage
  };

  if (activeBanners.length === 0) {
    return (
      <div className="relative h-[190px] sm:h-64 w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">Nenhum banner disponível</p>
          <p className="text-sm">Configure banners no painel administrativo</p>
        </div>
      </div>
    );
  }

  if (activeBanners.length === 1) {
    const banner = activeBanners[0];
    return (
      <div className="relative h-[190px] sm:h-64 w-full overflow-hidden rounded-lg">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback para uma imagem padrão se a imagem não carregar
            e.currentTarget.src = '/banner-01.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg sm:text-2xl font-bold">{banner.title}</h3>
          <p className="text-sm sm:text-base opacity-90">{banner.subtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-[190px] sm:h-64 w-full overflow-hidden rounded-lg group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Imagens do carrossel */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback para uma imagem padrão se a imagem não carregar
                e.currentTarget.src = '/banner-01.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg sm:text-2xl font-bold">{banner.title}</h3>
              <p className="text-sm sm:text-base opacity-90">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Indicadores de slide */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
