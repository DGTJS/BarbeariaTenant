"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Textarea } from "@/_components/ui/textarea";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Users,
  User,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
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
import { ClientSelectorEnhanced } from "@/_components/client-selector-enhanced";

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  subject?: string;
  content: string;
  variables: string;
  isActive: boolean;
  isDefault: boolean;
}

interface Notification {
  id: string;
  type: string;
  category: string;
  subject?: string;
  content: string;
  status: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  template?: {
    name: string;
    category: string;
  };
}

export default function NotificationsPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null);

  const [notificationForm, setNotificationForm] = useState({
    type: "email",
    category: "custom",
    subject: "",
    content: "",
    recipientType: "all", // "all", "specific"
    selectedClients: [] as string[],
    templateId: "",
    actionUrl: "",
    actionText: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesRes, notificationsRes] = await Promise.all([
        fetch("/api/admin/notification-templates"),
        fetch("/api/admin/notifications"),
      ]);

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      if (!notificationForm.content) {
        toast.error("Preencha o conteúdo da notificação");
        return;
      }

      if (notificationForm.type === "email" && !notificationForm.subject) {
        toast.error("Preencha o assunto do email");
        return;
      }

      if (
        notificationForm.recipientType === "specific" &&
        notificationForm.selectedClients.length === 0
      ) {
        toast.error("Selecione pelo menos um cliente");
        return;
      }

      const payload = {
        type: notificationForm.type,
        category: notificationForm.category,
        subject: notificationForm.subject,
        content: notificationForm.content,
        templateId: notificationForm.templateId,
        isGlobal: notificationForm.recipientType === "all",
        clientIds:
          notificationForm.recipientType === "specific"
            ? notificationForm.selectedClients
            : undefined,
        actionUrl: notificationForm.actionUrl || undefined,
        actionText: notificationForm.actionText || undefined,
      };

      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Notificação enviada com sucesso!");
        setShowCreateModal(false);
        setNotificationForm({
          type: "email",
          category: "custom",
          subject: "",
          content: "",
          recipientType: "all",
          selectedClients: [],
          templateId: "",
          actionUrl: "",
          actionText: "",
        });
        loadData();
      } else {
        throw new Error("Erro ao enviar notificação");
      }
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      toast.error("Erro ao enviar notificação");
    }
  };

  const handleUseTemplate = (template: NotificationTemplate) => {
    // Tentar parsear actionUrl e actionText do template se o content for JSON
    let actionUrl = "";
    let actionText = "";
    let content = template.content;
    
    try {
      const contentJson = JSON.parse(template.content);
      if (contentJson.actionUrl) actionUrl = contentJson.actionUrl;
      if (contentJson.actionText) actionText = contentJson.actionText;
      if (contentJson.message) content = contentJson.message;
      if (contentJson.text) content = contentJson.text;
    } catch {
      // Se não for JSON, usar o content como está
    }

    setNotificationForm(prev => ({
      ...prev,
      type: template.type,
      category: template.category,
      subject: template.subject || "",
      content,
      templateId: template.id,
      actionUrl,
      actionText,
    }));
    toast.success(`Template "${template.name}" carregado!`);
    setShowTemplateModal(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "push":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email":
        return "bg-blue-500";
      case "whatsapp":
        return "bg-green-500";
      case "push":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      case "read":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Enviada";
      case "pending":
        return "Pendente";
      case "failed":
        return "Falhou";
      case "read":
        return "Lida";
      default:
        return status;
    }
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
            Notificações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie notificações e templates de mensagens
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowTemplateModal(true)}
            variant="outline"
            className="shadow-md"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Templates
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="shadow-md bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Notificação
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Enviadas</p>
                <p className="text-3xl font-bold mt-1">
                  {notifications.filter(n => n.status === "sent").length}
                </p>
              </div>
              <Mail className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pendentes</p>
                <p className="text-3xl font-bold mt-1">
                  {notifications.filter(n => n.status === "pending").length}
                </p>
              </div>
              <Bell className="h-12 w-12 text-yellow-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Lidas</p>
                <p className="text-3xl font-bold mt-1">
                  {notifications.filter(n => n.status === "read").length}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Templates</p>
                <p className="text-3xl font-bold mt-1">
                  {templates.filter(t => t.isActive).length}
                </p>
              </div>
              <Edit className="h-12 w-12 text-purple-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notificações Recentes */}
      <Card className="shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Nenhuma notificação enviada ainda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 10).map(notification => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-4 bg-card-secondary/30 rounded-lg border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 ${getTypeColor(notification.type)}/20 rounded-full flex items-center justify-center`}
                    >
                      {getTypeIcon(notification.type)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {notification.subject ||
                          notification.template?.name ||
                          "Notificação"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${getStatusColor(notification.status)} text-white`}
                    >
                      {getStatusText(notification.status)}
                    </Badge>
                    <Badge variant="outline">
                      {notification.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Criar Notificação */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Send className="h-6 w-6 text-primary" />
              Enviar Notificação
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Tipo de Notificação */}
            <div className="space-y-2">
              <Label>Tipo de Notificação</Label>
              <Select
                value={notificationForm.type}
                onValueChange={value =>
                  setNotificationForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                  <SelectItem value="push">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Push
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={notificationForm.category}
                onValueChange={value =>
                  setNotificationForm(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Personalizada</SelectItem>
                  <SelectItem value="booking_confirmation">Confirmação de Agendamento</SelectItem>
                  <SelectItem value="booking_reminder">Lembrete de Agendamento</SelectItem>
                  <SelectItem value="promotion">Promoção</SelectItem>
                  <SelectItem value="remarketing">Remarketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Destinatários */}
            <div className="space-y-2">
              <Label>Destinatários</Label>
              <Select
                value={notificationForm.recipientType}
                onValueChange={value =>
                  setNotificationForm(prev => ({
                    ...prev,
                    recipientType: value,
                    selectedClients:
                      value === "all" ? [] : prev.selectedClients,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Todos os Clientes
                    </div>
                  </SelectItem>
                  <SelectItem value="specific">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Clientes Específicos
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seletor de Clientes Específicos */}
            {notificationForm.recipientType === "specific" && (
              <ClientSelectorEnhanced
                selectedClients={notificationForm.selectedClients}
                onChange={clientIds =>
                  setNotificationForm(prev => ({
                    ...prev,
                    selectedClients: clientIds,
                  }))
                }
                mode="multiple"
              />
            )}

            {/* Usar Template */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTemplateModal(true)}
                className="w-full bg-gradient-to-r from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 border-primary/30"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Usar Template Pronto
              </Button>
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                {templates.filter(t => t.isActive).length}
              </span>
            </div>

            {/* Assunto (apenas para email) */}
            {notificationForm.type === "email" && (
              <div className="space-y-2">
                <Label>Assunto</Label>
                <Input
                  value={notificationForm.subject}
                  onChange={e =>
                    setNotificationForm(prev => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Digite o assunto do email"
                />
              </div>
            )}

            {/* Conteúdo */}
            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Textarea
                value={notificationForm.content}
                onChange={e =>
                  setNotificationForm(prev => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Digite a mensagem..."
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use variáveis como:{" "}
                {`{{customer_name}}, {{booking_date}}, {{barber_name}}`}
              </p>
            </div>

            {/* Botão de Ação (Opcional) */}
            <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/50">
              <Label className="text-sm font-semibold">Botão de Ação (Opcional)</Label>
              <p className="text-xs text-muted-foreground mb-3">
                Adicione um botão clicável na notificação para redirecionar o usuário
              </p>
              
              <div className="space-y-2">
                <div>
                  <Label htmlFor="actionUrl" className="text-xs">URL de Ação</Label>
                  <Input
                    id="actionUrl"
                    value={notificationForm.actionUrl}
                    onChange={e =>
                      setNotificationForm(prev => ({
                        ...prev,
                        actionUrl: e.target.value,
                      }))
                    }
                    placeholder="/profile, /bookings, ou URL externa"
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="actionText" className="text-xs">Texto do Botão</Label>
                  <Input
                    id="actionText"
                    value={notificationForm.actionText}
                    onChange={e =>
                      setNotificationForm(prev => ({
                        ...prev,
                        actionText: e.target.value,
                      }))
                    }
                    placeholder="Ex: Ver Agendamentos, Agendar Agora, etc."
                    className="text-sm"
                  />
                </div>
                
                {(notificationForm.actionUrl || notificationForm.actionText) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Botão será exibido na notificação</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSendNotification}
                className="flex-1 bg-gradient-to-r from-primary to-purple-600"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Templates */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" />
              Templates de Notificação
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {templates
              .filter(t => t.isActive)
              .map(template => (
                <div
                  key={template.id}
                  className="p-4 bg-card-secondary/30 rounded-lg border border-border/50 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${getTypeColor(template.type)}/20 rounded-full flex items-center justify-center`}
                      >
                        {getTypeIcon(template.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {template.isDefault && (
                        <Badge variant="secondary">Padrão</Badge>
                      )}
                      <Badge variant="outline">
                        {template.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  {template.subject && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Assunto:</strong> {template.subject}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
