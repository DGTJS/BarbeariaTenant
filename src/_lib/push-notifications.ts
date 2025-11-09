// Biblioteca para gerenciar notificações push

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Este navegador não suporta notificações');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker não é suportado neste navegador');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registrado com sucesso:', registration);
    return registration;
  } catch (error) {
    console.error('Erro ao registrar Service Worker:', error);
    return null;
  }
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    const registration = await registerServiceWorker();
    if (!registration) {
      return null;
    }

    // Solicitar permissão
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('Permissão de notificação negada');
      return null;
    }

    // Verificar se já existe uma inscrição
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Criar nova inscrição
      // NOTA: Em produção, você precisa gerar uma chave VAPID
      // https://web.dev/push-notifications-subscribing-a-user/
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
      
      if (!vapidPublicKey) {
        console.warn('VAPID Public Key não configurada. Configure NEXT_PUBLIC_VAPID_PUBLIC_KEY no .env');
        // Por enquanto, criar inscrição sem VAPID (apenas para desenvolvimento)
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey ? urlBase64ToUint8Array(vapidPublicKey) : undefined
      });
    }

    return subscription;
  } catch (error) {
    console.error('Erro ao se inscrever em push notifications:', error);
    return null;
  }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao cancelar inscrição de push notifications:', error);
    return false;
  }
}

export async function savePushSubscription(subscription: PushSubscription): Promise<boolean> {
  try {
    const response = await fetch('/api/user/push-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: JSON.stringify(subscription)
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao salvar inscrição:', error);
    return false;
  }
}

export async function removePushSubscription(): Promise<boolean> {
  try {
    const response = await fetch('/api/user/push-subscription', {
      method: 'DELETE'
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao remover inscrição:', error);
    return false;
  }
}

// Função helper para converter VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Função para mostrar notificação local (sem servidor)
export async function showLocalNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) {
    console.warn('Notificações não são suportadas');
    return;
  }

  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    });
  }
}

