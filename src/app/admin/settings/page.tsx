"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select";
import { Switch } from "@/_components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import LogoUpload from "@/_components/logo-upload";
import AdminHeader from "@/_components/admin-header";
import { 
  Settings, 
  Save, 
  RefreshCw,
  Bell,
  Shield,
  Database,
  Mail,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Building2,
  Users,
  Scissors,
  Upload,
  Image,
  X,
  Loader2
} from "lucide-react";

interface BarberShopSettings {
  id: string;
  name: string;
  address: string;
  phones: string[];
  email: string;
  description: string;
  logoUrl?: string;
  logoBase64?: string;
  logoWidth?: number;
  logoHeight?: number;
  seoTitle?: string;
  seoDescription?: string;
  workingHours: {
    weekday: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
  }[];
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    bookingReminders: boolean;
    newBookingAlerts: boolean;
  };
  business: {
    timezone: string;
    bookingAdvanceDays: number;
    cancellationPolicy: string;
    paymentMethods: {
      pix: boolean;
      creditCard: boolean;
      debitCard: boolean;
      cash: boolean;
    };
    mercadoPagoConnected: boolean;
    mercadoPagoAccessToken?: string;
  };
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<BarberShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  // Sistema individual removido: sempre unificada, franquias dependem do plano

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (status === "unauthenticated" || (!session && status !== "loading")) {
      window.location.href = "/admin/login";
    }
  }, [status, session]);

  useEffect(() => {
    if (session) {
      loadSettings();
      
      // Verificar mensagens de URL
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const error = urlParams.get('error');
      
      if (success === 'mercadopago_connected') {
        setMessage({ type: 'success', text: 'Mercado Pago conectado com sucesso!' });
        // Limpar URL
        window.history.replaceState({}, '', window.location.pathname);
      } else if (error === 'mercadopago_auth_failed') {
        const details = urlParams.get('details');
        setMessage({ type: 'error', text: `Falha na autenticação do Mercado Pago${details ? ': ' + details : ''}` });
        window.history.replaceState({}, '', window.location.pathname);
      } else if (error === 'mercadopago_no_code') {
        setMessage({ type: 'error', text: 'Código de autorização não recebido' });
        window.history.replaceState({}, '', window.location.pathname);
      } else if (error === 'mercadopago_token_failed') {
        const details = urlParams.get('details');
        setMessage({ type: 'error', text: `Falha ao obter token de acesso${details ? ': ' + details : ''}` });
        window.history.replaceState({}, '', window.location.pathname);
      } else if (error === 'mercadopago_config_missing') {
        setMessage({ type: 'error', text: 'Configuração do Mercado Pago não encontrada. Verifique as variáveis de ambiente.' });
        window.history.replaceState({}, '', window.location.pathname);
      } else if (error === 'mercadopago_db_error') {
        setMessage({ type: 'error', text: 'Erro ao salvar configuração no banco de dados' });
        window.history.replaceState({}, '', window.location.pathname);
      } else if (error === 'mercadopago_callback_error') {
        setMessage({ type: 'error', text: 'Erro no callback do Mercado Pago' });
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [session]);

  // Verificar se usuário está autenticado
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/site-config');
      const cfg = res.ok ? await res.json() : {};

      const settingsFromConfig: BarberShopSettings = {
        id: "site-config",
        name: cfg["barbershop_name"] || "",
        address: cfg["barbershop_address"] || "",
        phones: (cfg["barbershop_phones"] ? String(cfg["barbershop_phones"]).split(',').map((s: string) => s.trim()) : []),
        email: cfg["barbershop_email"] || "",
        description: cfg["barbershop_description"] || "",
        logoUrl: cfg["barbershop_logo_url"] || "",
        logoBase64: cfg["barbershop_logo_base64"] || "",
        logoWidth: Number(cfg["barbershop_logo_width"] ?? 0),
        logoHeight: Number(cfg["barbershop_logo_height"] ?? 0),
        seoTitle: cfg["seo_title"] || "",
        seoDescription: cfg["seo_description"] || "",
        workingHours: [
          { weekday: "Segunda", startTime: "09:00", endTime: "18:00", isOpen: true },
          { weekday: "Terça", startTime: "09:00", endTime: "18:00", isOpen: true },
          { weekday: "Quarta", startTime: "09:00", endTime: "18:00", isOpen: true },
          { weekday: "Quinta", startTime: "09:00", endTime: "18:00", isOpen: true },
          { weekday: "Sexta", startTime: "09:00", endTime: "19:00", isOpen: true },
          { weekday: "Sábado", startTime: "08:00", endTime: "17:00", isOpen: true },
          { weekday: "Domingo", startTime: "09:00", endTime: "15:00", isOpen: false }
        ],
        notifications: {
          emailNotifications: true,
          smsNotifications: true,
          bookingReminders: true,
          newBookingAlerts: true
        },
        business: {
          timezone: cfg["business_timezone"] || "America/Sao_Paulo",
          bookingAdvanceDays: Number(cfg["business_booking_advance_days"] ?? 30),
          cancellationPolicy: cfg["business_cancellation_policy"] || "",
          paymentMethods: {
            pix: Boolean(cfg["payment_methods_pix"] === true || cfg["payment_methods_pix"] === "true"),
            creditCard: Boolean(cfg["payment_methods_credit_card"] === true || cfg["payment_methods_credit_card"] === "true"),
            debitCard: Boolean(cfg["payment_methods_debit_card"] === true || cfg["payment_methods_debit_card"] === "true"),
            cash: Boolean(cfg["payment_methods_cash"] === true || cfg["payment_methods_cash"] === "true"),
          },
          mercadoPagoConnected: Boolean(cfg["mercado_pago_connected"] === true || cfg["mercado_pago_connected"] === "true"),
          mercadoPagoAccessToken: cfg["mercado_pago_access_token"] || "",
        }
      };

      setSettings(settingsFromConfig);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      const payload = {
        barbershop_name: settings.name,
        barbershop_address: settings.address,
        barbershop_email: settings.email,
        barbershop_description: settings.description,
        barbershop_phones: settings.phones.join(','),
        barbershop_logo_url: settings.logoUrl || "",
        seo_title: settings.seoTitle || "",
        seo_description: settings.seoDescription || "",
        business_timezone: settings.business.timezone,
        business_booking_advance_days: settings.business.bookingAdvanceDays,
        business_cancellation_policy: settings.business.cancellationPolicy,
        payment_methods_pix: settings.business.paymentMethods.pix,
        payment_methods_credit_card: settings.business.paymentMethods.creditCard,
        payment_methods_debit_card: settings.business.paymentMethods.debitCard,
        payment_methods_cash: settings.business.paymentMethods.cash,
        mercado_pago_connected: settings.business.mercadoPagoConnected,
        mercado_pago_access_token: settings.business.mercadoPagoAccessToken || "",
      };

      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Falha ao salvar configs');
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    if (!settings) return;
    
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current = newSettings as any;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLogoUploading(true);
      const formData = new FormData();
      formData.append('logoFile', file);

      const response = await fetch('/api/admin/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload');
      }

      // Recarregar configurações para obter a nova logo
      await loadSettings();
      alert('Logo enviada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const connectMercadoPago = async () => {
    try {
      // Verificar se usuário está autenticado
      if (!session) {
        setMessage({ type: 'error', text: 'Usuário não autenticado. Faça login novamente.' });
        return;
      }

      setMessage({ type: 'success', text: '🔄 Conectando ao Mercado Pago...' });
      
      // Obter URL de autorização do backend
      const response = await fetch('/api/mercadopago/connect');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar conexão');
      }
      
      const { authUrl } = data;
      
      console.log('🚀 Iniciando OAuth Mercado Pago:', { authUrl: authUrl.substring(0, 100) + '...' });
      
      // Abrir popup de autorização
      const popup = window.open(authUrl, 'mercadopago_auth', 'width=600,height=700,scrollbars=yes,resizable=yes,top=100,left=100');
      
      if (!popup) {
        setMessage({ type: 'error', text: 'Popup bloqueado. Permita popups para este site e tente novamente.' });
        return;
      }
      
      // Monitorar se a popup foi fechada
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log('🔄 Popup fechada, verificando conexão...');
          
          // Recarregar configurações para verificar se foi conectado
          setTimeout(async () => {
            await loadSettings();
            
            // Verificar se foi conectado com sucesso
            if (settings?.business.mercadoPagoConnected) {
              setMessage({ type: 'success', text: '🎉 Mercado Pago conectado com sucesso!' });
            } else {
              setMessage({ type: 'error', text: 'Conexão não foi completada. Tente novamente.' });
            }
          }, 2000);
        }
      }, 1000);
      
      // Timeout de segurança (5 minutos)
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
          clearInterval(checkClosed);
          setMessage({ type: 'error', text: 'Timeout: A conexão demorou muito. Tente novamente.' });
        }
      }, 300000); // 5 minutos
      
    } catch (error) {
      console.error('Erro ao conectar Mercado Pago:', error);
      setMessage({ type: 'error', text: `Erro ao conectar: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    }
  };

  const disconnectMercadoPago = async () => {
    try {
      // Verificar se usuário está autenticado
      if (!session) {
        setMessage({ type: 'error', text: 'Usuário não autenticado. Faça login novamente.' });
        return;
      }

      const response = await fetch('/api/mercadopago/disconnect', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao desconectar');
      }

      // Recarregar configurações
      await loadSettings();
      setMessage({ type: 'success', text: 'Mercado Pago desconectado com sucesso!' });
    } catch (error) {
      console.error('Erro ao desconectar Mercado Pago:', error);
      setMessage({ type: 'error', text: `Erro ao desconectar: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    }
  };

  const testMercadoPagoConfig = async () => {
    try {
      const response = await fetch('/api/mercadopago/test');
      const data = await response.json();
      
      if (response.ok) {
        console.log('Configuração Mercado Pago:', data);
        setMessage({ 
          type: 'success', 
          text: `Configuração OK! Client ID: ${data.config.clientIdPrefix} | URL: ${data.config.appUrl}` 
        });
      } else {
        setMessage({ type: 'error', text: `Erro na configuração: ${data.error}` });
      }
    } catch (error) {
      console.error('Erro ao testar configuração:', error);
      setMessage({ type: 'error', text: 'Erro ao testar configuração do Mercado Pago' });
    }
  };

  // Sem toggle de sistema de barbearias

  const tabs = [
    { id: "general", name: "Geral", icon: Settings },
    { id: "notifications", name: "Notificações", icon: Bell },
    { id: "business", name: "Negócio", icon: CreditCard },
    { id: "security", name: "Segurança", icon: Shield }
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando configurações...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p>Erro ao carregar configurações</p>
            <Button onClick={loadSettings} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua barbearia
          </p>
        </div>

        {/* Mensagens de sucesso/erro */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' 
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
              <button
                onClick={() => setMessage(null)}
                className="text-current hover:opacity-75"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Informações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Logo da Barbearia</Label>
                    <LogoUpload
                      logoBase64={settings.logoBase64}
                      logoWidth={settings.logoWidth}
                      logoHeight={settings.logoHeight}
                      onUpload={handleLogoUpload}
                      onRemove={() => {
                        updateSetting("logoBase64", "");
                        updateSetting("logoWidth", 0);
                        updateSetting("logoHeight", 0);
                      }}
                      uploading={logoUploading}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Barbearia</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => updateSetting("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => updateSetting("address", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <textarea
                      id="description"
                      value={settings.description}
                      onChange={(e) => updateSetting("description", e.target.value)}
                      className="w-full p-2 border border-input bg-background rounded-md"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Horários de Funcionamento</Label>
                    <div className="space-y-2 mt-2">
                      {settings.workingHours.map((schedule, index) => (
                        <div key={schedule.weekday} className="flex items-center space-x-4">
                          <div className="w-20">
                            <span className="text-sm font-medium">{schedule.weekday}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={schedule.isOpen}
                              onChange={(e) => {
                                const newHours = [...settings.workingHours];
                                newHours[index].isOpen = e.target.checked;
                                updateSetting("workingHours", newHours);
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-muted-foreground">Aberto</span>
                          </div>
                          {schedule.isOpen && (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => {
                                  const newHours = [...settings.workingHours];
                                  newHours[index].startTime = e.target.value;
                                  updateSetting("workingHours", newHours);
                                }}
                                className="w-24"
                              />
                              <span className="text-sm">até</span>
                              <Input
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => {
                                  const newHours = [...settings.workingHours];
                                  newHours[index].endTime = e.target.value;
                                  updateSetting("workingHours", newHours);
                                }}
                                className="w-24"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seoTitle">Título SEO</Label>
                    <Input
                      id="seoTitle"
                      value={settings.seoTitle || ""}
                      onChange={(e) => updateSetting("seoTitle", e.target.value)}
                      placeholder="Barbearia X | Cortes e Barbas"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seoDescription">Descrição SEO</Label>
                    <textarea
                      id="seoDescription"
                      value={settings.seoDescription || ""}
                      onChange={(e) => updateSetting("seoDescription", e.target.value)}
                      className="w-full p-2 border border-input bg-background rounded-md"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">Notificações por E-mail</h3>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações importantes por e-mail
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => updateSetting("notifications.emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">Notificações por SMS</h3>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações por mensagem de texto
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) => updateSetting("notifications.smsNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">Lembretes de Agendamento</h3>
                        <p className="text-sm text-muted-foreground">
                          Enviar lembretes para clientes sobre seus agendamentos
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.bookingReminders}
                        onCheckedChange={(checked) => updateSetting("notifications.bookingReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">Alertas de Novos Agendamentos</h3>
                        <p className="text-sm text-muted-foreground">
                          Ser notificado quando novos agendamentos forem feitos
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.newBookingAlerts}
                        onCheckedChange={(checked) => updateSetting("notifications.newBookingAlerts", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Configurações de Negócio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select
                      value={settings.business.timezone}
                      onValueChange={(value) => updateSetting("business.timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="advanceDays">Dias de Antecedência para Agendamento</Label>
                    <Input
                      id="advanceDays"
                      type="number"
                      value={settings.business.bookingAdvanceDays}
                      onChange={(e) => updateSetting("business.bookingAdvanceDays", parseInt(e.target.value))}
                      min="1"
                      max="365"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cancellationPolicy">Política de Cancelamento</Label>
                    <textarea
                      id="cancellationPolicy"
                      value={settings.business.cancellationPolicy}
                      onChange={(e) => updateSetting("business.cancellationPolicy", e.target.value)}
                      className="w-full p-2 border border-input bg-background rounded-md"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Métodos de Pagamento</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 font-bold text-sm">P</span>
                          </div>
                          <div>
                            <Label htmlFor="pix" className="font-medium">PIX</Label>
                            <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                          </div>
                        </div>
                        <Switch
                          id="pix"
                          checked={settings.business.paymentMethods.pix}
                          onCheckedChange={(checked) => updateSetting("business.paymentMethods.pix", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <Label htmlFor="creditCard" className="font-medium">Cartão de Crédito</Label>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                          </div>
                        </div>
                        <Switch
                          id="creditCard"
                          checked={settings.business.paymentMethods.creditCard}
                          onCheckedChange={(checked) => updateSetting("business.paymentMethods.creditCard", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <Label htmlFor="debitCard" className="font-medium">Cartão de Débito</Label>
                            <p className="text-sm text-muted-foreground">Débito direto na conta</p>
                          </div>
                        </div>
                        <Switch
                          id="debitCard"
                          checked={settings.business.paymentMethods.debitCard}
                          onCheckedChange={(checked) => updateSetting("business.paymentMethods.debitCard", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">$</span>
                          </div>
                          <div>
                            <Label htmlFor="cash" className="font-medium">Pagar na Hora</Label>
                            <p className="text-sm text-muted-foreground">Dinheiro ou cartão presencial</p>
                          </div>
                        </div>
                        <Switch
                          id="cash"
                          checked={settings.business.paymentMethods.cash}
                          onCheckedChange={(checked) => updateSetting("business.paymentMethods.cash", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Integração Mercado Pago</Label>
                    
                    {settings.business.mercadoPagoConnected ? (
                      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <strong>Conta conectada com sucesso!</strong>
                              <p className="text-sm mt-1">Sua conta Mercado Pago está ativa e pronta para processar pagamentos.</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={disconnectMercadoPago}
                              className="ml-4"
                            >
                              Desconectar
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <AlertDescription className="text-orange-800 dark:text-orange-200">
                          <div className="space-y-3">
                            <div>
                              <strong>Mercado Pago não conectado</strong>
                              <p className="text-sm mt-1">Conecte sua conta para processar pagamentos online automaticamente.</p>
                            </div>
                            <div className="space-y-3">
                              <Button
                                onClick={connectMercadoPago}
                                className="w-full"
                                size="lg"
                              >
                                <CreditCard className="h-5 w-5 mr-2" />
                                Conectar Mercado Pago
                              </Button>
                              <Button
                                variant="outline"
                                onClick={testMercadoPagoConfig}
                                className="w-full"
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Testar Configuração
                              </Button>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <div className="flex items-center justify-between p-6 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Alterar Senha</h3>
                          <p className="text-sm text-muted-foreground">
                            Para sua segurança, recomendamos alterar sua senha regularmente
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        Alterar Senha
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-6 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Sessões Ativas</h3>
                          <p className="text-sm text-muted-foreground">
                            Gerencie suas sessões ativas em diferentes dispositivos
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        Ver Sessões Ativas
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-6 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                          <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Backup de Dados</h3>
                          <p className="text-sm text-muted-foreground">
                            Faça backup dos seus dados importantes
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Fazer Backup
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Botão de salvar */}
            <div className="mt-8 flex justify-end">
              <Button onClick={saveSettings} disabled={saving} size="lg" className="min-w-[200px]">
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </div>
        </Tabs>
        </div>
      </div>
    </div>
  );
}

