import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/_lib/auth";
import { requireAdminOnly } from "@/_lib/admin-auth";
import { db } from "@/_lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRÍTICO: Verificar autenticação
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // CRÍTICO: Verificar permissão
    try {
      await requireAdminOnly(session, request);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Acesso negado. Apenas administradores têm acesso.",
        },
        { status: 403 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [ADMIN-NOTIFICATION-TEMPLATES-ID-GET] Buscando template no tenant: ${hostname}`);

    const { id } = await params;

    const template = await db.notificationTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { notifications: true },
        },
      },
    });

    if (!template) {
      console.error(`❌ [ADMIN-NOTIFICATION-TEMPLATES-ID-GET] Template ${id} não encontrado no tenant: ${hostname}`);
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 }
      );
    }

    console.log(`✅ [ADMIN-NOTIFICATION-TEMPLATES-ID-GET] Template encontrado no tenant: ${hostname}`, template.id);

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching notification template:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
          message: error instanceof Error ? error.message : "Unauthorized",
        },
        { status: 403 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [ADMIN-NOTIFICATION-TEMPLATES-ID-PUT] Atualizando template no tenant: ${hostname}`);

    const { id } = await params;
    
    // Verificar se o template existe no tenant antes de atualizar
    const existingTemplate = await db.notificationTemplate.findUnique({
      where: { id }
    });

    if (!existingTemplate) {
      console.error(`❌ [ADMIN-NOTIFICATION-TEMPLATES-ID-PUT] Template ${id} não encontrado no tenant: ${hostname}`);
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const {
      name,
      type,
      category,
      subject,
      content,
      variables,
      logo,
      isActive,
      isDefault,
    } = data;

    // Se é default, remover o default de outros templates da mesma categoria
    if (isDefault) {
      await db.notificationTemplate.updateMany({
        where: {
          category,
          type,
          isDefault: true,
          id: { not: id },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const template = await db.notificationTemplate.update({
      where: { id },
      data: {
        name,
        type,
        category,
        subject,
        content,
        variables: variables ? JSON.stringify(variables) : undefined,
        logo,
        isActive,
        isDefault,
      },
    });

    console.log(`✅ [ADMIN-NOTIFICATION-TEMPLATES-ID-PUT] Template atualizado com sucesso no tenant: ${hostname}`, template.id);

    return NextResponse.json(template);
  } catch (error) {
    console.error("❌ [ADMIN-NOTIFICATION-TEMPLATES-ID-PUT] Error updating notification template:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
          message: error instanceof Error ? error.message : "Unauthorized",
        },
        { status: 403 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [ADMIN-NOTIFICATION-TEMPLATES-ID-DELETE] Deletando template no tenant: ${hostname}`);

    const { id } = await params;

    // Verificar se o template existe no tenant antes de deletar
    const existingTemplate = await db.notificationTemplate.findUnique({
      where: { id }
    });

    if (!existingTemplate) {
      console.error(`❌ [ADMIN-NOTIFICATION-TEMPLATES-ID-DELETE] Template ${id} não encontrado no tenant: ${hostname}`);
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      );
    }

    await db.notificationTemplate.delete({
      where: { id },
    });

    console.log(`✅ [ADMIN-NOTIFICATION-TEMPLATES-ID-DELETE] Template deletado com sucesso no tenant: ${hostname}`, id);

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification template:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
