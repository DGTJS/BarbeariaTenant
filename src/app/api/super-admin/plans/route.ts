import { NextRequest, NextResponse } from "next/server";
import { prismaSuper } from "@/_lib/prisma-super";
import { requireSuperAdmin } from "@/_lib/super-admin-auth";

export async function GET(request: NextRequest) {
  try {
    // Não exigir autenticação para GET (pode ser usado no signup público)
    // Apenas verificar se está autenticado, mas não bloquear
    try {
      await requireSuperAdmin();
    } catch {
      // Não autenticado, mas pode continuar (signup público)
    }

    const { searchParams } = new URL(request.url);
    const statusOnly = searchParams.get("statusOnly");

    const where: any = {};
    if (statusOnly === "true") {
      where.status = true;
    }

    const plans = await prismaSuper.plan.findMany({
      where,
      orderBy: { price: "asc" },
    });

    // Serializar valores Decimal
    const serializedPlans = plans.map(plan => ({
      ...plan,
      price: Number(plan.price),
    }));

    return NextResponse.json(serializedPlans);
  } catch (error: any) {
    console.error("Erro ao buscar planos:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar planos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação do Super Admin
    await requireSuperAdmin();

    const body = await request.json();

    const plan = await prismaSuper.plan.create({
      data: {
        name: body.name,
        price: body.price,
        period: body.period || "monthly",
        description: body.description,
        maxBarbers: body.maxBarbers || 0,
        maxServices: body.maxServices || 0,
        maxServiceOptions: body.maxServiceOptions || 0,
        maxBookingsPerMonth: body.maxBookingsPerMonth || 0,
        maxBarberShops: body.maxBarberShops || 1,
        maxStorageMB: body.maxStorageMB || 100,
        hasAnalytics: body.hasAnalytics || false,
        hasNotifications: body.hasNotifications ?? true,
        hasCustomDomain: body.hasCustomDomain || false,
        hasWhiteLabel: body.hasWhiteLabel || false,
        hasAPI: body.hasAPI || false,
        hasPrioritySupport: body.hasPrioritySupport || false,
        trialDays: body.trialDays || 14,
        requiresCard: body.requiresCard ?? true,
      },
    });

    return NextResponse.json({
      ...plan,
      price: Number(plan.price),
    });
  } catch (error: any) {
    console.error("Erro ao criar plano:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar plano" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const plan = await prismaSuper.plan.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ...plan,
      price: Number(plan.price),
    });
  } catch (error: any) {
    console.error("Erro ao atualizar plano:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar plano" },
      { status: 500 }
    );
  }
}
