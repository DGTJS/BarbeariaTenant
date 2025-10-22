"use client";

import { useState, useRef } from "react";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import { Upload, X, Image, RefreshCw } from "lucide-react";

interface LogoUploadProps {
  logoBase64?: string;
  logoWidth?: number;
  logoHeight?: number;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  uploading: boolean;
}

export default function LogoUpload({ 
  logoBase64, 
  logoWidth, 
  logoHeight, 
  onUpload, 
  onRemove, 
  uploading 
}: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      {logoBase64 ? (
        <Card className="border-2 border-dashed border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={logoBase64} 
                  alt="Logo atual" 
                  className="h-20 w-20 object-contain border rounded-lg bg-gray-50 dark:bg-gray-900"
                />
                {logoWidth && logoHeight && (
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                    {logoWidth}×{logoHeight}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Logo atual</h4>
                <p className="text-xs text-muted-foreground">
                  {logoWidth && logoHeight 
                    ? `${logoWidth} × ${logoHeight} pixels`
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
                    {uploading ? "Enviando..." : "Alterar"}
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
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onUpload}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground text-center">
        Formatos suportados: PNG, JPEG, WebP • Tamanho máximo: 2MB
      </p>
    </div>
  );
}

