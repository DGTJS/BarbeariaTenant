"use client";

import { useState, useEffect } from 'react';

interface ThemeInfo {
  isLight: boolean;
  isDark: boolean;
  themeType: 'light' | 'dark' | 'custom' | null;
  isLoading: boolean;
  getIconFilterStyle: () => string;
}

export function useTheme(): ThemeInfo {
  const [themeInfo, setThemeInfo] = useState<ThemeInfo>({
    isLight: false,
    isDark: true, // Default to dark
    themeType: null,
    isLoading: true,
    getIconFilterStyle: () => getIconFilter(false),
  });

  useEffect(() => {
    const detectTheme = async () => {
      try {
        // Buscar tema ativo
        const response = await fetch("/api/themes/active");
        if (response.ok) {
          const themeColors = await response.json();
          
          if (Object.keys(themeColors).length > 0) {
            // Verificar se é tema claro baseado na cor de fundo
            const backgroundMain = themeColors['background-main'];
            if (backgroundMain) {
              // Converter OKLCH para detectar luminosidade
              const isLightTheme = isLightBackground(backgroundMain);
              setThemeInfo({
                isLight: isLightTheme,
                isDark: !isLightTheme,
                themeType: isLightTheme ? 'light' : 'dark',
                isLoading: false,
                getIconFilterStyle: () => getIconFilter(isLightTheme),
              });
              return;
            }
          }
        }

        // Fallback: verificar CSS custom properties
        const backgroundMain = getComputedStyle(document.documentElement)
          .getPropertyValue('--background-main');
        
        if (backgroundMain) {
          const isLightTheme = isLightBackground(backgroundMain);
          setThemeInfo({
            isLight: isLightTheme,
            isDark: !isLightTheme,
            themeType: isLightTheme ? 'light' : 'dark',
            isLoading: false,
            getIconFilterStyle: () => getIconFilter(isLightTheme),
          });
        } else {
          // Default fallback
          setThemeInfo({
            isLight: false,
            isDark: true,
            themeType: 'dark',
            isLoading: false,
            getIconFilterStyle: () => getIconFilter(false),
          });
        }
      } catch (error) {
        console.error("Error detecting theme:", error);
        setThemeInfo({
          isLight: false,
          isDark: true,
          themeType: 'dark',
          isLoading: false,
          getIconFilterStyle: () => getIconFilter(false),
        });
      }
    };

    detectTheme();

    // Escutar mudanças nas CSS custom properties
    const observer = new MutationObserver(() => {
      detectTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => observer.disconnect();
  }, []);

  return themeInfo;
}

  // Função auxiliar para detectar se uma cor de fundo é clara
function isLightBackground(color: string): boolean {
  try {
    // Se for OKLCH, extrair o valor de luminosidade
    if (color.includes('oklch')) {
      const match = color.match(/oklch\(([^)]+)\)/);
      if (match) {
        const values = match[1].split(',').map(v => v.trim());
        const lightness = parseFloat(values[0]);
        // Se a luminosidade for maior que 50%, é um tema claro
        return lightness > 0.5;
      }
    }
    
    // Se for HSL, extrair o valor de luminosidade
    if (color.includes('hsl')) {
      const match = color.match(/hsl\(([^)]+)\)/);
      if (match) {
        const values = match[1].split(',').map(v => v.trim());
        const lightness = parseFloat(values[2].replace('%', ''));
        return lightness > 50;
      }
    }
    
    // Se for hex, converter para RGB e calcular luminosidade
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }
    
    // Default: assumir tema escuro
    return false;
  } catch (error) {
    console.error("Error parsing color:", color, error);
    return false;
  }
}

// Função auxiliar para obter o filtro CSS apropriado para ícones
export function getIconFilter(isLight: boolean): string {
  if (isLight) {
    // Para tema claro: tornar o ícone escuro
    return 'brightness(0) saturate(100%)';
  } else {
    // Para tema escuro: tornar o ícone branco
    return 'brightness(0) invert(1)';
  }
}
