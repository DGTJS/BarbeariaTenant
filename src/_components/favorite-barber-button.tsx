"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

interface FavoriteBarberButtonProps {
  barberId: string;
  initialIsFavorite?: boolean;
}

const FavoriteBarberButton = ({ barberId, initialIsFavorite = false }: FavoriteBarberButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { data: session } = useSession();

  // Verificar se o barbeiro é favorito ao carregar
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session?.user?.id) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/favorites/check?barberId=${barberId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error("Erro ao verificar favorito:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavoriteStatus();
  }, [barberId, session?.user?.id]);

  const handleToggleFavorite = async () => {
    if (!session?.user?.id) {
      // Redirecionar para login se não estiver logado
      window.location.href = "/api/auth/signin";
      return;
    }

    // Se for remover dos favoritos, pedir confirmação
    if (isFavorite) {
      const confirmed = window.confirm("Tem certeza que deseja remover este barbeiro dos favoritos?");
      if (!confirmed) {
        return;
      }
    }

    setIsLoading(true);
    try {
      console.log("Tentando favoritar barbeiro:", { barberId, action: isFavorite ? "remove" : "add" });
      
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barberId,
          action: isFavorite ? "remove" : "add",
        }),
      });

      console.log("Resposta da API:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("Dados da resposta:", data);
        setIsFavorite(!isFavorite);
      } else {
        const errorData = await response.json();
        console.error("Erro ao favoritar barbeiro:", errorData);
      }
    } catch (error) {
      console.error("Erro ao favoritar barbeiro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Button 
        disabled
        className="bg-card-secondary border border-card-border text-card-foreground"
      >
        <Heart className="h-4 w-4 mr-2" />
        Carregando...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${
        isFavorite 
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
          : "bg-card-secondary border border-card-border text-card-foreground hover:bg-accent-hover"
      } transition-all duration-200`}
    >
      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
      {isLoading ? "..." : isFavorite ? "Favoritado" : "Favoritar"}
    </Button>
  );
};

export default FavoriteBarberButton;
