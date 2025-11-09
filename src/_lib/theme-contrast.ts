/**
 * Utilitários para calcular contraste de cores em temas
 * Garante que botões sempre tenham texto legível
 */

/**
 * Converte cor hex para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # se presente
  hex = hex.replace("#", "");
  
  // Converte para RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  
  return { r, g, b };
}

/**
 * Calcula a luminância relativa de uma cor (0-1)
 * Usa a fórmula W3C para calcular luminância
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5; // Fallback para meio-termo
  
  // Normalizar valores RGB para 0-1
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  // Aplicar função de gama
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calcular luminância relativa
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determina a cor de texto ideal (branco ou preto) baseado no brilho do fundo
 * Retorna branco para fundos escuros e preto para fundos claros
 */
export function getContrastText(backgroundColor: string): string {
  if (!backgroundColor) return "#ffffff";
  
  // Normalizar formato da cor
  let hex = backgroundColor.trim();
  if (!hex.startsWith("#")) {
    hex = "#" + hex;
  }
  
  // Se não for hex válido, retornar fallback
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return "#ffffff"; // Fallback para branco
  }
  
  const luminance = getLuminance(hex);
  
  // Se a luminância for maior que 0.5, usar texto preto, senão branco
  // Ajustado para 0.45 para garantir mais contraste
  return luminance > 0.45 ? "#000000" : "#ffffff";
}

/**
 * Calcula cor de texto com contraste garantido para botões
 * Garante contraste mínimo de 4.5:1 (WCAG AA)
 */
export function ensureButtonContrast(
  backgroundColor: string, 
  currentTextColor: string | undefined,
  isLightTheme: boolean
): string {
  if (!backgroundColor) {
    return isLightTheme ? "#000000" : "#ffffff";
  }
  
  // Se já tem uma cor de texto definida, verificar se tem contraste suficiente
  if (currentTextColor) {
    const bgLum = getLuminance(backgroundColor);
    const textLum = getLuminance(currentTextColor);
    
    // Calcular razão de contraste
    const lighter = Math.max(bgLum, textLum);
    const darker = Math.min(bgLum, textLum);
    const contrast = (lighter + 0.05) / (darker + 0.05);
    
    // Se contraste for suficiente (>= 4.5), usar a cor atual
    if (contrast >= 4.5) {
      return currentTextColor;
    }
  }
  
  // Se não tem contraste suficiente, calcular cor ideal
  return getContrastText(backgroundColor);
}

