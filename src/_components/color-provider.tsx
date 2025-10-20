"use client";

import { useEffect, useState } from "react";

interface ColorProviderProps {
  children: React.ReactNode;
}

export default function ColorProvider({ children }: ColorProviderProps) {
  const [colorsLoaded, setColorsLoaded] = useState(false);

  useEffect(() => {
    const loadAndApplyColors = async () => {
      try {
        // Primeiro tenta carregar tema ativo
        const themeResponse = await fetch("/api/themes/active");
        if (themeResponse.ok) {
          const themeColors = await themeResponse.json();
          
          if (Object.keys(themeColors).length > 0) {
            // Aplicar cores do tema
            Object.entries(themeColors).forEach(([name, value]) => {
              const cssVar = `--${name}`;
              document.documentElement.style.setProperty(cssVar, value as string);
            });
            
            setColorsLoaded(true);
            return;
          }
        }
        
        // Fallback: carregar cores individuais
        const response = await fetch("/api/colors/active");
        if (response.ok) {
          const colors = await response.json();
          
          // Aplicar cores como CSS custom properties
          Object.entries(colors).forEach(([category, categoryColors]) => {
            Object.entries(categoryColors as Record<string, string>).forEach(([name, value]) => {
              const cssVar = `--${category}-${name}`;
              document.documentElement.style.setProperty(cssVar, value);
            });
          });
        }
        
        setColorsLoaded(true);
      } catch (error) {
        console.error("Error loading colors:", error);
        setColorsLoaded(true); // Continue mesmo se houver erro
      }
    };

    loadAndApplyColors();
  }, []);

  // Mostrar loading enquanto carrega as cores
  if (!colorsLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-muted">Carregando cores...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
