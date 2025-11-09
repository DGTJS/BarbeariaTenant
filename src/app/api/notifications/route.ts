import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase, getSession } from "@/_lib/auth";

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Verificar autenticação
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [NOTIFICATIONS-GET] Buscando notificações do usuário no tenant: ${hostname}`);

    // Buscar apenas notificações do usuário logado que já foram enviadas
    const notifications = await db.notification.findMany({
      where: {
        userId: session.userId,
        status: {
          in: ["sent", "read"], // Apenas notificações reais (enviadas ou lidas)
        },
      },
      include: {
        template: {
          select: {
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    // Transformar notificações para o formato do frontend
    const formattedNotifications = notifications.map((notification) => {
      // Tentar parsear actionUrl e actionText do content se for JSON
      let actionUrl: string | undefined;
      let actionText: string | undefined;
      let message = notification.content;

      try {
        const contentJson = JSON.parse(notification.content);
        if (contentJson.actionUrl) actionUrl = contentJson.actionUrl;
        if (contentJson.actionText) actionText = contentJson.actionText;
        if (contentJson.message) message = contentJson.message;
        if (contentJson.text) message = contentJson.text;
      } catch {
        // Se não for JSON, usar o content como mensagem
      }

      // Determinar título baseado na categoria ou assunto
      let title = notification.subject || notification.template?.name || "Notificação";
      
      // Mapear categoria para tipo de notificação
      let notificationType: string = "system";
      if (notification.category === "booking_confirmation") {
        notificationType = "booking_confirmation";
        if (!title || title === "Notificação") {
          title = "Agendamento Confirmado!";
        }
      } else if (notification.category === "booking_reminder") {
        notificationType = "booking_confirmation";
        if (!title || title === "Notificação") {
          title = "Lembrete de Agendamento";
        }
      } else if (notification.category === "promotion") {
        notificationType = "promotion";
        if (!title || title === "Notificação") {
          title = "Promoção Especial";
        }
      } else if (notification.category === "remarketing") {
        notificationType = "remarketing";
        if (!title || title === "Notificação") {
          title = "Você esqueceu algo?";
        }
      } else if (notification.category === "custom") {
        notificationType = "admin_message";
      }

      return {
        id: notification.id,
        type: notificationType,
        title,
        message,
        isRead: notification.status === "read" || !!notification.readAt,
        createdAt: notification.createdAt,
        actionUrl,
        actionText,
        category: notification.category,
      };
    });

    console.log(`✅ [NOTIFICATIONS-GET] ${formattedNotifications.length} notificações encontradas para o usuário no tenant: ${hostname}`);

    return NextResponse.json(formattedNotifications);
  } catch (error) {
    console.error("❌ [NOTIFICATIONS-GET] Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // CRÍTICO: Verificar autenticação
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [NOTIFICATIONS-PUT] Atualizando notificação no tenant: ${hostname}`);

    const data = await request.json();
    const { id, status, readAt } = data;

    if (!id) {
      return NextResponse.json(
        { error: "ID da notificação é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a notificação pertence ao usuário
    const existingNotification = await db.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      console.error(`❌ [NOTIFICATIONS-PUT] Notificação ${id} não encontrada no tenant: ${hostname}`);
      return NextResponse.json(
        { error: "Notificação não encontrada" },
        { status: 404 }
      );
    }

    if (existingNotification.userId !== session.userId) {
      console.error(`❌ [NOTIFICATIONS-PUT] Notificação ${id} não pertence ao usuário no tenant: ${hostname}`);
      return NextResponse.json(
        { error: "Acesso negado. Você só pode atualizar suas próprias notificações." },
        { status: 403 }
      );
    }

    // Atualizar notificação
    const notification = await db.notification.update({
      where: { id },
      data: {
        status: status || "read",
        readAt: readAt !== undefined ? (readAt ? new Date() : null) : new Date(),
      },
    });

    console.log(`✅ [NOTIFICATIONS-PUT] Notificação atualizada com sucesso no tenant: ${hostname}`, notification.id);

    return NextResponse.json(notification);
  } catch (error) {
    console.error("❌ [NOTIFICATIONS-PUT] Error updating notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

