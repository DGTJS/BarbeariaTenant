"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Settings, Shield, Mail, Key } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    asaasApiKey: "",
    asaasBaseUrl: "https://api.asaas.com/v3",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Implementar API endpoint
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações do Super Admin e integrações
        </p>
      </div>

      {/* Credenciais do Super Admin */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Credenciais do Super Admin</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={e =>
                setSettings({ ...settings, email: e.target.value })
              }
              placeholder="admin@barberboss.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Configure via variável de ambiente SUPER_ADMIN_EMAIL
            </p>
          </div>
          <div>
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              value={settings.password}
              onChange={e =>
                setSettings({ ...settings, password: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={settings.confirmPassword}
              onChange={e =>
                setSettings({ ...settings, confirmPassword: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSave} disabled={loading}>
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Integração Asaas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Integração Asaas</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="asaasApiKey">API Key</Label>
            <Input
              id="asaasApiKey"
              type="password"
              value={settings.asaasApiKey}
              onChange={e =>
                setSettings({ ...settings, asaasApiKey: e.target.value })
              }
              placeholder="sua-api-key-aqui"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Configure via variável de ambiente ASAAS_API_KEY
            </p>
          </div>
          <div>
            <Label htmlFor="asaasBaseUrl">URL Base</Label>
            <Input
              id="asaasBaseUrl"
              value={settings.asaasBaseUrl}
              onChange={e =>
                setSettings({ ...settings, asaasBaseUrl: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSave} disabled={loading} variant="outline">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Configurações de Email */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Configurações de Email</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={e =>
                  setSettings({ ...settings, smtpHost: e.target.value })
                }
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={settings.smtpPort}
                onChange={e =>
                  setSettings({ ...settings, smtpPort: e.target.value })
                }
                placeholder="587"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="smtpUser">Usuário SMTP</Label>
            <Input
              id="smtpUser"
              value={settings.smtpUser}
              onChange={e =>
                setSettings({ ...settings, smtpUser: e.target.value })
              }
              placeholder="seu-email@gmail.com"
            />
          </div>
          <div>
            <Label htmlFor="smtpPass">Senha SMTP</Label>
            <Input
              id="smtpPass"
              type="password"
              value={settings.smtpPass}
              onChange={e =>
                setSettings({ ...settings, smtpPass: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSave} disabled={loading} variant="outline">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
