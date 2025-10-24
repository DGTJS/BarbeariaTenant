"use client";

import { useEffect, useState } from "react";
import { Scissors, Sparkles } from "lucide-react";

const loadingPhrases = [
  "Preparando a navalha... ✂️",
  "Ajustando o espelho... ✨",
  "Aquecendo as toalhas... 🔥",
  "Organizando os produtos... 💈",
  "Afiando a tesoura... ⚡",
  "Preparando seu momento... 🎯",
  "Buscando o melhor estilo... 👔",
  "Escolhendo o barbeiro perfeito... 🎨",
  "Preparando tudo para você... 🌟",
  "Quase lá, só mais um toque... ✂️",
  "Ajustando os detalhes... 🎭",
  "Preparando a experiência... 💎",
  "Organizando seu atendimento... 🔮",
  "Deixando tudo no ponto... 🎪",
  "Finalizando os preparativos... 🎬"
];

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingScreen({ fullScreen = true, message }: LoadingScreenProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Trocar frase a cada 2 segundos
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length);
    }, 2000);

    // Animar os pontos
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  const containerClass = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="text-center space-y-8 px-4">
        {/* Animação da Tesoura Girando */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Círculo de fundo pulsante */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse" />
          
          {/* Círculo de borda girando */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin" 
               style={{ animationDuration: '1.5s' }} />
          
          {/* Tesoura no centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Scissors 
              className="w-16 h-16 text-primary animate-pulse" 
              style={{ animationDuration: '2s' }}
            />
          </div>

          {/* Sparkles ao redor */}
          <Sparkles 
            className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-bounce" 
            style={{ animationDelay: '0s' }}
          />
          <Sparkles 
            className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-bounce" 
            style={{ animationDelay: '0.5s' }}
          />
          <Sparkles 
            className="absolute top-0 -left-2 w-5 h-5 text-accent/70 animate-bounce" 
            style={{ animationDelay: '0.25s' }}
          />
          <Sparkles 
            className="absolute -bottom-2 -right-2 w-5 h-5 text-primary/70 animate-bounce" 
            style={{ animationDelay: '0.75s' }}
          />
        </div>

        {/* Texto Animado */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            {message || loadingPhrases[currentPhrase]}
            <span className="inline-block w-8 text-left">{dots}</span>
          </h2>
          
          {/* Barra de progresso animada */}
          <div className="w-64 h-2 mx-auto bg-accent/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear'
              }}
            />
          </div>

          <p className="text-sm text-muted-foreground animate-pulse">
            Aguarde um momento...
          </p>
        </div>
      </div>

      {/* Estilos CSS para animações customizadas */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

// Componente compacto para usar em cards e seções menores
export function LoadingSpinner({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin`} />
        <Scissors className={`${sizeClasses[size]} absolute inset-0 text-primary/40`} />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

