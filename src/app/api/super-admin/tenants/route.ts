import { NextRequest, NextResponse } from "next/server";
import { prismaSuper } from "@/_lib/prisma-super";
import { requireSuperAdmin } from "@/_lib/super-admin-auth";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação do Super Admin
    await requireSuperAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const tenants = await prismaSuper.tenant.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serializar datas e valores
    const serializedTenants = tenants.map(tenant => ({
      ...tenant,
      trialStartDate: tenant.trialStartDate?.toISOString(),
      trialEndDate: tenant.trialEndDate?.toISOString(),
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
      plan: tenant.plan
        ? {
            ...tenant.plan,
            price: Number(tenant.plan.price),
          }
        : null,
    }));

    return NextResponse.json(serializedTenants);
  } catch (error: any) {
    console.error("Erro ao buscar tenants:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar tenants" },
      { status: 500 }
    );
  }
}
