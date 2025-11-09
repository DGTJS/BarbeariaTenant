import { NextRequest, NextResponse } from "next/server";
import { getTenantDbBySubdomain } from "@/_lib/tenant-db";

/**
 * Rota de teste simples para login
 * Testa apenas nome e email, sem NextAuth
 */
export async function POST(req: NextRequest) {
  try {
    console.log("[TEST LOGIN] ========== INICIANDO TESTE ==========");

    // Obter subdomain do hostname
    const hostname = req.headers.get("host") || "";
    const subdomain = hostname.split(".")[0];

    console.log("[TEST LOGIN] Hostname:", hostname);
    console.log("[TEST LOGIN] Subdomain:", subdomain);

    // Obter banco do tenant
    let db;
    let tenantName = "default";

    if (subdomain && subdomain !== "localhost" && subdomain !== "127.0.0.1") {
      try {
        const { tenant, db: tenantDb } =
          await getTenantDbBySubdomain(subdomain);
        db = tenantDb;
        tenantName = tenant.name;
        console.log("[TEST LOGIN] Usando banco do tenant:", tenantName);
      } catch (error: any) {
        console.error("[TEST LOGIN] Erro ao obter tenant:", error.message);
        return NextResponse.json(
          { error: "Tenant não encontrado", message: error.message },
          { status: 404 }
        );
      }
    } else {
      const { db: defaultDb } = await import("@/_lib/prisma");
      db = defaultDb;
      console.log("[TEST LOGIN] Usando banco default");
    }

    // Parse do body
    const body = await req.json();
    console.log("[TEST LOGIN] Body recebido:", JSON.stringify(body, null, 2));

    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    console.log("[TEST LOGIN] Buscando usuário:", email);

    // Buscar usuário
    let user = await db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { barber: true },
    });

    console.log("[TEST LOGIN] Usuário encontrado:", user ? "SIM" : "NÃO");

    // Se não encontrou, criar
    if (!user) {
      console.log("[TEST LOGIN] Criando novo usuário...");
      const isAdminEmail =
        email.includes("admin@") ||
        email === "admin@barbearia.com" ||
        email.endsWith("@admin.com");

      user = await db.user.create({
        data: {
          email: email.trim().toLowerCase(),
          name: name.trim() || "Usuário",
          role: isAdminEmail ? 1 : 3,
        },
        include: { barber: true },
      });

      console.log("[TEST LOGIN] ✅ Usuário criado:", user.id);
    }

    console.log("[TEST LOGIN] ✅✅✅ SUCESSO ✅✅✅");
    console.log("[TEST LOGIN] User ID:", user.id);
    console.log("[TEST LOGIN] User Email:", user.email);
    console.log("[TEST LOGIN] User Role:", user.role);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tenant: tenantName,
    });
  } catch (error: any) {
    console.error("[TEST LOGIN] ❌ ERRO:", error);
    console.error("[TEST LOGIN] Stack:", error?.stack);
    return NextResponse.json(
      {
        error: "Erro interno",
        message: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}


