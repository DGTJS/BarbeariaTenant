import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/_lib/auth";
import { db } from "@/_lib/prisma";
import { requireAdmin, requireAdminOnly } from "@/_lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Verificar autenticação
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [ADMIN-NOTIFICATIONS-GET] Buscando notificações no tenant: ${hostname}`);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    // Verificar se é admin ou barbeiro
    let isAdmin = false;
    try {
      const auth = await requireAdmin(session, request);
      isAdmin = auth.isAdmin || auth.hasAdminAccess || false;
    } catch {
      // Se não for admin, só pode ver suas próprias notificações
    }

    const where: any = {};

    // Se não é admin, só pode ver suas próprias notificações
    if (!isAdmin) {
      where.userId = session.userId;
    } else if (userId) {
      where.userId = userId;
    }

    if (status) where.status = status;
    if (type) where.type = type;

    const notifications = await db.notification.findMany({
      where,
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

    console.log(`✅ [ADMIN-NOTIFICATIONS-GET] ${notifications.length} notificações encontradas no tenant: ${hostname}`);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // CRÍTICO: Verificar permissão usando sistema customizado
    try {
      await requireAdminOnly(null, request);
    } catch (error) {
      return NextResponse.json(
        {
          message: error instanceof Error ? error.message : "Unauthorized",
        },
        { status: 403 }
      );
    }

    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [ADMIN-NOTIFICATIONS-POST] Criando notificações`);

    const data = await request.json();
    const {
      templateId,
      type,
      category,
      subject,
      content,
      isGlobal,
      clientIds,
      actionUrl,
      actionText,
    } = data;

    // Se é notificação global, enviar para todos os usuários
    if (isGlobal) {
      const users = await db.user.findMany({
        where: {
          role: 3, // Cliente
          OR: [
            { emailNotifications: type === "email" ? true : undefined },
            { whatsappNotifications: type === "whatsapp" ? true : undefined },
            { pushNotifications: type === "push" ? true : undefined },
          ],
        },
        select: {
          id: true,
        },
      });

      const notifications = users.map(user => {
        // Se há actionUrl ou actionText, criar conteúdo JSON
        let notificationContent = content;
        if (actionUrl || actionText) {
          const contentObj: any = {
            message: content,
            text: content,
          };
          if (actionUrl) contentObj.actionUrl = actionUrl;
          if (actionText) contentObj.actionText = actionText;
          notificationContent = JSON.stringify(contentObj);
        }

        return {
          userId: user.id,
          templateId: templateId || null,
          type,
          category,
          subject: subject || null,
          content: notificationContent,
          status: "sent", // Marcar como enviada (real)
          sentAt: new Date(), // Data de envio
        };
      });

      if (notifications.length === 0) {
        return NextResponse.json({
          message:
            "Nenhum cliente encontrado com as configurações de notificação ativas",
          count: 0,
        });
      }

      await db.notification.createMany({
        data: notifications,
      });

      console.log(`✅ [ADMIN-NOTIFICATIONS-POST] ${notifications.length} notificações criadas no tenant: ${hostname}`);

      return NextResponse.json({
        message: `${notifications.length} notificação(ões) criada(s) com sucesso!`,
        count: notifications.length,
      });
    } else if (clientIds && Array.isArray(clientIds) && clientIds.length > 0) {
      // Notificação para clientes específicos
      const notifications = clientIds.map(clientId => {
        // Se há actionUrl ou actionText, criar conteúdo JSON
        let notificationContent = content;
        if (actionUrl || actionText) {
          const contentObj: any = {
            message: content,
            text: content,
          };
          if (actionUrl) contentObj.actionUrl = actionUrl;
          if (actionText) contentObj.actionText = actionText;
          notificationContent = JSON.stringify(contentObj);
        }

        return {
          userId: clientId,
          templateId: templateId || null,
          type,
          category,
          subject: subject || null,
          content: notificationContent,
          status: "sent", // Marcar como enviada (real)
          sentAt: new Date(), // Data de envio
        };
      });

      await db.notification.createMany({
        data: notifications,
      });

      console.log(`✅ [ADMIN-NOTIFICATIONS-POST] ${notifications.length} notificações criadas para clientes específicos no tenant: ${hostname}`);

      return NextResponse.json({
        message: `${notifications.length} notificação(ões) criada(s) para clientes específicos!`,
        count: notifications.length,
      });
    } else {
      return NextResponse.json(
        { message: "É necessário especificar destinatários" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
