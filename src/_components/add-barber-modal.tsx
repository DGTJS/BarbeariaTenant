"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Switch } from "@/_components/ui/switch";
import { Checkbox } from "@/_components/ui/checkbox";
import { Separator } from "@/_components/ui/separator";
import { ScrollArea } from "@/_components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import {
  Upload,
  Loader2,
  Users,
  Shield,
  Lock,
  Mail,
  Phone,
  Image as ImageIcon,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/_lib/utils";

interface Category {
  id: string;
  name: string;
  IconUrl: string;
}

interface AddBarberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSave: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    photo: string;
    specialties: string[];
    permissions: {
      pages: Record<string, { access: boolean; canModify: boolean }>;
    };
  }) => Promise<void>;
}

// Definição das páginas do sistema
const ADMIN_PAGES = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "📊",
    description: "Visualizar estatísticas e métricas",
  },
  {
    id: "bookings",
    name: "Agendamentos",
    icon: "📅",
    description: "Gerenciar agendamentos dos clientes",
  },
  {
    id: "barbers",
    name: "Barbeiros",
    icon: "👥",
    description: "Gerenciar barbeiros da barbearia",
  },
  {
    id: "services",
    name: "Serviços",
    icon: "✂️",
    description: "Gerenciar serviços oferecidos",
  },
  {
    id: "reports",
    name: "Relatórios",
    icon: "📈",
    description: "Visualizar relatórios e análises",
  },
  {
    id: "notifications",
    name: "Notificações",
    icon: "🔔",
    description: "Gerenciar notificações",
  },
  {
    id: "templates",
    name: "Templates",
    icon: "📧",
    description: "Gerenciar templates de mensagens",
  },
  {
    id: "banner",
    name: "Banner",
    icon: "🖼️",
    description: "Gerenciar banners do site",
  },
  {
    id: "themes",
    name: "Temas",
    icon: "🎨",
    description: "Personalizar temas e cores",
  },
  {
    id: "settings",
    name: "Configurações",
    icon: "⚙️",
    description: "Configurações gerais do sistema",
  },
];

function AddBarberModal({
  open,
  onOpenChange,
  categories,
  onSave,
}: AddBarberModalProps) {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    specialties: [] as string[],
    permissions: {} as Record<string, { access: boolean; canModify: boolean }>,
  });

  // Verificar email em tempo real com debounce
  useEffect(() => {
    const email = formData.email.trim();

    // Validar formato básico de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailChecked(false);
      setEmailExists(false);
      setEmailCheckLoading(false);
      return;
    }

    // Debounce de 500ms
    const timeoutId = setTimeout(async () => {
      setEmailCheckLoading(true);
      try {
        const response = await fetch(
          `/api/admin/barbers/check-email?email=${encodeURIComponent(email)}`
        );
        if (response.ok) {
          const data = await response.json();
          setEmailExists(data.exists);
          setEmailChecked(true);
        } else {
          setEmailChecked(false);
          setEmailExists(false);
        }
      } catch (error) {
        console.error("Erro ao verificar email:", error);
        setEmailChecked(false);
        setEmailExists(false);
      } finally {
        setEmailCheckLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setEmailCheckLoading(false);
    };
  }, [formData.email]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    // Validar tamanho (máximo 5MB)
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      toast.error("A imagem é muito grande. Máximo permitido: 5MB.");
      return;
    }

    try {
      // Criar imagem para redimensionar
      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        const result = e.target?.result as string;
        img.src = result;
      };

      img.onload = () => {
        // Tamanho máximo para a imagem (800x800px)
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        // Calcular novas dimensões mantendo proporção
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          } else {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        // Criar canvas para redimensionar e comprimir
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Erro ao processar a imagem. Tente novamente.");
          return;
        }

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para base64 com compressão (qualidade 0.85)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);

        // Validar se o Base64 não está muito grande (máx ~2MB após compressão)
        if (compressedBase64.length > 2 * 1024 * 1024) {
          // Se ainda estiver muito grande, comprimir mais
          const moreCompressed = canvas.toDataURL("image/jpeg", 0.7);
          setFormData({ ...formData, photo: moreCompressed });
        } else {
          setFormData({ ...formData, photo: compressedBase64 });
        }
      };

      img.onerror = () => {
        toast.error(
          "Erro ao carregar a imagem. Verifique se o arquivo está correto."
        );
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Erro ao processar a imagem. Tente novamente.");
    }
  };

  const toggleSpecialty = (categoryId: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.includes(categoryId)
        ? formData.specialties.filter(id => id !== categoryId)
        : [...formData.specialties, categoryId],
    });
  };

  const togglePageAccess = (pageId: string) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [pageId]: {
          access: !formData.permissions[pageId]?.access,
          canModify:
            formData.permissions[pageId]?.access &&
            !formData.permissions[pageId]?.access
              ? false
              : formData.permissions[pageId]?.canModify || false,
        },
      },
    });
  };

  const togglePageModify = (pageId: string) => {
    if (!formData.permissions[pageId]?.access) return;

    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [pageId]: {
          ...formData.permissions[pageId],
          canModify: !formData.permissions[pageId]?.canModify,
        },
      },
    });
  };

  const handleSubmit = async () => {
    // Validações
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return;
    }

    if (emailExists) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        photo: formData.photo || "/logo.png",
        specialties: formData.specialties,
        permissions: {
          pages: formData.permissions,
        },
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        photo: "",
        confirmPassword: "",
        specialties: [],
        permissions: {},
      });
      setEmailExists(false);
      setEmailChecked(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setActiveTab("basic");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar barbeiro:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        photo: "",
        specialties: [],
        permissions: {},
      });
      setEmailExists(false);
      setEmailChecked(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setActiveTab("basic");
      onOpenChange(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordValid = formData.password.length >= 6;
  const canSubmit =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !emailExists &&
    passwordsMatch &&
    passwordValid &&
    emailChecked;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            Adicionar Novo Barbeiro
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo barbeiro no sistema
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 px-6">
            <div className="py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger
                    value="basic"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Informações Básicas
                  </TabsTrigger>
                  <TabsTrigger
                    value="specialties"
                    className="flex items-center gap-2"
                  >
                    <Scissors className="h-4 w-4" />
                    Especialidades
                  </TabsTrigger>
                  <TabsTrigger
                    value="permissions"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Permissões
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Dados Pessoais
                      </CardTitle>
                      <CardDescription>
                        Informações básicas do barbeiro
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Nome <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={e =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Digite o nome do barbeiro"
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4" />
                            Telefone
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div>
                          <Label className="flex items-center gap-2 text-base font-semibold">
                            <Lock className="h-4 w-4" />
                            Credenciais de Acesso
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Email e senha para o barbeiro fazer login no sistema
                          </p>
                        </div>

                        <div className="space-y-4">
                          {/* Campo Email com verificação em tempo real */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="flex items-center gap-2"
                            >
                              <Mail className="h-4 w-4" />
                              E-mail para Login{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={e =>
                                  setFormData({
                                    ...formData,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="barbeiro@email.com"
                                className={cn(
                                  "pr-10",
                                  emailChecked &&
                                    (emailExists
                                      ? "border-destructive focus-visible:ring-destructive/20"
                                      : "border-green-500 focus-visible:ring-green-500/20")
                                )}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {emailCheckLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                ) : emailChecked ? (
                                  emailExists ? (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  )
                                ) : null}
                              </div>
                            </div>
                            {emailChecked && emailExists && (
                              <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                  Este email já está cadastrado no sistema
                                </AlertDescription>
                              </Alert>
                            )}
                            {emailChecked &&
                              !emailExists &&
                              formData.email.trim() && (
                                <Alert className="bg-green-50 border-green-200 py-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <AlertDescription className="text-sm text-green-800">
                                    Email disponível
                                  </AlertDescription>
                                </Alert>
                              )}
                          </div>

                          {/* Campos de Senha */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="password"
                                className="flex items-center gap-2"
                              >
                                <Lock className="h-4 w-4" />
                                Senha{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  value={formData.password}
                                  onChange={e =>
                                    setFormData({
                                      ...formData,
                                      password: e.target.value,
                                    })
                                  }
                                  placeholder="Mínimo 6 caracteres"
                                  className={cn(
                                    "pr-10",
                                    formData.password &&
                                      (!passwordValid
                                        ? "border-amber-500"
                                        : "border-green-500")
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                              {formData.password && !passwordValid && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />A senha
                                  deve ter no mínimo 6 caracteres
                                </p>
                              )}
                              {formData.password && passwordValid && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Senha válida
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="confirmPassword"
                                className="flex items-center gap-2"
                              >
                                <Lock className="h-4 w-4" />
                                Confirmar Senha{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="confirmPassword"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  value={formData.confirmPassword}
                                  onChange={e =>
                                    setFormData({
                                      ...formData,
                                      confirmPassword: e.target.value,
                                    })
                                  }
                                  placeholder="Digite a senha novamente"
                                  className={cn(
                                    "pr-10",
                                    formData.confirmPassword &&
                                      (passwordsMatch
                                        ? "border-green-500"
                                        : "border-destructive")
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                              {formData.confirmPassword && (
                                <p
                                  className={cn(
                                    "text-xs flex items-center gap-1",
                                    passwordsMatch
                                      ? "text-green-600"
                                      : "text-destructive"
                                  )}
                                >
                                  {passwordsMatch ? (
                                    <>
                                      <CheckCircle2 className="h-3 w-3" />
                                      Senhas coincidem
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-3 w-3" />
                                      As senhas não coincidem
                                    </>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-base font-semibold">
                          <ImageIcon className="h-4 w-4" />
                          Foto do Barbeiro
                        </Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-24 w-24 border-2 border-border">
                            <AvatarImage
                              src={formData.photo}
                              alt={formData.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                              {formData.name.charAt(0).toUpperCase() || "B"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="photo-upload"
                            />
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() =>
                                document.getElementById("photo-upload")?.click()
                              }
                              className="w-full sm:w-auto"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Selecionar Foto
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="specialties" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Scissors className="h-5 w-5" />
                        Especialidades
                      </CardTitle>
                      <CardDescription>
                        Selecione as especialidades que o barbeiro domina
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {categories.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Scissors className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Nenhuma especialidade disponível</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {categories.map(category => {
                              const isSelected = formData.specialties.includes(
                                category.id
                              );
                              return (
                                <div
                                  key={category.id}
                                  className={`relative flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer group ${
                                    isSelected
                                      ? "border-primary bg-primary/5 shadow-sm"
                                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                                  }`}
                                  onClick={() => toggleSpecialty(category.id)}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() =>
                                      toggleSpecialty(category.id)
                                    }
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                  <Label
                                    htmlFor={category.id}
                                    className="flex-1 cursor-pointer text-sm font-medium"
                                  >
                                    {category.name}
                                  </Label>
                                  {isSelected && (
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {formData.specialties.length > 0 && (
                            <>
                              <Separator className="my-4" />
                              <div className="space-y-2">
                                <p className="text-sm font-medium">
                                  Especialidades Selecionadas (
                                  {formData.specialties.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {formData.specialties.map(specialtyId => {
                                    const category = categories.find(
                                      c => c.id === specialtyId
                                    );
                                    return category ? (
                                      <Badge
                                        key={specialtyId}
                                        variant="secondary"
                                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                      >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        {category.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Permissões de Acesso
                      </CardTitle>
                      <CardDescription>
                        Configure quais páginas o barbeiro pode acessar e o que
                        pode modificar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {ADMIN_PAGES.map(page => {
                            const pagePerms = formData.permissions[page.id] || {
                              access: false,
                              canModify: false,
                            };

                            return (
                              <Card
                                key={page.id}
                                className={`transition-all ${
                                  pagePerms.access
                                    ? "border-primary/50 bg-primary/5"
                                    : "border-border"
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                      <div className="text-2xl mt-0.5">
                                        {page.icon}
                                      </div>
                                      <div className="flex-1">
                                        <Label className="text-base font-semibold cursor-pointer">
                                          {page.name}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {page.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                      <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                          <Label
                                            htmlFor={`access-${page.id}`}
                                            className="text-sm cursor-pointer"
                                          >
                                            Acessar
                                          </Label>
                                          <Switch
                                            id={`access-${page.id}`}
                                            checked={pagePerms.access}
                                            onCheckedChange={() =>
                                              togglePageAccess(page.id)
                                            }
                                          />
                                        </div>
                                        {pagePerms.access && (
                                          <div className="flex items-center gap-2">
                                            <Label
                                              htmlFor={`modify-${page.id}`}
                                              className="text-sm cursor-pointer text-muted-foreground"
                                            >
                                              Pode Modificar
                                            </Label>
                                            <Switch
                                              id={`modify-${page.id}`}
                                              checked={pagePerms.canModify}
                                              onCheckedChange={() =>
                                                togglePageModify(page.id)
                                              }
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>

        <Separator className="flex-shrink-0" />

        <DialogFooter className="px-6 py-4 bg-muted/50 border-t flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1 text-sm">
              {!canSubmit && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>
                    {emailExists
                      ? "Corrija o email antes de continuar"
                      : !passwordsMatch && formData.confirmPassword
                        ? "As senhas não coincidem"
                        : !passwordValid && formData.password
                          ? "A senha deve ter no mínimo 6 caracteres"
                          : !emailChecked && formData.email
                            ? "Aguardando verificação do email..."
                            : "Preencha todos os campos obrigatórios"}
                  </span>
                </div>
              )}
              {canSubmit && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Pronto para criar barbeiro</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} disabled={saving}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving || !canSubmit}
                className="min-w-[140px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Criar Barbeiro
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddBarberModal;
