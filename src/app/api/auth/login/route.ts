/**
 * Rota de Login Customizado
 * Login com email, senha e WhatsApp
 */

import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase, getTenantSubdomain, createSessionToken, createSessionCookie } from "@/_lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Obter banco do tenant
    const tenantSubdomain = getTenantSubdomain(req);
    const db = await getTenantDatabase(req);

    console.log("[Auth Login] ========== TENTATIVA DE LOGIN ==========");
    console.log("[Auth Login] Email:", email);
    console.log("[Auth Login] Tenant:", tenantSubdomain || "padrão");
    console.log("[Auth Login] Usando banco:", tenantSubdomain ? `tenant (${tenantSubdomain})` : "padrão");

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        phone: true,
        whatsappNumber: true,
      },
    });

    if (!user) {
      console.log("[Auth Login] ❌ Usuário não encontrado");
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    if (!user.password) {
      console.log("[Auth Login] ❌ Usuário não tem senha cadastrada");
      return NextResponse.json(
        { error: "Usuário não tem senha cadastrada. Use outro método de login." },
        { status: 401 }
      );
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("[Auth Login] ❌ Senha incorreta");
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Criar token de sessão
    const token = await createSessionToken(
      user.id,
      user.email,
      user.role,
      tenantSubdomain
    );

    // Criar cookie
    const cookie = createSessionCookie(token, tenantSubdomain);

    console.log("[Auth Login] ✅ Login bem-sucedido");
    console.log("[Auth Login] User ID:", user.id);
    console.log("[Auth Login] Cookie name:", cookie.name);
    console.log("[Auth Login] Tenant subdomain:", tenantSubdomain || "padrão");
    console.log("[Auth Login] Cookie config:", {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });

    // Criar resposta
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        whatsappNumber: user.whatsappNumber,
      },
      tenant: tenantSubdomain || "default",
    });

    // Definir cookie
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });

    // Verificar se o cookie foi realmente definido
    const cookieValue = response.cookies.get(cookie.name);
    console.log("[Auth Login] ✅ Cookie definido na resposta:", !!cookieValue);
    console.log("[Auth Login] ✅ Cookie value length:", cookieValue?.value?.length || 0);

    return response;
  } catch (error: any) {
    console.error("[Auth Login] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

