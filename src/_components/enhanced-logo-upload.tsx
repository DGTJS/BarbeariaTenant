"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { 
  Upload, 
  X, 
  Image, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  Trash2
} from "lucide-react";

interface EnhancedLogoUploadProps {
  logoBase64?: string;
  logoWidth?: number;
  logoHeight?: number;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  uploading: boolean;
  className?: string;
}

export default function EnhancedLogoUpload({ 
  logoBase64, 
  logoWidth, 
  logoHeight, 
  onUpload, 
  onRemove, 
  uploading,
  className = ""
}: EnhancedLogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState<{width: number, height: number} | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    warnings: string[];
  } | null>(null);

  // Atualizar preview quando logoBase64 mudar
  useEffect(() => {
    if (logoBase64) {
      setPreviewImage(logoBase64);
      setPreviewDimensions({
        width: logoWidth || 0,
        height: logoHeight || 0
      });
    }
  }, [logoBase64, logoWidth, logoHeight]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Criar preview imediato
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      
      // Obter dimensões da imagem
      const img = new Image();
      img.onload = () => {
        setPreviewDimensions({
          width: img.width,
          height: img.height
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    // Chamar função de upload
    onUpload(event);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageQuality = (width: number, height: number) => {
    if (width >= 200 && height >= 200) return { quality: 'Excelente', color: 'green' };
    if (width >= 100 && height >= 100) return { quality: 'Boa', color: 'blue' };
    if (width >= 50 && height >= 50) return { quality: 'Aceitável', color: 'yellow' };
    return { quality: 'Baixa', color: 'red' };
  };

  const quality = previewDimensions ? getImageQuality(previewDimensions.width, previewDimensions.height) : null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview da Logo */}
      {previewImage && (
        <Card className="border-2 border-dashed border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header do Preview */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-sm">Preview da Logo</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(previewImage, '_blank')}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ampliar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-700 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>

              {/* Imagem Preview */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Preview da logo" 
                    className="h-24 w-24 object-contain border rounded-lg bg-gray-50 dark:bg-gray-900 shadow-sm"
                  />
                  {previewDimensions && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                      {previewDimensions.width}×{previewDimensions.height}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  {/* Informações da Imagem */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Dimensões:</span>
                      <Badge variant="outline" className="ml-1">
                        {previewDimensions ? `${previewDimensions.width}×${previewDimensions.height}` : 'N/A'}
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

                  {/* Status do Upload */}
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Enviando logo...</span>
                    </div>
                  )}

                  {!uploading && logoBase64 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span>Logo salva com sucesso!</span>
                    </div>
                  )}
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Área de Upload */}
      {!previewImage && (
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
                <h4 className="font-medium">Nenhuma logo enviada</h4>
                <p className="text-sm text-muted-foreground">
                  Clique para enviar uma logo para sua barbearia
                </p>
              </div>
              <Button variant="outline" disabled={uploading}>
                {uploading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploading ? "Enviando..." : "Enviar Logo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão para Alterar Logo */}
      {previewImage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Enviando..." : "Alterar Logo"}
          </Button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p><strong>Formatos suportados:</strong> PNG, JPEG, WebP</p>
        <p><strong>Tamanho máximo:</strong> 2MB • <strong>Recomendado:</strong> 200×200 pixels ou maior</p>
        <p><strong>Preview:</strong> A imagem será exibida automaticamente após seleção</p>
      </div>
    </div>
  );
}
