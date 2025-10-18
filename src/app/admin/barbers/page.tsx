"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Save,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2
} from "lucide-react";

interface Barber {
  id: string;
  name: string;
  phone: string | null;
  photo: string;
  categories: Array<{
    id: string;
    name: string;
    IconUrl: string;
  }>;
  workingHours: Array<{
    weekday: number;
    startTime: string;
    endTime: string;
  }>;
  user: {
    email: string;
    phone: string | null;
  };
}

export default function BarbersManagement() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeForm, setActiveForm] = useState<'none' | 'add' | 'edit'>('none');
  const [newBarber, setNewBarber] = useState({
    name: "",
    phone: "",
    email: "",
    photo: "",
    specialties: [] as string[],
    experience: 0,
    isActive: true
  });

  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Carregar dados do banco
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Iniciando carregamento de dados...');
      
      const [barbersResponse, categoriesResponse] = await Promise.all([
        fetch('/api/admin/barbers'),
        fetch('/api/admin/categories')
      ]);
      
      console.log('Responses recebidas:', {
        barbers: barbersResponse.status,
        categories: categoriesResponse.status
      });
      
      if (!barbersResponse.ok) {
        const barbersError = await barbersResponse.text();
        console.error('Erro na API de barbeiros:', barbersError);
        throw new Error(`Erro ao carregar barbeiros: ${barbersResponse.status}`);
      }
      
      if (!categoriesResponse.ok) {
        const categoriesError = await categoriesResponse.text();
        console.error('Erro na API de categorias:', categoriesError);
        throw new Error(`Erro ao carregar categorias: ${categoriesResponse.status}`);
      }
      
      const barbersData = await barbersResponse.json();
      const categoriesData = await categoriesResponse.json();
      
      console.log('Dados carregados:', {
        barbers: barbersData.length,
        categories: categoriesData.length
      });
      
      setBarbers(barbersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Definir dados vazios em caso de erro
      setBarbers([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const weekdays = [
    "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"
  ];

  const handleAddBarber = async () => {
    if (newBarber.name && newBarber.phone && newBarber.email) {
      try {
        setSaving(true);
        
        const response = await fetch('/api/admin/barbers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newBarber.name,
            phone: newBarber.phone,
            email: newBarber.email,
            photo: newBarber.photo || "/logo.png",
            specialties: newBarber.specialties
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erro ao criar barbeiro');
        }
        
        await loadData(); // Recarregar dados
        setNewBarber({
          name: "",
          phone: "",
          email: "",
          photo: "",
          specialties: [],
          experience: 0,
          isActive: true
        });
        setActiveForm('none');
        alert('Barbeiro criado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar barbeiro:', error);
        alert('Erro ao criar barbeiro');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleEditBarber = async (barber: Barber) => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/admin/barbers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: barber.id,
          name: barber.name,
          phone: barber.phone,
          email: barber.user.email,
          photo: barber.photo,
          specialties: barber.categories.map(cat => cat.id)
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar barbeiro');
      }
      
      await loadData(); // Recarregar dados
      setEditingBarber(null);
      setActiveForm('none');
      alert('Barbeiro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar barbeiro:', error);
      alert('Erro ao atualizar barbeiro');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBarber = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este barbeiro? Esta ação não pode ser desfeita.')) {
      try {
        setSaving(true);
        const response = await fetch(`/api/admin/barbers?id=${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erro ao deletar barbeiro');
        }
        
        await loadData(); // Recarregar dados
        alert('Barbeiro deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar barbeiro:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar barbeiro';
        alert(errorMessage);
      } finally {
        setSaving(false);
      }
    }
  };


  const handleSpecialtyToggle = (specialty: string) => {
    setNewBarber(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewBarber({ ...newBarber, photo: imageUrl });
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando barbeiros...</span>
          </div>
        </div>
      </div>
    );
  }

  // Debug info
  console.log('Estado atual:', { loading, barbers: barbers.length, categories: categories.length });

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gerenciar Barbeiros
              </h1>
              <p className="text-muted-foreground">
                Adicione e gerencie os barbeiros da sua barbearia
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setActiveForm(activeForm === 'add' ? 'none' : 'add')}
                variant={activeForm === 'add' ? 'secondary' : 'default'}
              >
                <Plus className="h-4 w-4 mr-2" />
                {activeForm === 'add' ? 'Cancelar' : 'Adicionar Barbeiro'}
              </Button>
              <Button variant="outline" onClick={loadData} disabled={loading}>
                <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Recarregar
              </Button>
            </div>
          </div>
        </div>

        {/* Formulário para editar barbeiro */}
        {editingBarber && activeForm === 'edit' && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Barbeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nome Completo</Label>
                    <Input
                      id="edit-name"
                      value={editingBarber.name}
                      onChange={(e) => setEditingBarber({ ...editingBarber, name: e.target.value })}
                      placeholder="Digite o nome do barbeiro"
                      className="focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-phone">Telefone</Label>
                    <Input
                      id="edit-phone"
                      value={editingBarber.phone || ""}
                      onChange={(e) => setEditingBarber({ ...editingBarber, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-email">E-mail</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingBarber.user.email}
                      onChange={(e) => setEditingBarber({ 
                        ...editingBarber, 
                        user: { ...editingBarber.user, email: e.target.value }
                      })}
                      placeholder="barbeiro@email.com"
                      className="focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Foto do Barbeiro</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                        <AvatarImage src={editingBarber.photo} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-lg">
                          {editingBarber.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const imageUrl = URL.createObjectURL(file);
                              setEditingBarber({ ...editingBarber, photo: imageUrl });
                            }
                          }}
                          className="hidden"
                          id="edit-photo-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('edit-photo-upload')?.click()}
                          className="hover:bg-primary/10"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Alterar Foto
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Especialidades</Label>
                    <p className="text-sm text-muted-foreground mb-3">Selecione as especialidades do barbeiro</p>
                    <div className="mt-2 p-4 border-2 border-border/50 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 backdrop-blur-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map((category) => {
                          const isSelected = editingBarber.categories.some(cat => cat.id === category.id);
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
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setEditingBarber({
                                        ...editingBarber,
                                        categories: [...editingBarber.categories, category]
                                      });
                                    } else {
                                      setEditingBarber({
                                        ...editingBarber,
                                        categories: editingBarber.categories.filter(cat => cat.id !== category.id)
                                      });
                                    }
                                  }}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                  isSelected 
                                    ? 'bg-primary border-primary' 
                                    : 'border-border group-hover:border-primary/50'
                                }`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <span className={`text-sm font-medium transition-colors ${
                                  isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary/80'
                                }`}>
                                  {category.name}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {editingBarber.categories.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-2">
                            {editingBarber.categories.length} especialidade{editingBarber.categories.length !== 1 ? 's' : ''} selecionada{editingBarber.categories.length !== 1 ? 's' : ''}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {editingBarber.categories.map((category) => (
                              <Badge 
                                key={category.id} 
                                variant="secondary" 
                                className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20"
                              >
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-4 border-t border-border">
                <Button onClick={() => handleEditBarber(editingBarber)} disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button variant="outline" onClick={() => {setEditingBarber(null); setActiveForm('none');}} className="px-6">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário para adicionar barbeiro */}
        {activeForm === 'add' && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Adicionar Novo Barbeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={newBarber.name}
                      onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                      placeholder="Digite o nome do barbeiro"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newBarber.phone}
                      onChange={(e) => setNewBarber({ ...newBarber, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newBarber.email}
                      onChange={(e) => setNewBarber({ ...newBarber, email: e.target.value })}
                      placeholder="barbeiro@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Anos de Experiência</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={newBarber.experience}
                      onChange={(e) => setNewBarber({ ...newBarber, experience: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Foto do Barbeiro</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={newBarber.photo} />
                        <AvatarFallback>
                          {newBarber.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Foto
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Especialidades</Label>
                    <p className="text-sm text-muted-foreground mb-3">Selecione as especialidades do barbeiro</p>
                    <div className="mt-2 p-4 border-2 border-border/50 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 backdrop-blur-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map((category) => {
                          const isSelected = newBarber.specialties.includes(category.id);
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
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSpecialtyToggle(category.id)}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                  isSelected 
                                    ? 'bg-primary border-primary' 
                                    : 'border-border group-hover:border-primary/50'
                                }`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <span className={`text-sm font-medium transition-colors ${
                                  isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary/80'
                                }`}>
                                  {category.name}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {newBarber.specialties.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-2">
                            {newBarber.specialties.length} especialidade{newBarber.specialties.length !== 1 ? 's' : ''} selecionada{newBarber.specialties.length !== 1 ? 's' : ''}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {newBarber.specialties.map((specialtyId) => {
                              const category = categories.find(cat => cat.id === specialtyId);
                              return category ? (
                                <Badge 
                                  key={specialtyId} 
                                  variant="secondary" 
                                  className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20"
                                >
                                  {category.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-4 border-t border-border">
                <Button onClick={handleAddBarber} disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? "Salvando..." : "Salvar Barbeiro"}
                </Button>
                <Button variant="outline" onClick={() => setActiveForm('none')} className="px-6">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Lista de barbeiros */}
        {barbers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum barbeiro encontrado</h3>
            <p className="text-muted-foreground mb-4">Adicione o primeiro barbeiro para começar</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setActiveForm('add')}>
                <Users className="h-4 w-4 mr-2" />
                Adicionar Barbeiro
              </Button>
              <Button variant="outline" onClick={loadData} disabled={loading}>
                <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Recarregar
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
            <Card key={barber.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                        <AvatarImage src={barber.photo} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-lg">
                          {barber.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {barber.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {barber.categories.length} especialidade{barber.categories.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informações de contato */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-foreground font-medium">
                      {barber.phone || barber.user.phone || "Não informado"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-foreground font-medium truncate">
                      {barber.user.email}
                    </span>
                  </div>
                </div>
                
                {/* Especialidades */}
                <div>
                  <p className="text-sm font-semibold mb-3 text-foreground">Especialidades</p>
                  <div className="flex flex-wrap gap-2">
                    {barber.categories.map((category) => (
                      <Badge 
                        key={category.id} 
                        variant="secondary" 
                        className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Horários */}
                <div>
                  <p className="text-sm font-semibold mb-3 text-foreground">Horários de Trabalho</p>
                  <div className="space-y-2">
                    {barber.workingHours.slice(0, 2).map((schedule) => (
                      <div key={schedule.weekday} className="flex items-center space-x-3 text-sm">
                        <div className="p-1.5 bg-muted/50 rounded-md">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">
                          {weekdays[schedule.weekday - 1]}: {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    ))}
                    {barber.workingHours.length > 2 && (
                      <p className="text-xs text-muted-foreground ml-8">
                        +{barber.workingHours.length - 2} outros dias
                      </p>
                    )}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex space-x-2 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {setEditingBarber(barber); setActiveForm('edit');}}
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    title="Editar barbeiro"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBarber(barber.id)}
                    disabled={saving}
                    className="hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                    title="Deletar barbeiro"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
