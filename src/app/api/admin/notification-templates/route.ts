import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "@/_lib/auth";
import { requireAdmin } from '@/_lib/admin-auth';
import { db } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Verificar autenticação
    const session = await getSession(request);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // CRÍTICO: Verificar permissão
    try {
      await requireAdmin(session, request);
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
    console.log(`🔍 [ADMIN-NOTIFICATION-TEMPLATES-GET] Buscando templates no tenant: ${hostname}`);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;

    const templates = await db.notificationTemplate.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ [ADMIN-NOTIFICATION-TEMPLATES-GET] ${templates.length} templates encontrados no tenant: ${hostname}`);

    return NextResponse.json(templates);
  } catch (error) {
    console.error('❌ [ADMIN-NOTIFICATION-TEMPLATES-GET] Error fetching notification templates:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // CRÍTICO: Verificar permissão usando sistema customizado
    try {
      await requireAdmin(null, request);
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
    console.log(`🔍 [ADMIN-NOTIFICATION-TEMPLATES-POST] Criando template no tenant: ${hostname}`);

    const data = await request.json();
    const { name, type, category, subject, content, variables, logo, isActive, isDefault } = data;

    // Validações
    if (!name || !type || !category || !content) {
      return NextResponse.json({ message: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Se é default, remover o default de outros templates da mesma categoria
    if (isDefault) {
      await db.notificationTemplate.updateMany({
        where: {
          category,
          type,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    const template = await db.notificationTemplate.create({
      data: {
        name,
        type,
        category,
        subject,
        content,
        variables: JSON.stringify(variables || []),
        logo,
        isActive: isActive ?? true,
        isDefault: isDefault ?? false
      }
    });

    console.log(`✅ [ADMIN-NOTIFICATION-TEMPLATES-POST] Template criado com sucesso no tenant: ${hostname}`, template.id);

    return NextResponse.json(template);
  } catch (error) {
    console.error('❌ [ADMIN-NOTIFICATION-TEMPLATES-POST] Error creating notification template:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

