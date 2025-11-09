import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_server/auth-options";

// POST /api/webhooks/register
// Registra um webhook para receber notificações de mudança de status
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, events, description } = body;

    if (!url || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Parâmetros inválidos. Envie: url, events[]" },
        { status: 400 }
      );
    }

    // Validar URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "URL inválida" },
        { status: 400 }
      );
    }

    // Criar webhook no banco
    const webhook = await db.webhook.create({
      data: {
        url,
        events,
        description: description || "",
        active: true,
        secret: generateWebhookSecret(),
      }
    });

    return NextResponse.json({
      id: webhook.id,
      url: webhook.url,
      events: webhook.events,
      secret: webhook.secret,
      message: "Webhook registrado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao registrar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao registrar webhook" },
      { status: 500 }
    );
  }
}

// GET /api/webhooks/register
// Lista webhooks registrados
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const webhooks = await db.webhook.findMany({
      where: { active: true },
      select: {
        id: true,
        url: true,
        events: true,
        description: true,
        createdAt: true,
        lastTriggeredAt: true,
      }
    });

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error("Erro ao listar webhooks:", error);
    return NextResponse.json(
      { error: "Erro ao listar webhooks" },
      { status: 500 }
    );
  }
}

// DELETE /api/webhooks/register?id=...
// Remove um webhook
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do webhook não fornecido" },
        { status: 400 }
      );
    }

    await db.webhook.update({
      where: { id },
      data: { active: false }
    });

    return NextResponse.json({ message: "Webhook removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover webhook:", error);
    return NextResponse.json(
      { error: "Erro ao remover webhook" },
      { status: 500 }
    );
  }
}

function generateWebhookSecret(): string {
  return `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

