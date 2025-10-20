"use client";

import { useState, useEffect } from "react";
import { Bell, X, Calendar, Megaphone, Gift, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { ScrollArea } from "@/_components/ui/scroll-area";

interface Notification {
  id: string;
  type: 'booking_confirmation' | 'admin_message' | 'announcement' | 'remarketing' | 'promotion' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data - em produção viria de uma API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'booking_confirmation',
        title: 'Agendamento Confirmado!',
        message: 'Seu agendamento para Corte Degradê com João foi confirmado para amanhã às 14:00.',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        actionUrl: '/profile',
        actionText: 'Ver Agendamentos'
      },
      {
        id: '2',
        type: 'admin_message',
        title: 'Mensagem do Admin',
        message: 'Olá! Temos uma nova promoção especial para clientes VIP. Confira na sua área de agendamentos.',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
        actionUrl: '/profile',
        actionText: 'Ver Promoção'
      },
      {
        id: '3',
        type: 'announcement',
        title: 'Nova Funcionalidade',
        message: 'Agora você pode avaliar seus serviços! Deixe sua opinião e ajude outros clientes.',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
        actionUrl: '/profile',
        actionText: 'Avaliar Serviços'
      },
      {
        id: '4',
        type: 'promotion',
        title: 'Promoção Especial',
        message: 'Desconto de 20% em todos os serviços para novos clientes! Válido até o final do mês.',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
        actionUrl: '/',
        actionText: 'Agendar Agora'
      },
      {
        id: '5',
        type: 'remarketing',
        title: 'Você esqueceu algo?',
        message: 'Vimos que você estava interessado em nossos serviços. Que tal agendar um horário?',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dias atrás
        actionUrl: '/',
        actionText: 'Agendar'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmation':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'admin_message':
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'promotion':
        return <Gift className="h-5 w-5 text-orange-500" />;
      case 'remarketing':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'booking_confirmation':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 text-xs">Confirmação</Badge>;
      case 'admin_message':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 text-xs">Admin</Badge>;
      case 'announcement':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 text-xs">Anúncio</Badge>;
      case 'promotion':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700 text-xs">Promoção</Badge>;
      case 'remarketing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700 text-xs">Lembrete</Badge>;
      case 'system':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700 text-xs">Sistema</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700 text-xs">Notificação</Badge>;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[85vh] max-h-[600px] p-0 flex flex-col">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="flex items-center gap-2 text-foreground text-lg">
              <Bell className="h-5 w-5" />
              Notificações
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs hidden sm:flex"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-sm text-muted-foreground">
                Você está em dia! Novas notificações aparecerão aqui.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="space-y-3 p-4 sm:p-6">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 rounded-lg border transition-all cursor-pointer hover:bg-accent/50 ${
                      notification.isRead 
                        ? 'bg-card border-border' 
                        : 'bg-primary/5 border-primary/20 shadow-sm'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm text-foreground break-words">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getNotificationBadge(notification.type)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed break-words">
                          {notification.message}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              Marcar como lida
                            </Button>
                            
                            {notification.actionUrl && notification.actionText && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Aqui você pode adicionar navegação
                                  window.location.href = notification.actionUrl!;
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
