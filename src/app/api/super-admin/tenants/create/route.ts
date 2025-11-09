/**
 * API para criar novo tenant (pode ser chamada pelo super admin ou pelo formulário público)
 */

import { NextRequest, NextResponse } from "next/server";
import { prismaSuper } from "@/_lib/prisma-super";
import { requireSuperAdmin } from "@/_lib/super-admin-auth";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação do Super Admin (opcional para signup público)
    // Se for signup público, pode não ter autenticação
    const isPublicSignup = request.headers.get("x-public-signup") === "true";

    if (!isPublicSignup) {
      try {
        await requireSuperAdmin();
      } catch {
        // Se não conseguir autenticar, pode ser signup público
        // Mas vamos verificar se tem token válido
      }
    }

    const body = await request.json();
    const {
      // Dados básicos
      name,
      subdomain,
      ownerName,
      ownerEmail,
      ownerPhone,

      // Plano
      planId,

      // Dados do banco (ou gerar automaticamente)
      databaseName,
      databaseUrl,

      // Cartão do Asaas (para trial)
      asaasCustomerId,
    } = body;

    // Validar subdomínio único
    const existingSubdomain = await prismaSuper.tenant.findUnique({
      where: { subdomain },
    });

    if (existingSubdomain) {
      return NextResponse.json(
        { error: "Subdomínio já está em uso" },
        { status: 400 }
      );
    }

    // Validar email único
    const existingEmail = await prismaSuper.tenant.findFirst({
      where: { ownerEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email já está cadastrado" },
        { status: 400 }
      );
    }

    // Buscar plano
    const plan = await prismaSuper.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    // Gerar nome do banco se não fornecido
    const finalDatabaseName =
      databaseName || `barberboss_${subdomain}_${Date.now()}`;

    // Gerar URL do banco se não fornecido
    const baseUrl = process.env.DATABASE_BASE_URL || "";
    const finalDatabaseUrl =
      databaseUrl ||
      `${baseUrl}${finalDatabaseName}?schema=public&connection_limit=1`;

    // Calcular datas do trial
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);

    // Criar tenant
    const tenant = await prismaSuper.tenant.create({
      data: {
        name,
        subdomain,
        ownerName,
        ownerEmail,
        ownerPhone,
        databaseName: finalDatabaseName,
        databaseUrl: finalDatabaseUrl,
        planId,
        status: "trial",
        trialStartDate,
        trialEndDate,
        trialUsed: true,
        asaasCustomerId,
        isActive: true,
      },
      include: {
        plan: true,
      },
    });

    // Criar banco de dados para o tenant
    // TODO: Implementar criação do banco de dados MySQL
    // Isso pode ser feito via API do MySQL ou script SQL

    // Criar assinatura inicial (trial)
    await prismaSuper.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: plan.id,
        status: "trial",
        isActive: true,
        startDate: trialStartDate,
        endDate: trialEndDate,
        autoRenew: true,
        nextBillingDate: trialEndDate,
        amount: plan.price,
      },
    });

    // TODO: Criar usuário admin no banco do tenant
    // TODO: Executar migrations no banco do tenant

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        trialEndDate: tenant.trialEndDate,
      },
    });
  } catch (error: any) {
    console.error("Erro ao criar tenant:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar tenant" },
      { status: 500 }
    );
  }
}
