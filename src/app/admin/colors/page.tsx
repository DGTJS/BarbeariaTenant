"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import { 
  Palette, 
  Save, 
  RotateCcw,
  Eye,
  Check
} from "lucide-react";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export default function ColorsConfig() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    primary: "#7f00e6",
    secondary: "#7f00e6", 
    accent: "#7f00e6",
    background: "#101828",
    foreground: "#ffffff",
    muted: "#1f2937",
    mutedForeground: "#9ca3af",
    border: "#374151",
    card: "#101828",
    cardForeground: "#ffffff"
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    setColorScheme(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefault = () => {
    setColorScheme({
      primary: "#7f00e6",
      secondary: "#7f00e6",
      accent: "#7f00e6", 
      background: "#101828",
      foreground: "#ffffff",
      muted: "#1f2937",
      mutedForeground: "#9ca3af",
      border: "#374151",
      card: "#101828",
      cardForeground: "#ffffff"
    });
  };

  const saveColors = () => {
    // Aqui você implementaria o salvamento das cores no banco de dados
    console.log("Salvando cores:", colorScheme);
    // Simular salvamento
    setTimeout(() => {
      alert("Cores salvas com sucesso!");
    }, 500);
  };

  const applyPreview = () => {
    if (previewMode) {
      // Remove preview
      document.documentElement.style.setProperty('--primary', '');
      document.documentElement.style.setProperty('--secondary', '');
      document.documentElement.style.setProperty('--accent', '');
      document.documentElement.style.setProperty('--background', '');
      document.documentElement.style.setProperty('--foreground', '');
      document.documentElement.style.setProperty('--muted', '');
      document.documentElement.style.setProperty('--muted-foreground', '');
      document.documentElement.style.setProperty('--border', '');
      document.documentElement.style.setProperty('--card', '');
      document.documentElement.style.setProperty('--card-foreground', '');
    } else {
      // Apply preview
      document.documentElement.style.setProperty('--primary', colorScheme.primary);
      document.documentElement.style.setProperty('--secondary', colorScheme.secondary);
      document.documentElement.style.setProperty('--accent', colorScheme.accent);
      document.documentElement.style.setProperty('--background', colorScheme.background);
      document.documentElement.style.setProperty('--foreground', colorScheme.foreground);
      document.documentElement.style.setProperty('--muted', colorScheme.muted);
      document.documentElement.style.setProperty('--muted-foreground', colorScheme.mutedForeground);
      document.documentElement.style.setProperty('--border', colorScheme.border);
      document.documentElement.style.setProperty('--card', colorScheme.card);
      document.documentElement.style.setProperty('--card-foreground', colorScheme.cardForeground);
    }
    setPreviewMode(!previewMode);
  };

  const colorFields = [
    { key: 'primary' as keyof ColorScheme, label: 'Cor Primária', description: 'Botões principais e elementos de destaque' },
    { key: 'secondary' as keyof ColorScheme, label: 'Cor Secundária', description: 'Botões secundários e elementos complementares' },
    { key: 'accent' as keyof ColorScheme, label: 'Cor de Destaque', description: 'Links e elementos interativos' },
    { key: 'background' as keyof ColorScheme, label: 'Fundo Principal', description: 'Cor de fundo da aplicação' },
    { key: 'foreground' as keyof ColorScheme, label: 'Texto Principal', description: 'Cor do texto principal' },
    { key: 'muted' as keyof ColorScheme, label: 'Fundo Secundário', description: 'Fundo de cards e elementos secundários' },
    { key: 'mutedForeground' as keyof ColorScheme, label: 'Texto Secundário', description: 'Texto de menor importância' },
    { key: 'border' as keyof ColorScheme, label: 'Bordas', description: 'Cor das bordas e divisores' },
    { key: 'card' as keyof ColorScheme, label: 'Fundo de Cards', description: 'Fundo dos cards e painéis' },
    { key: 'cardForeground' as keyof ColorScheme, label: 'Texto de Cards', description: 'Texto dentro dos cards' }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Configuração de Cores
          </h1>
          <p className="text-muted-foreground">
            Personalize as cores do seu site
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Configuração de cores */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Paleta de Cores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {colorFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id={field.key}
                          type="color"
                          value={colorScheme[field.key]}
                          onChange={(e) => handleColorChange(field.key, e.target.value)}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={colorScheme[field.key]}
                          onChange={(e) => handleColorChange(field.key, e.target.value)}
                          className="flex-1"
                          placeholder="#000000"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview e controles */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: colorScheme.card,
                      color: colorScheme.cardForeground,
                      borderColor: colorScheme.border
                    }}
                  >
                    <h3 className="font-semibold mb-2">Card de Exemplo</h3>
                    <p className="text-sm mb-3" style={{ color: colorScheme.mutedForeground }}>
                      Este é um exemplo de como ficará o texto secundário
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        className="px-3 py-1 rounded text-sm font-medium"
                        style={{ 
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.foreground
                        }}
                      >
                        Botão Primário
                      </button>
                      <button 
                        className="px-3 py-1 rounded text-sm font-medium border"
                        style={{ 
                          backgroundColor: 'transparent',
                          color: colorScheme.foreground,
                          borderColor: colorScheme.border
                        }}
                      >
                        Botão Secundário
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={applyPreview} 
                  variant={previewMode ? "default" : "outline"}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? "Remover Preview" : "Aplicar Preview"}
                </Button>
                
                <Button onClick={resetToDefault} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar Padrão
                </Button>
                
                <Button onClick={saveColors} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Cores
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={previewMode ? "default" : "secondary"}>
                    {previewMode ? "Preview Ativo" : "Preview Inativo"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {previewMode 
                    ? "As cores estão sendo aplicadas em tempo real" 
                    : "Clique em 'Aplicar Preview' para ver as mudanças"
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
