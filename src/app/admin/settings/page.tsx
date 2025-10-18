"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
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
  CheckCircle
} from "lucide-react";

interface BarberShopSettings {
  id: string;
  name: string;
  address: string;
  phones: string[];
  email: string;
  description: string;
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
    currency: string;
    timezone: string;
    bookingAdvanceDays: number;
    cancellationPolicy: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<BarberShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSettings: BarberShopSettings = {
        id: "1",
        name: "Barbearia Moderna",
        address: "Rua das Flores, 123 - Centro",
        phones: ["(11) 99999-9999", "(11) 88888-8888"],
        email: "contato@barbeariamoderna.com",
        description: "Barbearia moderna com cortes e barbas de qualidade",
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
          currency: "BRL",
          timezone: "America/Sao_Paulo",
          bookingAdvanceDays: 30,
          cancellationPolicy: "Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência"
        }
      };
      
      setSettings(mockSettings);
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
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Navegação lateral */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo das configurações */}
          <div className="lg:col-span-3">
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Informações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notificações por E-mail</h3>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações importantes por e-mail
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => updateSetting("notifications.emailNotifications", e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notificações por SMS</h3>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações por mensagem de texto
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => updateSetting("notifications.smsNotifications", e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Lembretes de Agendamento</h3>
                        <p className="text-sm text-muted-foreground">
                          Enviar lembretes para clientes sobre seus agendamentos
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.bookingReminders}
                        onChange={(e) => updateSetting("notifications.bookingReminders", e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Alertas de Novos Agendamentos</h3>
                        <p className="text-sm text-muted-foreground">
                          Ser notificado quando novos agendamentos forem feitos
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.newBookingAlerts}
                        onChange={(e) => updateSetting("notifications.newBookingAlerts", e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "business" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Configurações de Negócio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Moeda</Label>
                      <select
                        id="currency"
                        value={settings.business.currency}
                        onChange={(e) => updateSetting("business.currency", e.target.value)}
                        className="w-full p-2 border border-input bg-background rounded-md"
                      >
                        <option value="BRL">Real (BRL)</option>
                        <option value="USD">Dólar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <select
                        id="timezone"
                        value={settings.business.timezone}
                        onChange={(e) => updateSetting("business.timezone", e.target.value)}
                        className="w-full p-2 border border-input bg-background rounded-md"
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">Nova York (GMT-5)</option>
                        <option value="Europe/London">Londres (GMT+0)</option>
                      </select>
                    </div>
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
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Alterar Senha</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Para sua segurança, recomendamos alterar sua senha regularmente
                      </p>
                      <Button variant="outline">
                        Alterar Senha
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Sessões Ativas</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Gerencie suas sessões ativas em diferentes dispositivos
                      </p>
                      <Button variant="outline">
                        Ver Sessões Ativas
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Backup de Dados</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Faça backup dos seus dados importantes
                      </p>
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Fazer Backup
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botão de salvar */}
            <div className="mt-6">
              <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
