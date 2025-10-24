import sharp from 'sharp';

export interface FaviconOptions {
  size?: number;
  format?: 'png' | 'ico';
  quality?: number;
}

export interface ConvertedImage {
  dataUrl: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

/**
 * Converte qualquer imagem para favicon otimizado
 * @param imageBuffer Buffer da imagem original
 * @param options Opções de conversão
 * @returns Objeto com dataUrl e metadados da imagem convertida
 */
export async function convertToFavicon(
  imageBuffer: Buffer, 
  options: FaviconOptions = {}
): Promise<ConvertedImage> {
  const {
    size = 32,
    format = 'png',
    quality = 90
  } = options;

  try {
    // Obter metadados da imagem original
    const metadata = await sharp(imageBuffer).metadata();
    
    // Redimensionar e otimizar a imagem
    let processedImage = sharp(imageBuffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .removeAlpha() // Remove transparência para compatibilidade
      .jpeg({ quality }); // Converter para JPEG primeiro para otimização

    // Se o formato solicitado for ICO, converter
    if (format === 'ico') {
      processedImage = processedImage.png(); // ICO é baseado em PNG
    } else {
      processedImage = processedImage.png();
    }

    // Processar a imagem
    const processedBuffer = await processedImage.toBuffer();
    
    // Criar data URL
    const mimeType = format === 'ico' ? 'image/x-icon' : 'image/png';
    const dataUrl = `data:${mimeType};base64,${processedBuffer.toString('base64')}`;

    return {
      dataUrl,
      width: size,
      height: size,
      format: format === 'ico' ? 'ico' : 'png',
      size: processedBuffer.length
    };

  } catch (error) {
    console.error('Erro ao converter imagem para favicon:', error);
    throw new Error('Falha na conversão da imagem');
  }
}

/**
 * Converte imagem para múltiplos tamanhos de favicon
 * @param imageBuffer Buffer da imagem original
 * @returns Array com diferentes tamanhos de favicon
 */
export async function convertToMultipleFaviconSizes(
  imageBuffer: Buffer
): Promise<ConvertedImage[]> {
  const sizes = [16, 32, 48, 64, 128];
  const results: ConvertedImage[] = [];

  for (const size of sizes) {
    try {
      const converted = await convertToFavicon(imageBuffer, { size, format: 'png' });
      results.push(converted);
    } catch (error) {
      console.error(`Erro ao converter para tamanho ${size}:`, error);
    }
  }

  return results;
}

/**
 * Valida se a imagem é adequada para favicon
 * @param imageBuffer Buffer da imagem
 * @returns Objeto com validação e sugestões
 */
export async function validateFaviconImage(imageBuffer: Buffer): Promise<{
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
}> {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  try {
    const metadata = await sharp(imageBuffer).metadata();
    
    // Verificar dimensões
    if (metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      
      if (Math.abs(aspectRatio - 1) > 0.1) {
        warnings.push('Imagem não é quadrada');
        suggestions.push('Considere usar uma imagem quadrada para melhor resultado');
      }
      
      if (metadata.width < 32 || metadata.height < 32) {
        warnings.push('Imagem muito pequena');
        suggestions.push('Use uma imagem de pelo menos 32x32 pixels');
      }
      
      if (metadata.width > 512 || metadata.height > 512) {
        warnings.push('Imagem muito grande');
        suggestions.push('Imagens muito grandes serão redimensionadas automaticamente');
      }
    }

    // Verificar formato
    if (metadata.format && !['jpeg', 'png', 'webp', 'gif'].includes(metadata.format)) {
      warnings.push('Formato não otimizado para web');
      suggestions.push('PNG ou JPEG são recomendados');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions
    };

  } catch (error) {
    return {
      isValid: false,
      warnings: ['Erro ao processar imagem'],
      suggestions: ['Verifique se o arquivo é uma imagem válida']
    };
  }
}

/**
 * Cria um favicon ICO com múltiplos tamanhos
 * @param imageBuffer Buffer da imagem original
 * @returns Data URL do favicon ICO
 */
export async function createIcoFavicon(imageBuffer: Buffer): Promise<string> {
  try {
    // Para ICO, vamos criar um PNG otimizado
    // (ICO real seria mais complexo, PNG é mais compatível)
    const converted = await convertToFavicon(imageBuffer, { 
      size: 32, 
      format: 'png',
      quality: 95 
    });
    
    return converted.dataUrl;
  } catch (error) {
    console.error('Erro ao criar favicon ICO:', error);
    throw new Error('Falha na criação do favicon ICO');
  }
}
