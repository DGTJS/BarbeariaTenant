import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

const PLANS_KEY = "plans_json"; // JSON string array de planos

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly?: number;
  allowFranchises?: boolean;
  franchiseExtraFee?: number;
  limits?: Record<string, number>;
  description?: string;
};

async function readPlans(): Promise<Plan[]> {
  const cfg = await db.siteConfig.findUnique({ where: { key: PLANS_KEY } });
  if (!cfg) return [];
  try { return JSON.parse(cfg.value) as Plan[]; } catch { return []; }
}

async function writePlans(plans: Plan[]) {
  const value = JSON.stringify(plans);
  await db.siteConfig.upsert({
    where: { key: PLANS_KEY },
    update: { value, type: "string" },
    create: { key: PLANS_KEY, value, type: "string" },
  });
}

export async function GET() {
  try {
    const plans = await readPlans();
    return NextResponse.json(plans);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao ler planos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const plans = await readPlans();
    const newPlan: Plan = {
      id: crypto.randomUUID(),
      name: body.name,
      priceMonthly: Number(body.priceMonthly ?? 0),
      priceYearly: body.priceYearly != null ? Number(body.priceYearly) : undefined,
      allowFranchises: !!body.allowFranchises,
      franchiseExtraFee: body.franchiseExtraFee != null ? Number(body.franchiseExtraFee) : undefined,
      limits: body.limits || {},
      description: body.description || "",
    };
    await writePlans([...plans, newPlan]);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao criar plano" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const plans = await readPlans();
    const idx = plans.findIndex(p => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 });
    plans[idx] = { ...plans[idx], ...body, id: plans[idx].id };
    await writePlans(plans);
    return NextResponse.json(plans[idx]);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao atualizar plano" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
    const plans = await readPlans();
    const filtered = plans.filter(p => p.id !== id);
    await writePlans(filtered);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao remover plano" }, { status: 500 });
  }
}



