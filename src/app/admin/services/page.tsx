"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Textarea } from "@/_components/ui/textarea";
import { Badge } from "@/_components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/_components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { 
  Scissors, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  DollarSign,
  Tag,
  Loader2,
  Settings,
  List,
  FolderKanban
} from "lucide-react";
import { toast } from "sonner";
import IconSelector from "@/_components/icon-selector";
import DynamicIcon from "@/_components/dynamic-icon";

interface ServiceOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  status: boolean;
}

interface Category {
  id: string;
  name: string;
  IconUrl: string;
  description?: string;
  _count?: {
    services: number;
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  status: boolean;
  categoryId?: string;
  category?: Category;
  serviceOptions?: ServiceOption[];
  _count?: {
    serviceOptions: number;
  };
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteOptionDialogOpen, setIsDeleteOptionDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [optionToDelete, setOptionToDelete] = useState<ServiceOption | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    categoryId: "",
    imageUrl: "",
    status: true
  });

  const [optionForm, setOptionForm] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 15,
    status: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    iconUrl: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadServices(), loadCategories()]);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  const loadServiceOptions = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/admin/service-options?serviceId=${serviceId}`);
      if (response.ok) {
        const data = await response.json();
        setServiceOptions(data);
      }
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      toast.error('Erro ao carregar opções');
    }
  };

  const handleSaveService = async () => {
    try {
      setSaving(true);
      const method = editingService ? 'PUT' : 'POST';
      const body = editingService
        ? { id: editingService.id, ...serviceForm }
        : serviceForm;

      const response = await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(editingService ? 'Serviço atualizado!' : 'Serviço criado!');
        setIsServiceDialogOpen(false);
        resetServiceForm();
        loadServices();
      } else {
        toast.error('Erro ao salvar serviço');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao salvar serviço');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`/api/admin/services?id=${serviceToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Serviço excluído!');
        setIsDeleteDialogOpen(false);
        setServiceToDelete(null);
        loadServices();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao excluir serviço');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao excluir serviço');
    }
  };

  const handleSaveOption = async () => {
    if (!selectedService) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/service-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...optionForm,
          serviceId: selectedService.id
        })
      });

      if (response.ok) {
        toast.success('Opção adicionada!');
        resetOptionForm();
        loadServiceOptions(selectedService.id);
        loadServices();
      } else {
        toast.error('Erro ao adicionar opção');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao adicionar opção');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteOptionDialog = (option: ServiceOption) => {
    setOptionToDelete(option);
    setIsDeleteOptionDialogOpen(true);
  };

  const handleDeleteOption = async () => {
    if (!optionToDelete) return;

    try {
      const response = await fetch(`/api/admin/service-options?id=${optionToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Opção excluída!');
        setIsDeleteOptionDialogOpen(false);
        setOptionToDelete(null);
        if (selectedService) {
          loadServiceOptions(selectedService.id);
          loadServices();
        }
      } else {
        toast.error('Erro ao excluir opção');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao excluir opção');
    }
  };

  const handleSaveCategory = async () => {
      try {
        setSaving(true);
        const method = editingCategory ? 'PUT' : 'POST';
        const body = editingCategory
          ? { id: editingCategory.id, ...categoryForm }
          : categoryForm;

        const response = await fetch('/api/admin/categories', {
          method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
        });

        if (response.ok) {
        toast.success(editingCategory ? 'Categoria atualizada!' : 'Categoria criada!');
        setIsCategoryDialogOpen(false);
        resetCategoryForm();
        loadCategories();
        } else {
        toast.error(editingCategory ? 'Erro ao atualizar categoria' : 'Erro ao criar categoria');
        }
      } catch (error) {
      console.error('Erro:', error);
      toast.error(editingCategory ? 'Erro ao atualizar categoria' : 'Erro ao criar categoria');
      } finally {
        setSaving(false);
    }
  };

  const openDeleteCategoryDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Categoria excluída!');
        setIsDeleteCategoryDialogOpen(false);
        setCategoryToDelete(null);
        loadCategories();
      } else {
        toast.error('Erro ao excluir categoria');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao excluir categoria');
    }
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || "",
      price: Number(service.price),
      duration: service.duration,
      categoryId: service.categoryId || "",
      imageUrl: service.imageUrl,
      status: service.status
    });
    setIsServiceDialogOpen(true);
  };

  const openManageOptions = async (service: Service) => {
    setSelectedService(service);
    await loadServiceOptions(service.id);
    setIsOptionDialogOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      iconUrl: category.IconUrl
    });
    setIsCategoryDialogOpen(true);
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      categoryId: "",
      imageUrl: "",
      status: true
    });
  };

  const resetOptionForm = () => {
    setOptionForm({
      name: "",
      description: "",
      price: 0,
      duration: 15,
      status: true
    });
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      iconUrl: ""
    });
  };

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter(s => s.categoryId === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-3xl font-bold">Gerenciar Serviços</h1>
            <p className="text-muted-foreground mt-1">
              {services.length} serviços em {categories.length} categorias
              </p>
            </div>
          <Dialog open={isServiceDialogOpen} onOpenChange={(open) => {
            setIsServiceDialogOpen(open);
            if (!open) resetServiceForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={resetServiceForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Nome do Serviço</Label>
                  <Input
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                    placeholder="Ex: Corte Degradê"
                  />
            </div>
                <div className="col-span-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                    placeholder="Descrição do serviço"
                    rows={3}
                                />
                              </div>
                              <div>
                  <Label>Categoria</Label>
                  <Select 
                    value={serviceForm.categoryId}
                    onValueChange={(value) => setServiceForm({...serviceForm, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>
                  <div>
                  <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({...serviceForm, price: Number(e.target.value)})}
                    placeholder="45.00"
                    />
                  </div>
                <div className="col-span-2">
                  <Label>Duração (minutos)</Label>
                    <Input
                      type="number"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({...serviceForm, duration: Number(e.target.value)})}
                      placeholder="30"
                    />
                  </div>
                <div className="col-span-2">
                  <Button onClick={handleSaveService} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingService ? 'Atualizar' : 'Criar Serviço')}
                        </Button>
                      </div>
                    </div>
            </DialogContent>
          </Dialog>
                  </div>

        {/* Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="services">
              <Scissors className="h-4 w-4 mr-2" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FolderKanban className="h-4 w-4 mr-2" />
              Categorias
            </TabsTrigger>
          </TabsList>

          {/* Aba de Serviços */}
          <TabsContent value="services" className="space-y-4">
            {/* Filtro por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtrar por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                    <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    Todas ({services.length})
                    </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name} ({cat._count?.services || 0})
                </Button>
                  ))}
              </div>
            </CardContent>
          </Card>

            {/* Lista de Serviços */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Scissors className="h-4 w-4" />
                          {service.name}
                        </CardTitle>
                        {service.category && (
                          <Badge variant="outline" className="mt-2">
                            {service.category.name}
                          </Badge>
                        )}
                    </div>
                      <Badge variant={service.status ? "default" : "secondary"}>
                        {service.status ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                  
                    <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                      <div>
                        <p className="text-xs text-muted-foreground">Preço Base</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-lg text-green-600">R$ {Number(service.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Duração</p>
                        <div className="flex items-center gap-1 justify-end">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">{service.duration}min</span>
                    </div>
                    </div>
                  </div>

                    {service._count && service._count.serviceOptions > 0 && (
                      <Badge variant="secondary" className="w-full justify-center">
                        <List className="h-3 w-3 mr-1" />
                        {service._count.serviceOptions} opção(ões)
                      </Badge>
                    )}

                    <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                        onClick={() => openManageOptions(service)}
                        className="flex-1"
                    >
                        <Settings className="h-4 w-4 mr-1" />
                        Opções
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                        onClick={() => openEditService(service)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

            {filteredServices.length === 0 && (
          <Card>
                <CardContent className="p-12 text-center">
                  <Scissors className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
                  <p className="text-muted-foreground">
                    {selectedCategory === "all"
                      ? "Crie seu primeiro serviço clicando no botão 'Novo Serviço'"
                      : "Não há serviços nesta categoria"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba de Categorias */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
                setIsCategoryDialogOpen(open);
                if (!open) resetCategoryForm();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={resetCategoryForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Nome da Categoria</Label>
                      <Input
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        placeholder="Ex: Cabelo, Barba..."
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                        placeholder="Descrição da categoria"
                      />
                    </div>
                    <IconSelector
                      value={categoryForm.iconUrl}
                      onChange={(iconUrl) => setCategoryForm({...categoryForm, iconUrl})}
                    />
                    <Button onClick={handleSaveCategory} disabled={saving} className="w-full">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingCategory ? 'Atualizar Categoria' : 'Criar Categoria')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(category => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DynamicIcon iconUrl={category.IconUrl} className="h-5 w-5" />
                      {category.name}
              </CardTitle>
            </CardHeader>
                  <CardContent className="space-y-3">
                    {category.description && (
              <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                    <Badge variant="secondary" className="w-full justify-center">
                      {category._count?.services || 0} serviço(s)
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditCategory(category)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteCategoryDialog(category)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
            </CardContent>
          </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog de Opções */}
        <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Opções: {selectedService?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Formulário para nova opção */}
          <Card>
            <CardHeader>
                  <CardTitle className="text-lg">Adicionar Opção</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Opções são variações do serviço com valor adicional (ex: Degradê +R$ 5,00)
                  </p>
            </CardHeader>
            <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Nome da Opção</Label>
                      <Input
                        value={optionForm.name}
                        onChange={(e) => setOptionForm({...optionForm, name: e.target.value})}
                        placeholder="Ex: Degradê, Social, Militar..."
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={optionForm.description}
                        onChange={(e) => setOptionForm({...optionForm, description: e.target.value})}
                        placeholder="Descrição da opção"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Valor Adicional (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={optionForm.price}
                          onChange={(e) => setOptionForm({...optionForm, price: Number(e.target.value)})}
                          placeholder="0.00"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Valor extra cobrado por esta opção
                        </p>
              </div>
                      <div>
                        <Label>Duração (minutos)</Label>
                        <Input
                          type="number"
                          value={optionForm.duration}
                          onChange={(e) => setOptionForm({...optionForm, duration: Number(e.target.value)})}
                          placeholder="30"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Tempo estimado
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleSaveOption} disabled={saving} className="w-full">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Adicionar Opção'}
                    </Button>
                  </div>
            </CardContent>
          </Card>

              {/* Lista de opções */}
              <div className="space-y-2">
                <h3 className="font-semibold">Opções Cadastradas ({serviceOptions.length})</h3>
                {serviceOptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma opção cadastrada
                  </p>
                ) : (
                  serviceOptions.map(option => (
                    <Card key={option.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{option.name}</p>
                            {Number(option.price) > 0 && (
                              <span className="text-sm font-semibold text-green-600">
                                +R$ {Number(option.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{option.duration} minutos</span>
                          </div>
              </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteOptionDialog(option)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
            </CardContent>
          </Card>
                  ))
                )}
        </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AlertDialog de Confirmação de Exclusão de Serviço */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o serviço{' '}
                <span className="font-semibold">{serviceToDelete?.name}</span>?
                <br />
                <br />
                Esta ação não pode ser desfeita. Se o serviço tiver agendamentos vinculados,
                ele não poderá ser excluído.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteService}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* AlertDialog de Confirmação de Exclusão de Opção */}
        <AlertDialog open={isDeleteOptionDialogOpen} onOpenChange={setIsDeleteOptionDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a opção{' '}
                <span className="font-semibold">{optionToDelete?.name}</span>?
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteOption}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* AlertDialog de Confirmação de Exclusão de Categoria */}
        <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a categoria{' '}
                <span className="font-semibold">{categoryToDelete?.name}</span>?
                <br />
                <br />
                Esta ação não pode ser desfeita. Todos os serviços desta categoria
                ficarão sem categoria.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCategory}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
