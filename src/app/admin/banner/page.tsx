"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Eye,
  Save,
  Plus,
  Loader2
} from "lucide-react";
// Removido import das funções do Prisma - agora usando API routes

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function BannerConfig() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    isActive: true,
    order: 1
  });

  // Carregar banners do banco de dados
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/banners');
      if (!response.ok) {
        throw new Error('Erro ao carregar banners');
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async () => {
    if (newBanner.title && newBanner.subtitle && newBanner.imageUrl) {
      try {
        setSaving(true);
        const response = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBanner)
        });

        if (!response.ok) {
          throw new Error('Erro ao criar banner');
        }

        await loadBanners(); // Recarregar lista
        setNewBanner({
          title: "",
          subtitle: "",
          imageUrl: "",
          isActive: true,
          order: banners.length + 1
        });
      } catch (error) {
        console.error('Erro ao criar banner:', error);
        alert('Erro ao criar banner');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este banner?')) {
      try {
        const response = await fetch(`/api/admin/banners?id=${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Erro ao deletar banner');
        }

        await loadBanners(); // Recarregar lista
      } catch (error) {
        console.error('Erro ao deletar banner:', error);
        alert('Erro ao deletar banner');
      }
    }
  };

  const handleToggleBannerStatus = async (id: string) => {
    try {
      const banner = banners.find(b => b.id === id);
      if (!banner) return;

      const response = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isActive: !banner.isActive
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar status do banner');
      }

      await loadBanners(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error);
      alert('Erro ao alterar status do banner');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui você implementaria o upload real da imagem
      const imageUrl = URL.createObjectURL(file);
      setNewBanner({ ...newBanner, imageUrl });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando banners...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Configuração de Banner
          </h1>
          <p className="text-muted-foreground">
            Gerencie os banners da página inicial
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Formulário para adicionar banner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Novo Banner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  placeholder="Digite o título do banner"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  placeholder="Digite o subtítulo do banner"
                />
              </div>

              <div>
                <Label htmlFor="image">Imagem</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload de Imagem
                  </Button>
                </div>
                {newBanner.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={newBanner.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="order">Ordem</Label>
                <Input
                  id="order"
                  type="number"
                  value={newBanner.order}
                  onChange={(e) => setNewBanner({ ...newBanner, order: parseInt(e.target.value) })}
                  min="1"
                />
              </div>

              <Button onClick={handleAddBanner} className="w-full" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? "Salvando..." : "Adicionar Banner"}
              </Button>
            </CardContent>
          </Card>

          {/* Lista de banners existentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Banners Existentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {banner.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {banner.subtitle}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={banner.isActive ? "default" : "secondary"}>
                            {banner.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Ordem: {banner.order}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleBannerStatus(banner.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {banner.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
