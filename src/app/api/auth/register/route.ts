/**
 * Rota de Registro Customizado
 * Registro com email, senha, nome, WhatsApp e telefone
 */

import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, createSessionCookie } from "@/_lib/auth";
import { db } from "@/_lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, whatsappNumber } = body;

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // Validar WhatsApp (obrigatório no cadastro)
    if (!whatsappNumber || !whatsappNumber.trim()) {
      return NextResponse.json(
        { error: "WhatsApp é obrigatório" },
        { status: 400 }
      );
    }

    console.log("[Auth Register] ========== TENTATIVA DE REGISTRO ==========");
    console.log("[Auth Register] Email:", email);

    // Verificar se usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      console.log("[Auth Register] ❌ Email já cadastrado");
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name?.trim() || null,
        whatsappNumber: whatsappNumber?.trim() || null,
        phone: null, // Não usar mais telefone, apenas WhatsApp
        role: 3, // Cliente padrão
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        whatsappNumber: true,
      },
    });

    // Criar token de sessão
    const token = await createSessionToken(
      user.id,
      user.email,
      user.role,
      null
    );

    // Criar cookie
    const cookie = createSessionCookie(token, null);

    console.log("[Auth Register] ✅ Registro bem-sucedido");
    console.log("[Auth Register] User ID:", user.id);
    console.log("[Auth Register] Cookie name:", cookie.name);

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
      tenant: "default",
    });

    // Definir cookie
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });

    return response;
  } catch (error: any) {
    console.error("[Auth Register] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
