"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Download,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";

interface LogoPreviewProps {
  logoBase64?: string;
  logoWidth?: number;
  logoHeight?: number;
  className?: string;
}

export default function LogoPreview({ 
  logoBase64, 
  logoWidth, 
  logoHeight,
  className = ""
}: LogoPreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (logoBase64) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [logoBase64]);

  const getImageQuality = (width: number, height: number) => {
    if (width >= 200 && height >= 200) return { quality: 'Excelente', color: 'green' };
    if (width >= 100 && height >= 100) return { quality: 'Boa', color: 'blue' };
    if (width >= 50 && height >= 50) return { quality: 'Aceitável', color: 'yellow' };
    return { quality: 'Baixa', color: 'red' };
  };

  const quality = logoWidth && logoHeight ? getImageQuality(logoWidth, logoHeight) : null;

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const downloadImage = () => {
    if (logoBase64) {
      const link = document.createElement('a');
      link.href = logoBase64;
      link.download = 'logo-barbearia.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!logoBase64) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h4 className="font-medium">Nenhuma logo carregada</h4>
              <p className="text-sm text-muted-foreground">
                Faça upload de uma logo para ver o preview
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Preview da Logo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(logoBase64, '_blank')}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Ampliar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadImage}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Baixar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Imagem Preview */}
        <div className="flex justify-center">
          <div className="relative">
            {!imageLoaded && !imageError && (
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}
            
            {imageError && (
              <div className="w-32 h-32 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            )}
            
            <img 
              src={logoBase64} 
              alt="Preview da logo" 
              className={`w-32 h-32 object-contain border rounded-lg bg-gray-50 dark:bg-gray-900 shadow-sm ${
                !imageLoaded || imageError ? 'hidden' : ''
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {logoWidth && logoHeight && imageLoaded && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                {logoWidth}×{logoHeight}
              </div>
            )}
          </div>
        </div>

        {/* Informações da Imagem */}
        {imageLoaded && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Dimensões:</span>
                <Badge variant="outline" className="ml-1">
                  {logoWidth && logoHeight ? `${logoWidth}×${logoHeight}` : 'N/A'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Qualidade:</span>
                <Badge 
                  variant="outline" 
                  className={`ml-1 text-${quality?.color}-600`}
                >
                  {quality?.quality || 'N/A'}
                </Badge>
              </div>
            </div>

            {/* Avisos de Qualidade */}
            {quality && quality.color === 'red' && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm">
                    <strong>Atenção:</strong> A resolução da imagem é baixa. 
                    Para melhor qualidade, use uma imagem de pelo menos 200×200 pixels.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {quality && quality.color === 'yellow' && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm">
                    <strong>Dica:</strong> Para melhor qualidade, use uma imagem de pelo menos 200×200 pixels.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {quality && quality.color === 'green' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm">
                    <strong>Excelente!</strong> A resolução da imagem é ideal para uso na web.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {imageError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm">
                <strong>Erro:</strong> Não foi possível carregar a imagem. 
                Verifique se o arquivo é uma imagem válida.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
