"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Textarea } from "@/_components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { useSiteConfig } from "@/_hooks/useSiteConfig";
import ImprovedScheduleSelector from "@/_components/ui/improved-schedule-selector";
import EnhancedLogoUpload from "@/_components/enhanced-logo-upload";
import LogoPreview from "@/_components/logo-preview";
import FaviconUpload from "@/_components/favicon-upload";
import AdminHeader from "@/_components/admin-header";
import LoadingScreen from "@/_components/loading-screen";
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
  Loader2,
  Globe,
  Search
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { config, loading, error, updateConfig } = useSiteConfig();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [localConfig, setLocalConfig] = useState(config);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (status === "unauthenticated" || (!session && status !== "loading")) {
      window.location.href = "/admin/login";
    }
  }, [status, session]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Sincronizar localConfig com config quando carregado
  useEffect(() => {
    if (!loading && config) {
      setLocalConfig(config);
    }
  }, [config, loading]);

  const saveSettings = async () => {
    try {
      setSaving(true);
      await updateConfig(localConfig);
      showMessage('success', 'Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showMessage('error', 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
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

      showMessage('success', 'Logo enviada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      showMessage('error', 'Erro ao enviar logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFaviconUploading(true);
      const formData = new FormData();
      formData.append('faviconFile', file);

      const response = await fetch('/api/admin/favicon', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload');
      }

      showMessage('success', 'Favicon enviado com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      showMessage('error', 'Erro ao enviar favicon');
    } finally {
      setFaviconUploading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <AdminHeader />
        <LoadingScreen message="Carregando configurações" />
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Configurações do Sistema
          </h1>
            <p className="text-gray-600 dark:text-gray-400">
            Gerencie as configurações da sua barbearia
          </p>
        </div>

        {message && (
            <Alert className={`mb-6 ${
              message.type === 'success' 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700' 
                : 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className={`h-4 w-4 text-green-600 dark:text-green-400`} />
              ) : (
                <AlertTriangle className={`h-4 w-4 text-red-600 dark:text-red-400`} />
              )}
              <AlertDescription className={
                message.type === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Marca
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horários
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            {/* Aba Geral */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informações da Barbearia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Barbearia</Label>
                      <Input
                        id="name"
                        value={localConfig.barbershop_name || ""}
                        onChange={(e) => updateSetting("barbershop_name", e.target.value)}
                        placeholder="Digite o nome da barbearia"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={localConfig.barbershop_email || ""}
                        onChange={(e) => updateSetting("barbershop_email", e.target.value)}
                        placeholder="contato@barbearia.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      value={localConfig.barbershop_address || ""}
                      onChange={(e) => updateSetting("barbershop_address", e.target.value)}
                      placeholder="Rua Exemplo, 123 - Bairro, Cidade - Estado"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={localConfig.barbershop_phone || ""}
                      onChange={(e) => updateSetting("barbershop_phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={localConfig.barbershop_description || ""}
                      onChange={(e) => updateSetting("barbershop_description", e.target.value)}
                      placeholder="Descreva sua barbearia..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={saveSettings} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Marca */}
            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Logo da Barbearia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <EnhancedLogoUpload
                    logoBase64={config.barbershop_logo_base64}
                    logoWidth={config.barbershop_logo_width}
                    logoHeight={config.barbershop_logo_height}
                    onUpload={handleLogoUpload}
                    onRemove={() => {
                      updateSetting("barbershop_logo_base64", "");
                      updateSetting("barbershop_logo_width", 0);
                      updateSetting("barbershop_logo_height", 0);
                    }}
                    uploading={logoUploading}
                  />
                  
                  {/* Preview da Logo */}
                  <LogoPreview
                    logoBase64={config.barbershop_logo_base64}
                    logoWidth={config.barbershop_logo_width}
                    logoHeight={config.barbershop_logo_height}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Favicon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FaviconUpload
                    faviconBase64={config.barbershop_favicon_base64}
                    faviconWidth={config.barbershop_favicon_width}
                    faviconHeight={config.barbershop_favicon_height}
                    onUpload={handleFaviconUpload}
                    onRemove={() => updateSetting("barbershop_favicon_base64", "")}
                    uploading={faviconUploading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Horários */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horários de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImprovedScheduleSelector
                    selectedDays={config.working_days || []}
                    onDaysChange={(days) => updateSetting("working_days", days)}
                    schedules={config.custom_schedules || []}
                    onSchedulesChange={(schedules) => updateSetting("custom_schedules", schedules)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba SEO */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Configurações de SEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="seo-title">Título da Página</Label>
                    <Input
                      id="seo-title"
                      value={config.seo_title || ""}
                      onChange={(e) => updateSetting("seo_title", e.target.value)}
                      placeholder="Título que aparece nos resultados de busca"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seo-description">Descrição</Label>
                    <Textarea
                      id="seo-description"
                      value={config.seo_description || ""}
                      onChange={(e) => updateSetting("seo_description", e.target.value)}
                      placeholder="Descrição que aparece nos resultados de busca"
                      rows={3}
                    />
                  </div>

                          <div>
                    <Label htmlFor="seo-keywords">Palavras-chave</Label>
                    <Input
                      id="seo-keywords"
                      value={config.seo_keywords || ""}
                      onChange={(e) => updateSetting("seo_keywords", e.target.value)}
                      placeholder="barbearia, corte de cabelo, barba, masculino"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botão Salvar */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2"
            >
                {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                <Save className="h-4 w-4" />
                )}
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}