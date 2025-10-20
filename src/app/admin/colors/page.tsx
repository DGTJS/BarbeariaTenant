"use client";

import { useState, useEffect } from "react";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select";
import { Textarea } from "@/_components/ui/textarea";
import { Switch } from "@/_components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Palette,
  Eye,
  EyeOff,
  RefreshCw,
  Droplets
} from "lucide-react";
import { toast } from "sonner";
import ColorPicker from "@/_components/color-picker";

interface ColorConfig {
  id: string;
  name: string;
  category: string;
  value: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ColorAdminPage = () => {
  const [colors, setColors] = useState<ColorConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingColor, setEditingColor] = useState<ColorConfig | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    value: "",
    description: "",
    isActive: true,
    order: 1
  });

  const categories = [
    "background", "card", "booking", "text", "state", 
    "input", "border", "primary", "accent", "muted"
  ];

  // Função para converter hex para oklch (aproximação)
  const hexToOklch = (hex: string): string => {
    // Remove # se presente
    hex = hex.replace('#', '');
    
    // Converte hex para RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Conversão aproximada RGB para OKLCH
    // Esta é uma conversão simplificada para demonstração
    const lightness = Math.sqrt(0.299 * r + 0.587 * g + 0.114 * b);
    const chroma = Math.sqrt(Math.pow(r - g, 2) + Math.pow(g - b, 2) + Math.pow(b - r, 2)) / 2;
    const hue = Math.atan2(b - g, r - g) * 180 / Math.PI;
    
    return `oklch(${(lightness * 100).toFixed(1)}% ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
  };

  // Função para extrair hex de oklch (aproximação)
  const oklchToHex = (oklch: string): string => {
    // Se já é hex, retorna
    if (oklch.startsWith('#')) return oklch;
    
    // Extrai valores do oklch
    const match = oklch.match(/oklch\(([^)]+)\)/);
    if (!match) return '#000000';
    
    const values = match[1].split(' ').map(v => v.replace('%', ''));
    const l = parseFloat(values[0]) / 100;
    const c = parseFloat(values[1]);
    const h = parseFloat(values[2]);
    
    // Conversão aproximada OKLCH para RGB
    const a = c * Math.cos(h * Math.PI / 180);
    const b = c * Math.sin(h * Math.PI / 180);
    
    let r = l + 0.3963377774 * a + 0.2158037573 * b;
    let g = l - 0.1055613458 * a - 0.0638541728 * b;
    let blue = l - 0.0894841775 * a - 1.2914855480 * b;
    
    // Clamp values
    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    blue = Math.max(0, Math.min(1, blue));
    
    // Converte para hex
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(blue)}`;
  };

  // Buscar cores
  const fetchColors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/colors");
      if (response.ok) {
        const data = await response.json();
        setColors(data);
      } else {
        toast.error("Erro ao carregar cores");
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast.error("Erro ao carregar cores");
    } finally {
      setLoading(false);
    }
  };

  // Salvar cor
  const saveColor = async (colorData: any, isEdit = false) => {
    try {
      setSaving(isEdit ? editingColor?.id || "" : "creating");
      
      const url = "/api/admin/colors";
      const method = isEdit ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isEdit ? { id: editingColor?.id, ...colorData } : colorData),
      });

      if (response.ok) {
        toast.success(isEdit ? "Cor atualizada com sucesso!" : "Cor criada com sucesso!");
        await fetchColors();
        resetForm();
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setEditingColor(null);
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao salvar cor");
      }
    } catch (error) {
      console.error("Error saving color:", error);
      toast.error("Erro ao salvar cor");
    } finally {
      setSaving(null);
    }
  };

  // Deletar cor
  const deleteColor = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta cor?")) return;

    try {
      setSaving(id);
      const response = await fetch(`/api/admin/colors?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Cor deletada com sucesso!");
        await fetchColors();
      } else {
        toast.error("Erro ao deletar cor");
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("Erro ao deletar cor");
    } finally {
      setSaving(null);
    }
  };

  // Ativar/Desativar cor
  const toggleColorStatus = async (color: ColorConfig) => {
    try {
      setSaving(color.id);
      const response = await fetch("/api/admin/colors", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: color.id,
          isActive: !color.isActive,
        }),
      });

      if (response.ok) {
        toast.success(`Cor ${!color.isActive ? "ativada" : "desativada"} com sucesso!`);
        await fetchColors();
      } else {
        toast.error("Erro ao atualizar status da cor");
      }
    } catch (error) {
      console.error("Error toggling color status:", error);
      toast.error("Erro ao atualizar status da cor");
    } finally {
      setSaving(null);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      value: "",
      description: "",
      isActive: true,
      order: 1
    });
  };

  // Abrir modal de edição
  const openEditModal = (color: ColorConfig) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      category: color.category,
      value: color.value,
      description: color.description || "",
      isActive: color.isActive,
      order: color.order
    });
    setIsEditModalOpen(true);
  };

  // Aplicar cores dinamicamente
  const applyColorsToPage = () => {
    colors.forEach(color => {
      if (color.isActive) {
        const cssVar = `--${color.category}-${color.name}`;
        document.documentElement.style.setProperty(cssVar, color.value);
      }
    });
    toast.success("Cores aplicadas à página!");
  };

  // Atualizar cor rapidamente com color picker (com debounce)
  const updateColorWithPicker = (colorId: string, newHexValue: string) => {
    const newOklchValue = hexToOklch(newHexValue);
    const currentColor = colors.find(c => c.id === colorId);
    
    // Verificar se a cor realmente mudou
    if (currentColor && currentColor.value === newOklchValue) {
      return;
    }
    
    // Aplicar a cor imediatamente para preview
    if (currentColor) {
      const cssVar = `--${currentColor.category}-${currentColor.name}`;
      document.documentElement.style.setProperty(cssVar, newOklchValue);
    }
    
    // Limpar timeout anterior
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    // Criar novo timeout para salvar no banco
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch("/api/admin/colors", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: colorId,
            value: newOklchValue,
          }),
        });

        if (response.ok) {
          // Atualizar a cor localmente
          const updatedColors = colors.map(color => 
            color.id === colorId ? { ...color, value: newOklchValue } : color
          );
          setColors(updatedColors);
        } else {
          // Reverter a cor se houve erro
          if (currentColor) {
            const cssVar = `--${currentColor.category}-${currentColor.name}`;
            document.documentElement.style.setProperty(cssVar, currentColor.value);
          }
          toast.error("Erro ao atualizar cor");
        }
      } catch (error) {
        console.error("Error updating color:", error);
        // Reverter a cor se houve erro
        if (currentColor) {
          const cssVar = `--${currentColor.category}-${currentColor.name}`;
          document.documentElement.style.setProperty(cssVar, currentColor.value);
        }
        toast.error("Erro ao atualizar cor");
      }
    }, 500); // 500ms de debounce
    
    setUpdateTimeout(timeout);
  };

  // Organizar cores por categoria
  const colorsByCategory = colors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, ColorConfig[]>);

  useEffect(() => {
    fetchColors();
  }, []);

  // Fechar color picker quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorPicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('.color-picker-container')) {
          setShowColorPicker(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  // Cleanup timeout ao desmontar componente
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    };
  }, [updateTimeout]);

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
          <h1 className="text-3xl font-bold text-foreground">Configuração de Cores</h1>
          <p className="text-foreground-muted">Gerencie as cores do sistema</p>
          <p className="text-sm text-foreground-muted mt-1">
            💡 Clique no quadrado de cor para abrir o seletor visual
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={applyColorsToPage} variant="outline">
            <Palette className="h-4 w-4 mr-2" />
            Aplicar Todas as Cores
          </Button>
          <Button onClick={fetchColors} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Cor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Cor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: primary-main"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Valor da Cor</Label>
                        <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Ex: oklch(0.5 0.2 180)"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição da cor"
                  />
                </div>
                <div>
                  <Label htmlFor="order">Ordem</Label>
                        <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Ativo</Label>
                    </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => saveColor(formData)}
                    disabled={saving === "creating"}
                    className="flex-1"
                  >
                    {saving === "creating" ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
          </div>

      {/* Cores por Categoria */}
      <div className="grid gap-6">
        {Object.entries(colorsByCategory).map(([category, categoryColors]) => (
          <Card key={category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <Badge variant="secondary">{categoryColors.length}</Badge>
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    categoryColors.forEach(color => {
                      if (color.isActive) {
                        const cssVar = `--${color.category}-${color.name}`;
                        document.documentElement.style.setProperty(cssVar, color.value);
                      }
                    });
                    toast.success(`Cores da categoria ${category} aplicadas!`);
                  }}
                >
                  <Palette className="h-4 w-4 mr-1" />
                  Aplicar
                </Button>
              </div>
            </CardHeader>
              <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryColors.map((color) => (
                  <div
                    key={color.id}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{color.name}</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleColorStatus(color)}
                          disabled={saving === color.id}
                        >
                          {color.isActive ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(color)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteColor(color.id)}
                          disabled={saving === color.id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative color-picker-container">
                        <div
                          className="w-12 h-12 rounded border border-border cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: color.value }}
                          onClick={() => setShowColorPicker(showColorPicker === color.id ? null : color.id)}
                        />
                        {showColorPicker === color.id && (
                          <div className="absolute top-14 left-0 z-50 color-picker-container">
                            <ColorPicker
                              value={oklchToHex(color.value)}
                              onChange={(newColor) => updateColorWithPicker(color.id, newColor)}
                              label=""
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground-muted font-mono">
                          {color.value}
                        </p>
                        {color.description && (
                          <p className="text-xs text-foreground-muted">
                            {color.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={color.isActive ? "default" : "secondary"}>
                        {color.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      <span className="text-xs text-foreground-muted">
                        Ordem: {color.order}
                      </span>
                    </div>
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-value">Valor da Cor</Label>
              <Input
                id="edit-value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-order">Ordem</Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Ativo</Label>
            </div>
            <div className="flex gap-2 pt-4">
                <Button 
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1"
              >
                Cancelar
                </Button>
              <Button
                onClick={() => saveColor(formData, true)}
                disabled={saving === editingColor?.id}
                className="flex-1"
              >
                {saving === editingColor?.id ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                  <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
                </Button>
                </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColorAdminPage;