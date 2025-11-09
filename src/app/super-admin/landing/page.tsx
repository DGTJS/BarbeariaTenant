"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Image, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function LandingPageManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    heroTitle: "",
    heroSubtitle: "",
    ctaText: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Implementar API endpoints
      toast.info("Funcionalidade em desenvolvimento");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    file: File,
    section: string,
    position: string
  ) => {
    try {
      // TODO: Implementar upload de imagem
      toast.info("Upload em desenvolvimento");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload da imagem.");
    }
  };

  const handleSaveConfig = async () => {
    try {
      // TODO: Implementar API endpoint
      toast.success("Configurações salvas!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Landing Page</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie imagens e conteúdo da página inicial
        </p>
      </div>

      {/* Configurações de Texto */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              value={config.heroTitle}
              onChange={e =>
                setConfig({ ...config, heroTitle: e.target.value })
              }
              placeholder="Ex: Sistema de Agendamento Completo"
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Input
              id="heroSubtitle"
              value={config.heroSubtitle}
              onChange={e =>
                setConfig({ ...config, heroSubtitle: e.target.value })
              }
              placeholder="Ex: Gerencie sua barbearia de forma profissional"
            />
          </div>
          <div>
            <Label htmlFor="ctaText">Texto do Botão CTA</Label>
            <Input
              id="ctaText"
              value={config.ctaText}
              onChange={e => setConfig({ ...config, ctaText: e.target.value })}
              placeholder="Ex: Começar Agora"
            />
          </div>
          <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Gerenciamento de Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens da Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hero Image */}
            <div className="space-y-2">
              <Label>Imagem do Hero</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">
                  Faça upload da imagem principal
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "hero", "main");
                  }}
                  className="hidden"
                  id="hero-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("hero-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Features Image */}
            <div className="space-y-2">
              <Label>Imagem de Features</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">
                  Faça upload da imagem de recursos
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "features", "main");
                  }}
                  className="hidden"
                  id="features-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("features-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
