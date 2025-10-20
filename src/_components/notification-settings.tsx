"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Switch } from "@/_components/ui/switch";
import { Label } from "@/_components/ui/label";
import { Input } from "@/_components/ui/input";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Volume2,
  VolumeX
} from "lucide-react";
import { toast } from "sonner";

interface NotificationSettingsProps {
  userId: string;
}

const NotificationSettings = ({ userId }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    pushNotifications: true,
    soundNotifications: true,
    whatsappNumber: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/notification-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...data,
          whatsappNumber: data.whatsappNumber || ""
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Configurações salvas com sucesso!');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'whatsappNumber') return;
    
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border border-card-border/30 shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Notificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email */}
        <div className="flex items-center justify-between p-4 bg-card-secondary/30 rounded-lg border border-card-border/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <Label className="text-sm font-medium">Notificações por Email</Label>
              <p className="text-xs text-muted-foreground">Receber lembretes e atualizações por email</p>
            </div>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={() => handleToggle('emailNotifications')}
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-card-secondary/30 rounded-lg border border-card-border/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <Label className="text-sm font-medium">Notificações por WhatsApp</Label>
                <p className="text-xs text-muted-foreground">Receber lembretes via WhatsApp</p>
              </div>
            </div>
            <Switch
              checked={settings.whatsappNotifications}
              onCheckedChange={() => handleToggle('whatsappNotifications')}
            />
          </div>
          
          {settings.whatsappNotifications && (
            <div className="ml-13">
              <Label htmlFor="whatsapp" className="text-sm font-medium">Número do WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={settings.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                className="bg-card-secondary/50 border-card-border/30 mt-1"
              />
            </div>
          )}
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 bg-card-secondary/30 rounded-lg border border-card-border/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <Label className="text-sm font-medium">Notificações Push</Label>
              <p className="text-xs text-muted-foreground">Receber notificações no navegador</p>
            </div>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={() => handleToggle('pushNotifications')}
          />
        </div>

        {/* Sound Notifications */}
        <div className="flex items-center justify-between p-4 bg-card-secondary/30 rounded-lg border border-card-border/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
              {settings.soundNotifications ? (
                <Volume2 className="h-5 w-5 text-orange-500" />
              ) : (
                <VolumeX className="h-5 w-5 text-orange-500" />
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Notificações Sonoras</Label>
              <p className="text-xs text-muted-foreground">Tocar som ao receber notificações</p>
            </div>
          </div>
          <Switch
            checked={settings.soundNotifications}
            onCheckedChange={() => handleToggle('soundNotifications')}
          />
        </div>

        {/* Botão Salvar */}
        <div className="pt-4 border-t border-card-border/20">
          <Button 
            onClick={saveSettings}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
