import { NextRequest, NextResponse } from "next/server";
;
import { requireAdminOnly } from "@/_lib/admin-auth";
import bcrypt from "bcryptjs";
import { db } from "@/_lib/prisma";

/**
 * PATCH /api/admin/barbers/[id]/permissions
 * Atualiza permissões e credenciais de login do barbeiro
 * Apenas admins podem acessar
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRÍTICO: Verificar permissão usando sistema customizado
    try {
      await requireAdminOnly(null, request);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Acesso negado. Apenas administradores podem gerenciar permissões.",
        },
        { status: 403 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    console.log("🔍 [ADMIN-BARBERS-PERMISSIONS-PATCH] Atualizando permissões no banco do tenant...");

    const { id } = await params;
    const body = await request.json();

    const { email, password, hasAdminAccess } = body;

    // Buscar barbeiro no banco do tenant
    const barber = await db.barber.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!barber) {
      return NextResponse.json(
        { error: "Barbeiro não encontrado" },
        { status: 404 }
      );
    }

    // Preparar dados de atualização
    const updateData: {
      email?: string;
      password?: string;
      hasAdminAccess?: boolean;
    } = {};

    // Atualizar email se fornecido
    if (email !== undefined) {
      updateData.email = email || null;
    }

    // Atualizar senha se fornecido (hash da senha)
    if (password !== undefined && password !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Atualizar permissões de admin
    if (hasAdminAccess !== undefined) {
      updateData.hasAdminAccess = hasAdminAccess;
    }

    // Atualizar barbeiro
    const updatedBarber = await db.barber.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      barber: {
        id: updatedBarber.id,
        email: updatedBarber.email,
        hasAdminAccess: updatedBarber.hasAdminAccess,
        user: updatedBarber.user,
      },
    });
  } catch (error: any) {
    console.error("❌ [ADMIN-BARBERS-PERMISSIONS-PATCH] Erro ao atualizar permissões:", error);
    console.error("❌ [ADMIN-BARBERS-PERMISSIONS-PATCH] Mensagem:", error?.message || String(error));
    
    return NextResponse.json(
      {
        error: error?.message || "Erro ao atualizar permissões",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/barbers/[id]/permissions
 * Retorna as permissões e informações de login do barbeiro
 * Apenas admins podem acessar
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRÍTICO: Verificar permissão usando sistema customizado
    try {
      await requireAdminOnly(null, request);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Acesso negado. Apenas administradores podem ver permissões.",
        },
        { status: 403 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    console.log("🔍 [ADMIN-BARBERS-PERMISSIONS-GET] Buscando permissões no banco do tenant...");

    const { id } = await params;

    const barber = await db.barber.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        hasAdminAccess: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!barber) {
      return NextResponse.json(
        { error: "Barbeiro não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: barber.id,
      email: barber.email,
      hasAdminAccess: barber.hasAdminAccess,
      hasPassword: !!barber.email, // Se tem email, pode ter senha configurada
      user: barber.user,
    });
  } catch (error: any) {
    console.error("❌ [ADMIN-BARBERS-PERMISSIONS-GET] Erro ao buscar permissões:", error);
    console.error("❌ [ADMIN-BARBERS-PERMISSIONS-GET] Mensagem:", error?.message || String(error));
    
    return NextResponse.json(
      {
        error: error?.message || "Erro ao buscar permissões",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
