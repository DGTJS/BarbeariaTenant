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

    const tenant = await prismaSuper.tenant.findUnique({
      where: { id },
      include: {
        plan: true,
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant não encontrado" },
        { status: 404 }
      );
    }

    // Serializar dados
    const serializedTenant = {
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
      subscriptions: tenant.subscriptions.map(sub => ({
        ...sub,
        startDate: sub.startDate.toISOString(),
        endDate: sub.endDate?.toISOString(),
        nextBillingDate: sub.nextBillingDate?.toISOString(),
        cancelledAt: sub.cancelledAt?.toISOString(),
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
        amount: sub.amount ? Number(sub.amount) : null,
      })),
    };

    return NextResponse.json(serializedTenant);
  } catch (error: any) {
    console.error("Erro ao buscar tenant:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar tenant" },
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

    // Verificar se o tenant existe
    const existingTenant = await prismaSuper.tenant.findUnique({
      where: { id },
    });

    if (!existingTenant) {
      return NextResponse.json(
        { error: "Tenant não encontrado" },
        { status: 404 }
      );
    }

    // Validar subdomínio único se estiver sendo alterado
    if (body.subdomain && body.subdomain !== existingTenant.subdomain) {
      const existingSubdomain = await prismaSuper.tenant.findUnique({
        where: { subdomain: body.subdomain },
      });

      if (existingSubdomain) {
        return NextResponse.json(
          { error: "Subdomínio já está em uso" },
          { status: 400 }
        );
      }
    }

    // Validar email único se estiver sendo alterado
    if (body.ownerEmail && body.ownerEmail !== existingTenant.ownerEmail) {
      const existingEmail = await prismaSuper.tenant.findFirst({
        where: {
          ownerEmail: body.ownerEmail,
          id: { not: id },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email já está cadastrado" },
          { status: 400 }
        );
      }
    }

    const tenant = await prismaSuper.tenant.update({
      where: { id },
      data: body,
      include: {
        plan: true,
      },
    });

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error("Erro ao atualizar tenant:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar tenant" },
      { status: 500 }
    );
  }
}
