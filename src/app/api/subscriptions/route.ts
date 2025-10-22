import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// Guardaremos créditos e plano atual por usuário em SiteConfig user-specific (simplificado):
// keys: subscription_<userId> => { planId, credits: { [serviceId]: number } }
const PREFIX = "subscription_";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId obrigatório" }, { status: 400 });
    const row = await db.siteConfig.findUnique({ where: { key: PREFIX + userId } });
    return NextResponse.json(row ? JSON.parse(row.value) : null);
  } catch {
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

// Inicializa assinatura com base em um plano e seus limites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, plan } = body; // plan é objeto da rota /admin/plans
    if (!userId || !plan?.id) return NextResponse.json({ error: "userId e plan são obrigatórios" }, { status: 400 });
    const credits = plan.limits || {};
    await db.siteConfig.upsert({
      where: { key: PREFIX + userId },
      update: { value: JSON.stringify({ planId: plan.id, credits }), type: "string" },
      create: { key: PREFIX + userId, value: JSON.stringify({ planId: plan.id, credits }), type: "string" },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

// Consome 1 crédito de um serviço, se disponível
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, serviceId } = body;
    if (!userId || !serviceId) return NextResponse.json({ error: "userId e serviceId são obrigatórios" }, { status: 400 });
    const row = await db.siteConfig.findUnique({ where: { key: PREFIX + userId } });
    if (!row) return NextResponse.json({ error: "Assinatura não encontrada" }, { status: 404 });
    const sub = JSON.parse(row.value) as { planId: string; credits: Record<string, number> };
    const current = sub.credits?.[serviceId] ?? 0;
    if (current <= 0) return NextResponse.json({ error: "Sem créditos" }, { status: 402 });
    sub.credits[serviceId] = current - 1;
    await db.siteConfig.update({ where: { key: PREFIX + userId }, data: { value: JSON.stringify(sub) } });
    return NextResponse.json({ success: true, remaining: sub.credits[serviceId] });
  } catch {
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}



