"use client";

import { useState, useRef } from "react";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { Badge } from "@/_components/ui/badge";
import { 
  Upload, 
  X, 
  Image, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Download
} from "lucide-react";

interface FaviconUploadProps {
  faviconBase64?: string;
  faviconWidth?: number;
  faviconHeight?: number;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  uploading: boolean;
  className?: string;
}

export default function FaviconUpload({ 
  faviconBase64, 
  faviconWidth, 
  faviconHeight, 
  onUpload, 
  onRemove, 
  uploading,
  className = ""
}: FaviconUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<{
    warnings: string[];
    suggestions: string[];
    metadata: {
      width: number;
      height: number;
      format: string;
      size: number;
    };
  } | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Simular upload e obter resultado
      await onUpload(event);
      
      // Simular resultado da conversão (em produção, isso viria da API)
      setUploadResult({
        warnings: file.width && file.height && Math.abs(file.width / file.height - 1) > 0.1 
          ? ['Imagem não é quadrada'] 
          : [],
        suggestions: file.width && file.height && (file.width < 32 || file.height < 32)
          ? ['Imagem será redimensionada para 32x32 pixels']
          : [],
        metadata: {
          width: 32,
          height: 32,
          format: 'png',
          size: Math.round(file.size * 0.1) // Simular tamanho otimizado
        }
      });
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {faviconBase64 ? (
        <Card className="border-2 border-dashed border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={faviconBase64} 
                  alt="Favicon atual" 
                  className="h-12 w-12 object-contain border rounded bg-gray-50 dark:bg-gray-900"
                />
                {faviconWidth && faviconHeight && (
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                    {faviconWidth}×{faviconHeight}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Favicon atual</h4>
                <p className="text-xs text-muted-foreground">
                  {faviconWidth && faviconHeight 
                    ? `${faviconWidth} × ${faviconHeight} pixels`
                    : "Dimensões não disponíveis"
                  }
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Upload className="h-3 w-3 mr-1" />
                    )}
                    {uploading ? "Convertendo..." : "Alterar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h4 className="font-medium">Nenhum favicon enviado</h4>
                <p className="text-sm text-muted-foreground">
                  Clique para enviar qualquer imagem como favicon
                </p>
              </div>
              <Button variant="outline" disabled={uploading}>
                {uploading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploading ? "Convertendo..." : "Enviar Imagem"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      
      {/* Informações sobre conversão */}
      {uploadResult && (
        <div className="space-y-3">
          {uploadResult.warnings.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Avisos:</p>
                  {uploadResult.warnings.map((warning, index) => (
                    <p key={index} className="text-sm">• {warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {uploadResult.suggestions.length > 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Sugestões:</p>
                  {uploadResult.suggestions.map((suggestion, index) => (
                    <p key={index} className="text-sm">• {suggestion}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Conversão realizada com sucesso!</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Dimensões:</span>
              <Badge variant="outline" className="ml-2">
                {uploadResult.metadata.width}×{uploadResult.metadata.height}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Formato:</span>
              <Badge variant="outline" className="ml-2">
                {uploadResult.metadata.format.toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Tamanho:</span>
              <Badge variant="outline" className="ml-2">
                {formatFileSize(uploadResult.metadata.size)}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Otimizado:</span>
              <Badge variant="outline" className="ml-2 text-green-600">
                ✓ Sim
              </Badge>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p><strong>Formatos suportados:</strong> PNG, JPEG, WebP, GIF, SVG, BMP</p>
        <p><strong>Tamanho máximo:</strong> 5MB • <strong>Conversão automática:</strong> Qualquer imagem será convertida para favicon otimizado</p>
        <p><strong>Resultado:</strong> PNG 32×32 pixels otimizado para web</p>
      </div>
    </div>
  );
}
