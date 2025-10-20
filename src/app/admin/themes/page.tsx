"use client";

import { useState, useEffect } from "react";
import { Button } from "@/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { 
  Palette, 
  Sun, 
  Moon, 
  Check,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import IconFilterDemo from "@/_components/icon-filter-demo";

interface Theme {
  id: string;
  name: string;
  description?: string;
  type: string;
  isActive: boolean;
  colors: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeAdminPage = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  // Buscar temas
  const fetchThemes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/themes");
      if (response.ok) {
        const data = await response.json();
        setThemes(data);
      } else {
        toast.error("Erro ao carregar temas");
      }
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast.error("Erro ao carregar temas");
    } finally {
      setLoading(false);
    }
  };

  // Aplicar tema
  const applyTheme = async (themeId: string) => {
    try {
      setApplying(themeId);
      
      // Ativar tema no banco
      const response = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: themeId,
          isActive: true,
        }),
      });

      if (response.ok) {
        // Aplicar cores imediatamente
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
          Object.entries(theme.colors).forEach(([name, value]) => {
            const cssVar = `--${name}`;
            document.documentElement.style.setProperty(cssVar, value);
          });
        }
        
        // Atualizar lista local
        const updatedThemes = themes.map(t => ({
          ...t,
          isActive: t.id === themeId
        }));
        setThemes(updatedThemes);
        
        toast.success(`Tema "${themes.find(t => t.id === themeId)?.name}" aplicado com sucesso!`);
      } else {
        toast.error("Erro ao aplicar tema");
      }
    } catch (error) {
      console.error("Error applying theme:", error);
      toast.error("Erro ao aplicar tema");
    } finally {
      setApplying(null);
    }
  };

  // Aplicar todas as cores atuais
  const applyCurrentColors = () => {
    const activeTheme = themes.find(t => t.isActive);
    if (activeTheme) {
      Object.entries(activeTheme.colors).forEach(([name, value]) => {
        const cssVar = `--${name}`;
        document.documentElement.style.setProperty(cssVar, value);
      });
      toast.success("Cores aplicadas à página!");
    } else {
      toast.error("Nenhum tema ativo encontrado");
    }
  };

  // Obter ícone do tipo de tema
  const getThemeIcon = (type: string) => {
    switch (type) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  // Obter cor de preview do tema
  const getThemePreviewColor = (colors: Record<string, string>) => {
    return colors['primary-main'] || colors['background-main'] || '#3b82f6';
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Temas do Sistema</h1>
          <p className="text-foreground-muted">Escolha um tema elegante para sua aplicação</p>
          <p className="text-sm text-foreground-muted mt-1">
            ✨ Clique em "Aplicar" para usar o tema em todo o sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={applyCurrentColors} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aplicar Cores
          </Button>
          <Button onClick={fetchThemes} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar
          </Button>
        </div>
      </div>

      {/* Demo do Filtro de Ícones */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Demo: Filtro Automático de Ícones
        </h2>
        <p className="text-foreground-muted mb-4">
          Os ícones das categorias agora se adaptam automaticamente ao tema. 
          Em temas claros, os ícones ficam escuros. Em temas escuros, ficam brancos.
        </p>
        <IconFilterDemo 
          iconUrl="/IconCategorycabelo.svg" 
          iconName="Cabelo" 
        />
      </div>

      {/* Temas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id} className="relative overflow-hidden">
            {theme.isActive && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500 text-white">
                  <Check className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-border flex items-center justify-center"
                  style={{ backgroundColor: getThemePreviewColor(theme.colors) }}
                >
                  {getThemeIcon(theme.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{theme.name}</CardTitle>
                  <p className="text-sm text-foreground-muted">
                    {theme.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Preview das cores principais */}
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(theme.colors)
                  .filter(([key]) => 
                    key.includes('primary') || 
                    key.includes('background') || 
                    key.includes('card')
                  )
                  .slice(0, 8)
                  .map(([name, value]) => (
                    <div
                      key={name}
                      className="w-full h-8 rounded border border-border"
                      style={{ backgroundColor: value }}
                      title={`${name}: ${value}`}
                    />
                  ))}
              </div>
              
              {/* Informações do tema */}
              <div className="flex items-center justify-between">
                <Badge variant={theme.type === 'dark' ? 'default' : 'secondary'}>
                  {theme.type === 'dark' ? 'Escuro' : 'Claro'}
                </Badge>
                <span className="text-xs text-foreground-muted">
                  {Object.keys(theme.colors).length} cores
                </span>
              </div>
              
              {/* Botão de aplicar */}
              <Button
                onClick={() => applyTheme(theme.id)}
                disabled={applying === theme.id || theme.isActive}
                className="w-full"
                variant={theme.isActive ? "secondary" : "default"}
              >
                {applying === theme.id ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Aplicando...
                  </>
                ) : theme.isActive ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Tema Ativo
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Aplicar Tema
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações adicionais */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">Como Funciona</h3>
            <p className="text-sm text-foreground-muted">
              Cada tema contém um conjunto completo de cores que são aplicadas em toda a aplicação.
              Os temas incluem cores para fundos, cards, textos, botões e elementos de interface.
            </p>
            <p className="text-xs text-foreground-muted">
              💡 Dica: Os temas são aplicados instantaneamente e salvos automaticamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeAdminPage;

