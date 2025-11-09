import { NextRequest, NextResponse } from "next/server";
import { prismaSuper } from "@/_lib/prisma-super";
import { requireSuperAdmin } from "@/_lib/super-admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação do Super Admin
    await requireSuperAdmin();

    const { id } = params;

    const plan = await prismaSuper.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...plan,
      price: Number(plan.price),
    });
  } catch (error: any) {
    console.error("Erro ao buscar plano:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar plano" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação do Super Admin
    await requireSuperAdmin();

    const { id } = params;
    const body = await request.json();

    // Verificar se o plano existe
    const existingPlan = await prismaSuper.plan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    // Validar dados se necessário
    if (body.price !== undefined && (isNaN(body.price) || body.price < 0)) {
      return NextResponse.json({ error: "Preço inválido" }, { status: 400 });
    }

    const plan = await prismaSuper.plan.update({
      where: { id },
      data: {
        ...body,
        // Garantir que campos numéricos sejam convertidos corretamente
        price: body.price !== undefined ? body.price : existingPlan.price,
        maxBarbers:
          body.maxBarbers !== undefined
            ? parseInt(String(body.maxBarbers))
            : existingPlan.maxBarbers,
        maxServices:
          body.maxServices !== undefined
            ? parseInt(String(body.maxServices))
            : existingPlan.maxServices,
        maxServiceOptions:
          body.maxServiceOptions !== undefined
            ? parseInt(String(body.maxServiceOptions))
            : existingPlan.maxServiceOptions,
        maxBookingsPerMonth:
          body.maxBookingsPerMonth !== undefined
            ? parseInt(String(body.maxBookingsPerMonth))
            : existingPlan.maxBookingsPerMonth,
        maxBarberShops:
          body.maxBarberShops !== undefined
            ? parseInt(String(body.maxBarberShops))
            : existingPlan.maxBarberShops,
        maxStorageMB:
          body.maxStorageMB !== undefined
            ? parseInt(String(body.maxStorageMB))
            : existingPlan.maxStorageMB,
        trialDays:
          body.trialDays !== undefined
            ? parseInt(String(body.trialDays))
            : existingPlan.trialDays,
      },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação do Super Admin
    await requireSuperAdmin();

    const { id } = params;

    // Verificar se há tenants usando este plano
    const tenantsWithPlan = await prismaSuper.tenant.count({
      where: { planId: id },
    });

    if (tenantsWithPlan > 0) {
      return NextResponse.json(
        {
          error: `Não é possível deletar este plano. Existem ${tenantsWithPlan} tenant(s) usando-o.`,
        },
        { status: 400 }
      );
    }

    await prismaSuper.plan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar plano:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao deletar plano" },
      { status: 500 }
    );
  }
}
