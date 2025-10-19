"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Eye,
  Save,
  Plus,
  Loader2,
  X,
  Edit,
  CheckCircle
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
  const [viewingBanner, setViewingBanner] = useState<Banner | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<string | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    isActive: true,
    order: 1
  });

  const [editBanner, setEditBanner] = useState({
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

  const handleDeleteBanner = (banner: Banner) => {
    setBannerToDelete(banner);
  };

  const confirmDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      setDeletingBanner(bannerToDelete.id);
      const response = await fetch(`/api/admin/banners?id=${bannerToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar banner');
      }

      await loadBanners(); // Recarregar lista
      setBannerToDelete(null);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
      alert('Erro ao deletar banner. Tente novamente.');
    } finally {
      setDeletingBanner(null);
    }
  };

  const cancelDeleteBanner = () => {
    setBannerToDelete(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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

  const handleViewBanner = (banner: Banner) => {
    setViewingBanner(banner);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setEditBanner({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      isActive: banner.isActive,
      order: banner.order
    });
  };

  const handleUpdateBanner = async () => {
    if (!editingBanner) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingBanner.id,
          ...editBanner
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar banner');
      }

      await loadBanners();
      setEditingBanner(null);
      alert('Banner atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      alert('Erro ao atualizar banner. Tente novamente.');
    } finally {
      setSaving(false);
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

  const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui você implementaria o upload real da imagem
      const imageUrl = URL.createObjectURL(file);
      setEditBanner({ ...editBanner, imageUrl });
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
                          onClick={() => handleViewBanner(banner)}
                          title="Visualizar banner"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBanner(banner)}
                          title="Editar banner"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleBannerStatus(banner.id)}
                          title={banner.isActive ? "Desativar banner" : "Ativar banner"}
                        >
                          {banner.isActive ? "Desativar" : "Ativar"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner)}
                          disabled={deletingBanner === banner.id}
                          title="Deletar banner"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingBanner === banner.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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

      {/* Modal de Visualização */}
      <Dialog open={!!viewingBanner} onOpenChange={() => setViewingBanner(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Visualizar Banner</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingBanner(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {viewingBanner && (
            <div className="space-y-6">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src={viewingBanner.imageUrl}
                  alt={viewingBanner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{viewingBanner.title}</h3>
                  <p className="text-base opacity-90">{viewingBanner.subtitle}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Título</Label>
                  <p className="text-sm text-muted-foreground">{viewingBanner.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Subtítulo</Label>
                  <p className="text-sm text-muted-foreground">{viewingBanner.subtitle}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Status</Label>
                  <Badge variant={viewingBanner.isActive ? "default" : "secondary"}>
                    {viewingBanner.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Ordem</Label>
                  <p className="text-sm text-muted-foreground">{viewingBanner.order}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingBanner} onOpenChange={() => setEditingBanner(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Editar Banner</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingBanner(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {editingBanner && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editBanner.title}
                  onChange={(e) => setEditBanner({ ...editBanner, title: e.target.value })}
                  placeholder="Digite o título do banner"
                />
              </div>

              <div>
                <Label htmlFor="edit-subtitle">Subtítulo</Label>
                <Input
                  id="edit-subtitle"
                  value={editBanner.subtitle}
                  onChange={(e) => setEditBanner({ ...editBanner, subtitle: e.target.value })}
                  placeholder="Digite o subtítulo do banner"
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Imagem</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('edit-image')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar Imagem
                  </Button>
                </div>
                {editBanner.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={editBanner.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="edit-order">Ordem</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={editBanner.order}
                  onChange={(e) => setEditBanner({ ...editBanner, order: parseInt(e.target.value) })}
                  min="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={editBanner.isActive}
                  onChange={(e) => setEditBanner({ ...editBanner, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-active">Banner ativo</Label>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleUpdateBanner}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingBanner(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Deleção */}
      <Dialog open={!!bannerToDelete} onOpenChange={() => setBannerToDelete(null)}>
        <DialogContent className="max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          
          {bannerToDelete && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                  <Trash2 className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Tem certeza que deseja deletar este banner?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              {/* Preview do banner que será deletado */}
              <div className="border border-border rounded-lg p-3 bg-muted/50">
                <div className="flex items-center gap-3">
                  {bannerToDelete.imageUrl && (
                    <img
                      src={bannerToDelete.imageUrl}
                      alt={bannerToDelete.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{bannerToDelete.title}</h4>
                    <p className="text-sm text-muted-foreground">{bannerToDelete.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={bannerToDelete.isActive ? "default" : "secondary"}>
                        {bannerToDelete.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Ordem: {bannerToDelete.order}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelDeleteBanner}
                  className="flex-1"
                  disabled={deletingBanner === bannerToDelete.id}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteBanner}
                  disabled={deletingBanner === bannerToDelete.id}
                  className="flex-1"
                >
                  {deletingBanner === bannerToDelete.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deletando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar Banner
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={() => setShowSuccessModal(false)}>
        <DialogContent className="max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Banner Deletado
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Banner deletado com sucesso!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                O banner foi removido permanentemente da base de dados.
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={closeSuccessModal}
                className="px-8"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
