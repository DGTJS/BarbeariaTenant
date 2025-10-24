"use client";

import { useState, useRef } from "react";
import { Button } from "@/_components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_components/ui/dialog";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { 
  Scissors, 
  Smile,
  Award,
  Sparkles,
  Heart,
  Star,
  TrendingUp,
  Zap,
  Coffee,
  ShoppingBag,
  Gift,
  Users,
  Crown,
  Gem,
  Palette,
  Brush,
  Droplet,
  Wind,
  Sun,
  Moon,
  CircleDot,
  Check,
  // Novos ícones para barbearia
  Flame,
  Waves,
  Sparkle,
  Eye,
  Hand,
  Skull,
  Feather,
  Flower2,
  Leaf,
  Package,
  Bath,
  CircleSlash2,
  ShowerHead,
  Wrench,
  Cog,
  Paintbrush,
  Fingerprint,
  Dumbbell,
  Activity,
  Target,
  CircleEllipsis,
  Hexagon,
  Triangle,
  Square,
  Circle,
  Diamond
} from "lucide-react";
import { Card, CardContent } from "@/_components/ui/card";

// Biblioteca de ícones disponíveis do Lucide
const AVAILABLE_ICONS = [
  // Ícones principais de barbearia
  { name: 'Scissors', component: Scissors, label: 'Tesoura' },
  { name: 'Brush', component: Brush, label: 'Escova' },
  { name: 'Droplet', component: Droplet, label: 'Gota' },
  { name: 'Waves', component: Waves, label: 'Ondas' },
  { name: 'Flame', component: Flame, label: 'Chama' },
  { name: 'Wind', component: Wind, label: 'Vento' },
  
  // Tratamentos e cuidados
  { name: 'Sparkles', component: Sparkles, label: 'Brilho' },
  { name: 'Sparkle', component: Sparkle, label: 'Estrela' },
  { name: 'Bath', component: Bath, label: 'Banho' },
  { name: 'ShowerHead', component: ShowerHead, label: 'Chuveiro' },
  { name: 'Flower2', component: Flower2, label: 'Flor' },
  { name: 'Leaf', component: Leaf, label: 'Folha' },
  
  // Detalhes e acabamento
  { name: 'Eye', component: Eye, label: 'Olho/Sobrancelha' },
  { name: 'Feather', component: Feather, label: 'Pena' },
  { name: 'Paintbrush', component: Paintbrush, label: 'Pincel Fino' },
  { name: 'Fingerprint', component: Fingerprint, label: 'Digital' },
  { name: 'CircleSlash2', component: CircleSlash2, label: 'Degrade' },
  
  // Combos e pacotes
  { name: 'Package', component: Package, label: 'Pacote' },
  { name: 'Gift', component: Gift, label: 'Presente' },
  { name: 'ShoppingBag', component: ShoppingBag, label: 'Sacola' },
  { name: 'Target', component: Target, label: 'Alvo' },
  
  // Premium e luxo
  { name: 'Crown', component: Crown, label: 'Coroa' },
  { name: 'Gem', component: Gem, label: 'Diamante' },
  { name: 'Star', component: Star, label: 'Estrela' },
  { name: 'Award', component: Award, label: 'Prêmio' },
  
  // Formas e símbolos
  { name: 'Circle', component: Circle, label: 'Círculo' },
  { name: 'Square', component: Square, label: 'Quadrado' },
  { name: 'Triangle', component: Triangle, label: 'Triângulo' },
  { name: 'Hexagon', component: Hexagon, label: 'Hexágono' },
  { name: 'Diamond', component: Diamond, label: 'Losango' },
  { name: 'CircleDot', component: CircleDot, label: 'Ponto' },
  { name: 'CircleEllipsis', component: CircleEllipsis, label: 'Reticências' },
  
  // Outros úteis
  { name: 'Users', component: Users, label: 'Pessoas' },
  { name: 'Hand', component: Hand, label: 'Mão' },
  { name: 'Smile', component: Smile, label: 'Sorriso' },
  { name: 'Heart', component: Heart, label: 'Coração' },
  { name: 'TrendingUp', component: TrendingUp, label: 'Crescimento' },
  { name: 'Zap', component: Zap, label: 'Raio' },
  { name: 'Activity', component: Activity, label: 'Atividade' },
  { name: 'Dumbbell', component: Dumbbell, label: 'Força' },
  { name: 'Palette', component: Palette, label: 'Paleta' },
  { name: 'Coffee', component: Coffee, label: 'Café' },
  { name: 'Sun', component: Sun, label: 'Sol' },
  { name: 'Moon', component: Moon, label: 'Lua' },
  { name: 'Wrench', component: Wrench, label: 'Ferramenta' },
  { name: 'Cog', component: Cog, label: 'Engrenagem' },
  { name: 'Skull', component: Skull, label: 'Caveira' }
];

// Ícones SVG personalizados (seus ícones existentes)
const CUSTOM_SVG_ICONS = [
  { url: '/IconCategorycabelo.svg', name: 'Cabelo', label: 'Cabelo' },
  { url: '/IconCategoryBarba.svg', name: 'Barba', label: 'Barba' },
  { url: '/IconCategorySobrancelha.svg', name: 'Sobrancelha', label: 'Sobrancelha' },
  { url: '/icons/treatments.svg', name: 'Treatments', label: 'Tratamentos' },
  { url: '/icons/combo.svg', name: 'Combo', label: 'Combo' }
];

interface IconSelectorProps {
  value: string;
  onChange: (iconUrl: string) => void;
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<'lucide' | 'custom' | 'upload'>('lucide');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLucideIcons = AVAILABLE_ICONS.filter(icon =>
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomIcons = CUSTOM_SVG_ICONS.filter(icon =>
    icon.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectIcon = (iconValue: string) => {
    onChange(iconValue);
    setOpen(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 2MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/category-icon', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer upload');
      }

      const data = await response.json();
      onChange(data.iconUrl);
      setOpen(false);
      toast.success('Ícone carregado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload do ícone');
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Determinar qual ícone mostrar no preview
  const getIconPreview = () => {
    // Se é um ícone do Lucide (começa com lucide:)
    if (value.startsWith('lucide:')) {
      const iconName = value.replace('lucide:', '');
      const icon = AVAILABLE_ICONS.find(i => i.name === iconName);
      if (icon) {
        const IconComponent = icon.component;
        return <IconComponent className="h-8 w-8" />;
      }
    }
    
    // Se é um SVG customizado ou base64
    if (value.startsWith('/') || value.startsWith('data:')) {
      return (
        <img 
          src={value} 
          alt="Ícone" 
          className="h-8 w-8 object-contain"
          onError={(e) => {
            e.currentTarget.src = '/icons/default.svg';
          }}
        />
      );
    }

    // Ícone padrão
    return <Scissors className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <div className="space-y-2">
      <Label>Ícone da Categoria</Label>
      <div className="flex gap-2">
        {/* Preview do ícone selecionado */}
        <div className="flex items-center justify-center w-16 h-16 border-2 border-dashed rounded-lg bg-muted">
          {getIconPreview()}
        </div>

        {/* Botão para abrir o seletor */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              Escolher Ícone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Selecione um Ícone</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Busca */}
              <Input
                placeholder="Buscar ícone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Tabs de tipo */}
              <div className="flex gap-2">
                <Button
                  variant={selectedType === 'lucide' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('lucide')}
                  size="sm"
                >
                  ✨ Ícones Lucide ({AVAILABLE_ICONS.length})
                </Button>
                <Button
                  variant={selectedType === 'custom' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('custom')}
                  size="sm"
                >
                  🎨 Ícones Personalizados ({CUSTOM_SVG_ICONS.length})
                </Button>
                <Button
                  variant={selectedType === 'upload' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('upload')}
                  size="sm"
                >
                  📤 Fazer Upload
                </Button>
              </div>

              {/* Grid de Ícones */}
              <div className="overflow-y-auto max-h-[450px] pr-2">
                {selectedType === 'lucide' ? (
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {filteredLucideIcons.map((icon) => {
                      const IconComponent = icon.component;
                      const iconValue = `lucide:${icon.name}`;
                      const isSelected = value === iconValue;

                      return (
                        <Card
                          key={icon.name}
                          className={`cursor-pointer hover:shadow-md transition-all ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleSelectIcon(iconValue)}
                        >
                          <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                            <div className="relative">
                              <IconComponent className="h-8 w-8" />
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-center text-muted-foreground truncate w-full">
                              {icon.label}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : selectedType === 'custom' ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredCustomIcons.map((icon) => {
                      const isSelected = value === icon.url;

                      return (
                        <Card
                          key={icon.url}
                          className={`cursor-pointer hover:shadow-md transition-all ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleSelectIcon(icon.url)}
                        >
                          <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                            <div className="relative">
                              <img
                                src={icon.url}
                                alt={icon.label}
                                className="h-12 w-12 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = '/icons/default.svg';
                                }}
                              />
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-center text-muted-foreground truncate w-full">
                              {icon.label}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Card 
                      className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors cursor-pointer w-full max-w-md"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {uploading ? (
                              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                            ) : (
                              <Upload className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {uploading ? 'Enviando...' : 'Fazer Upload de Ícone'}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Clique para selecionar uma imagem
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPEG, WebP • Máximo 2MB
                            </p>
                          </div>
                          <Button variant="outline" disabled={uploading}>
                            {uploading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Mensagem quando não há resultados */}
                {((selectedType === 'lucide' && filteredLucideIcons.length === 0) ||
                  (selectedType === 'custom' && filteredCustomIcons.length === 0)) && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum ícone encontrado
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {value && (
        <p className="text-xs text-muted-foreground">
          Selecionado: {value.startsWith('lucide:') ? value.replace('lucide:', '') : value}
        </p>
      )}
    </div>
  );
}


