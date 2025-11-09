import { NextRequest, NextResponse } from "next/server";
import { prismaSuper } from "@/_lib/prisma-super";
import { requireSuperAdmin } from "@/_lib/super-admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação do Super Admin
    await requireSuperAdmin();
    
    const { id } = params;
    const body = await request.json();
    const { isActive } = body;

    const tenant = await prismaSuper.tenant.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        isActive: tenant.isActive,
      },
    });
  } catch (error: any) {
    console.error("Erro ao atualizar tenant:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar tenant" },
      { status: 500 }
    );
  }
}

