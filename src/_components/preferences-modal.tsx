"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Switch } from "@/_components/ui/switch";
import { Label } from "@/_components/ui/label";
import { Settings, Bell, Mail, MessageSquare, Smartphone, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Input } from "@/_components/ui/input";
import { toast } from "sonner";
import { subscribeToPushNotifications, unsubscribeFromPushNotifications, savePushSubscription, removePushSubscription } from "@/_lib/push-notifications";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function PreferencesModal({ isOpen, onClose, userId }: PreferencesModalProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    pushNotifications: true,
    soundNotifications: true,
    whatsappNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen, userId]);

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

  const handleToggle = async (key: keyof typeof settings) => {
    if (key === 'whatsappNumber') return;
    
    // Se for push notifications, gerenciar a inscrição
    if (key === 'pushNotifications') {
      const newValue = !settings[key];
      
      if (newValue) {
        // Ativar push notifications
        try {
          const subscription = await subscribeToPushNotifications();
          if (subscription) {
            await savePushSubscription(subscription);
            toast.success('Notificações push ativadas!');
          } else {
            toast.error('Não foi possível ativar notificações push');
            return;
          }
        } catch (error) {
          console.error('Erro ao ativar push:', error);
          toast.error('Erro ao ativar notificações push');
          return;
        }
      } else {
        // Desativar push notifications
        try {
          await unsubscribeFromPushNotifications();
          await removePushSubscription();
          toast.success('Notificações push desativadas!');
        } catch (error) {
          console.error('Erro ao desativar push:', error);
        }
      }
    }
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        toast.success('Preferências salvas com sucesso!');
        onClose();
      } else {
        toast.error('Erro ao salvar preferências');
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-card-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Preferências
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificações
            </h3>

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
                <div className="ml-13 pl-4">
                  <Label htmlFor="whatsapp" className="text-sm font-medium">Número do WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={settings.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    className="bg-card-secondary/50 border-card-border/30 mt-2"
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
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-card-border/20">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Preferências"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

