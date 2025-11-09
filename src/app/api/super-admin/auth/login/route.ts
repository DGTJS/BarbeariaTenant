import { NextRequest, NextResponse } from "next/server";
import { generateSuperAdminToken, validateSuperAdminCredentials } from "@/_lib/super-admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar credenciais
    const isValid = await validateSuperAdminCredentials(email, password);

    if (isValid) {
      // Gerar token JWT
      const token = generateSuperAdminToken(email);

      // Criar resposta com cookie
      const response = NextResponse.json({
        success: true,
        token,
        email,
        message: "Login realizado com sucesso",
      });

      // Definir cookie httpOnly
      response.cookies.set("superAdminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      return response;
    }

    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Erro ao processar login" },
      { status: 500 }
    );
  }
}

