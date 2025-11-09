/**
 * Middleware para verificar autenticação do Super Admin em rotas da API
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/_lib/super-admin-auth";

export async function verifySuperAdmin(request: NextRequest) {
  try {
    await requireSuperAdmin();
    return null; // Autenticado, continuar
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Não autorizado" },
      { status: 401 }
    );
  }
}

