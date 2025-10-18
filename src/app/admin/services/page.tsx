"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import { 
  Scissors, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Tag,
  Loader2
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  IconUrl: string;
  description?: string;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Corte Masculino",
      description: "Corte moderno e estiloso para homens",
      price: 35.00,
      duration: 30,
      category: "Cabelo",
      imageUrl: "/IconCategorycabelo.svg",
      isActive: true
    },
    {
      id: "2",
      name: "Barba Completa",
      description: "Aparar e modelar a barba",
      price: 25.00,
      duration: 20,
      category: "Barba",
      imageUrl: "/IconCategoryBarba.svg",
      isActive: true
    },
    {
      id: "3",
      name: "Sobrancelha",
      description: "Design e limpeza das sobrancelhas",
      price: 15.00,
      duration: 15,
      category: "Sobrancelha",
      imageUrl: "/IconCategorySobrancelha.svg",
      isActive: true
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeForm, setActiveForm] = useState<'none' | 'service' | 'category'>('none');
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    category: "",
    imageUrl: "",
    isActive: true
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    iconUrl: "",
    description: ""
  });

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Carregar categorias do banco
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.description && newService.price > 0 && newService.duration > 0) {
      const service: Service = {
        id: Date.now().toString(),
        ...newService
      };
      setServices([...services, service]);
      setNewService({
        name: "",
        description: "",
        price: 0,
        duration: 0,
        category: "",
        imageUrl: "",
        isActive: true
      });
      setActiveForm('none');
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewService({ ...newService, imageUrl });
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name) {
      try {
        setSaving(true);
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCategory)
        });

        if (response.ok) {
          await loadCategories();
          setNewCategory({ name: "", iconUrl: "", description: "" });
          setActiveForm('none');
          alert('Categoria criada com sucesso!');
        } else {
          const error = await response.json();
          alert(error.error || 'Erro ao criar categoria');
        }
      } catch (error) {
        console.error('Erro ao criar categoria:', error);
        alert('Erro ao criar categoria');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        const response = await fetch(`/api/admin/categories?id=${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadCategories();
          alert('Categoria deletada com sucesso!');
        } else {
          const error = await response.json();
          alert(error.error || 'Erro ao deletar categoria');
        }
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        alert('Erro ao deletar categoria');
      }
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.IconUrl || "/IconCategorycabelo.svg";
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gerenciar Serviços
              </h1>
              <p className="text-muted-foreground">
                Adicione e gerencie os serviços oferecidos pela barbearia
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setActiveForm(activeForm === 'service' ? 'none' : 'service')}
                variant={activeForm === 'service' ? 'secondary' : 'default'}
              >
                <Plus className="h-4 w-4 mr-2" />
                {activeForm === 'service' ? 'Cancelar' : 'Adicionar Serviço'}
              </Button>
              <Button 
                variant={activeForm === 'category' ? 'secondary' : 'outline'}
                onClick={() => setActiveForm(activeForm === 'category' ? 'none' : 'category')}
              >
                <Tag className="h-4 w-4 mr-2" />
                {activeForm === 'category' ? 'Cancelar' : 'Gerenciar Categorias'}
              </Button>
            </div>
          </div>
        </div>

        {/* Formulário para gerenciar categorias */}
        {activeForm === 'category' && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Gerenciar Categorias
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Lista de categorias existentes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Categorias Existentes</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando categorias...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card key={category.id} className="group hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                <img
                                  src={category.IconUrl}
                                  alt={category.name}
                                  className="w-6 h-6 object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{category.name}</h4>
                                {category.description && (
                                  <p className="text-xs text-muted-foreground">{category.description}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulário para adicionar nova categoria */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Adicionar Nova Categoria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-name">Nome da Categoria</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Ex: Cabelo, Barba, Sobrancelha"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-icon">URL do Ícone</Label>
                    <Input
                      id="category-icon"
                      value={newCategory.iconUrl}
                      onChange={(e) => setNewCategory({ ...newCategory, iconUrl: e.target.value })}
                      placeholder="/IconCategorycabelo.svg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="category-description">Descrição (opcional)</Label>
                    <Input
                      id="category-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Descrição da categoria"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button onClick={handleAddCategory} disabled={saving || !newCategory.name}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Salvando..." : "Adicionar Categoria"}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveForm('none')}>
                    Fechar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário para adicionar serviço */}
        {activeForm === 'service' && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                Adicionar Novo Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Serviço</Label>
                    <Input
                      id="name"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      placeholder="Ex: Corte Masculino"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Descreva o serviço"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                      placeholder="35.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Categoria</Label>
                    <p className="text-sm text-muted-foreground mb-3">Selecione a categoria do serviço</p>
                    <div className="mt-2 p-4 border-2 border-border/50 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 backdrop-blur-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map((category) => {
                          const isSelected = newService.category === category.name;
                          return (
                            <label 
                              key={category.id} 
                              className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                                isSelected 
                                  ? 'border-primary bg-primary/10 shadow-md shadow-primary/20' 
                                  : 'border-border/30 hover:border-primary/50 hover:bg-background/50'
                              }`}
                            >
                              <div className="relative">
                                <input
                                  type="radio"
                                  name="category"
                                  value={category.name}
                                  checked={isSelected}
                                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                  isSelected 
                                    ? 'bg-primary border-primary' 
                                    : 'border-border group-hover:border-primary/50'
                                }`}>
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                                  <img
                                    src={category.IconUrl}
                                    alt={category.name}
                                    className="w-5 h-5 object-contain"
                                  />
                                </div>
                                <div>
                                  <span className={`text-sm font-medium transition-colors ${
                                    isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary/80'
                                  }`}>
                                    {category.name}
                                  </span>
                                  {category.description && (
                                    <p className="text-xs text-muted-foreground">{category.description}</p>
                                  )}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {newService.category && (
                        <div className="mt-4 pt-3 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-2">Categoria selecionada:</p>
                          <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                            {newService.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Ícone do Serviço</Label>
                    <div className="flex items-center space-x-4">
                      {newService.imageUrl && (
                        <img
                          src={newService.imageUrl}
                          alt="Preview"
                          className="w-12 h-12 object-contain"
                        />
                      )}
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="service-image-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('service-image-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Ícone
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Usar ícone da categoria</Label>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const categoryIcon = getCategoryIcon(newService.category);
                        setNewService({ ...newService, imageUrl: categoryIcon });
                      }}
                      disabled={!newService.category}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Usar Ícone da Categoria
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-4 border-t border-border">
                <Button onClick={handleAddService} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Serviço
                </Button>
                <Button variant="outline" onClick={() => setActiveForm('none')} className="px-6">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                  </div>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleServiceStatus(service.id)}
                    >
                      {service.isActive ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estatísticas dos serviços */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="h-5 w-5 mr-2" />
                Total de Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-sm text-muted-foreground">
                {services.filter(s => s.isActive).length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Preço Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(services.reduce((acc, service) => acc + service.price, 0) / services.length).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                Por serviço
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Duração Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(services.reduce((acc, service) => acc + service.duration, 0) / services.length)} min
              </div>
              <p className="text-sm text-muted-foreground">
                Por serviço
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
