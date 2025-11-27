/**
 * Rota de Sessão Customizada
 * Retorna informações da sessão atual
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/_lib/auth";
import { db } from "@/_lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Verificar se há cookie de autenticação antes de buscar sessão
    const allCookies = req.cookies.getAll();
    const authCookies = allCookies.filter(c => c.name.startsWith("auth-token"));
    
    if (authCookies.length === 0) {
      console.log("[Auth Session] ❌ Nenhum cookie de autenticação encontrado");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    console.log("[Auth Session] ✅ Cookies de auth encontrados:", authCookies.map(c => c.name));
    
    const session = await getSession(req);

    if (!session) {
      console.log("[Auth Session] ❌ Sessão não encontrada ou inválida após verificação de cookie");
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    console.log("[Auth Session] ✅ Sessão válida encontrada para userId:", session.userId);

    // Buscar dados completos do usuário
    // Usando banco único
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        whatsappNumber: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        whatsappNumber: user.whatsappNumber,
        image: user.image,
      },
    });
  } catch (error: any) {
    console.error("[Auth Session] Erro:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

