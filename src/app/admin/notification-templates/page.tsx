"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Textarea } from "@/_components/ui/textarea";
import { Switch } from "@/_components/ui/switch";
import { 
  Mail, 
  MessageSquare, 
  Smartphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  subject?: string;
  content: string;
  variables: string;
  logo?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [templateForm, setTemplateForm] = useState({
    name: "",
    type: "email",
    category: "booking_confirmation",
    subject: "",
    content: "",
    variables: [] as string[],
    logo: "",
    isActive: true,
    isDefault: false
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/notification-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      type: template.type,
      category: template.category,
      subject: template.subject || "",
      content: template.content,
      variables: JSON.parse(template.variables),
      logo: template.logo || "",
      isActive: template.isActive,
      isDefault: template.isDefault
    });
    setShowEditModal(true);
  };

  const handleNew = () => {
    setSelectedTemplate(null);
    setTemplateForm({
      name: "",
      type: "email",
      category: "booking_confirmation",
      subject: "",
      content: "",
      variables: [],
      logo: "",
      isActive: true,
      isDefault: false
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (!templateForm.name || !templateForm.content) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      if (templateForm.type === 'email' && !templateForm.subject) {
        toast.error('Preencha o assunto do email');
        return;
      }

      setIsSaving(true);

      const url = selectedTemplate 
        ? `/api/admin/notification-templates/${selectedTemplate.id}`
        : '/api/admin/notification-templates';

      const response = await fetch(url, {
        method: selectedTemplate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateForm)
      });

      if (response.ok) {
        toast.success(selectedTemplate ? 'Template atualizado!' : 'Template criado!');
        setShowEditModal(false);
        loadTemplates();
      } else {
        throw new Error('Erro ao salvar template');
      }
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast.error('Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/notification-templates/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Template excluído!');
        loadTemplates();
      } else {
        throw new Error('Erro ao excluir template');
      }
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast.error('Erro ao excluir template');
    }
  };

  const handlePreview = (template: NotificationTemplate) => {
    // Substituir variáveis por valores de exemplo
    let previewContent = template.content;
    const sampleData: { [key: string]: string } = {
      customer_name: "João Silva",
      booking_date: "15/01/2025",
      booking_time: "14:30",
      service_name: "Corte de Cabelo",
      barber_name: "Carlos Barbeiro",
      service_price: "45,00",
      booking_link: "https://exemplo.com/booking/123",
      barbershop_name: "Barbearia Premium",
      barbershop_address: "Rua Exemplo, 123",
      barbershop_phone: "(11) 99999-9999",
      logo: template.logo || "/logo.png", // Usar logo local ao invés de placeholder externo
      promo_title: "Desconto Especial",
      promo_description: "Ganhe 20% de desconto no seu próximo corte!",
      promo_code: "PROMO20",
      promo_expiry: "31/01/2025"
    };

    // Substituir variáveis do Handlebars
    Object.keys(sampleData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewContent = previewContent.replace(regex, sampleData[key]);
    });

    // Substituir condicionais do Handlebars
    previewContent = previewContent.replace(/{{#if logo}}[\s\S]*?{{\/if}}/g, (match) => {
      return match.replace(/{{#if logo}}/, '').replace(/{{\/if}}/, '');
    });

    setPreviewTemplate({
      ...template,
      content: previewContent,
      subject: template.subject?.replace(/{{barber_name}}/g, "Carlos Barbeiro")
    });
    setShowPreviewModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'push': return <Smartphone className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500';
      case 'whatsapp': return 'bg-green-500';
      case 'push': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      booking_confirmation: "Confirmação de Agendamento",
      booking_reminder: "Lembrete de Agendamento",
      promotion: "Promoção",
      custom: "Personalizado"
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Templates de Notificação
          </h1>
          <p className="text-muted-foreground mt-1">
            Crie e edite templates de email, WhatsApp e notificações push
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="shadow-md bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="shadow-lg border-border/50 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getTypeColor(template.type)}/20 rounded-full flex items-center justify-center`}>
                    {getTypeIcon(template.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryName(template.category)}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {template.isDefault && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                    Padrão
                  </Badge>
                )}
                <Badge variant="outline">{template.type.toUpperCase()}</Badge>
                {template.isActive ? (
                  <Badge className="bg-green-500/20 text-green-700">
                    <Eye className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-500/20">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Inativo
                  </Badge>
                )}
              </div>

              {template.subject && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Assunto:</p>
                  <p className="text-sm font-medium truncate">{template.subject}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePreview(template)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(template)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                {!template.isDefault && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(template.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Editar/Criar */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[900px] bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {selectedTemplate ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
              {selectedTemplate ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label>Nome do Template *</Label>
                <Input
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Confirmação de Agendamento - Email"
                />
              </div>

              {/* Tipo e Categoria */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={templateForm.type}
                    onValueChange={(value) => setTemplateForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={templateForm.category}
                    onValueChange={(value) => setTemplateForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking_confirmation">Confirmação de Agendamento</SelectItem>
                      <SelectItem value="booking_reminder">Lembrete de Agendamento</SelectItem>
                      <SelectItem value="promotion">Promoção</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Assunto (apenas para email) */}
              {templateForm.type === 'email' && (
                <div className="space-y-2">
                  <Label>Assunto *</Label>
                  <Input
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Ex: Agendamento Confirmado - {{barber_name}}"
                  />
                </div>
              )}

              {/* Conteúdo */}
              <div className="space-y-2">
                <Label>Conteúdo *</Label>
                <Textarea
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={templateForm.type === 'email' ? 
                    "HTML do email..." : 
                    "Mensagem de texto..."}
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Use variáveis como: {`{{customer_name}}, {{booking_date}}, {{booking_time}}, {{barber_name}}, {{service_name}}, {{service_price}}`}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              {/* Logo URL */}
              <div className="space-y-2">
                <Label>URL da Logo</Label>
                <Input
                  value={templateForm.logo}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://exemplo.com/logo.png"
                />
                {templateForm.logo && (
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <img src={templateForm.logo} alt="Logo Preview" className="max-h-24 mx-auto" />
                  </div>
                )}
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card-secondary/30 rounded-lg">
                  <div>
                    <Label>Template Ativo</Label>
                    <p className="text-sm text-muted-foreground">Pode ser usado para enviar notificações</p>
                  </div>
                  <Switch
                    checked={templateForm.isActive}
                    onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-card-secondary/30 rounded-lg">
                  <div>
                    <Label>Template Padrão</Label>
                    <p className="text-sm text-muted-foreground">Será usado automaticamente nesta categoria</p>
                  </div>
                  <Switch
                    checked={templateForm.isDefault}
                    onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, isDefault: checked }))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-primary to-purple-600"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Template
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Preview */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="sm:max-w-[800px] bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Preview do Template
            </DialogTitle>
          </DialogHeader>

          {previewTemplate && (
            <div className="space-y-4 mt-4">
              {previewTemplate.subject && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Assunto:</p>
                  <p className="font-semibold">{previewTemplate.subject}</p>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                {previewTemplate.type === 'email' ? (
                  <iframe
                    srcDoc={previewTemplate.content}
                    className="w-full h-[600px]"
                    title="Email Preview"
                  />
                ) : (
                  <div className="p-6 bg-white whitespace-pre-wrap">
                    {previewTemplate.content}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

