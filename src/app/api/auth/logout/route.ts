/**
 * Rota de Logout Customizado
 * Remove a sessão do usuário
 */

import { NextRequest, NextResponse } from "next/server";
import { getTenantSubdomain, deleteSessionCookie } from "@/_lib/auth";

export async function POST(req: NextRequest) {
  try {
    const tenantSubdomain = getTenantSubdomain(req);

    console.log("[Auth Logout] ========== LOGOUT ==========");
    console.log("[Auth Logout] Tenant:", tenantSubdomain || "padrão");
    
    // Listar todos os cookies presentes na requisição
    const allCookies = req.cookies.getAll();
    console.log("[Auth Logout] Cookies presentes:", allCookies.map(c => c.name));

    // Criar resposta
    const response = NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso",
    });

    // Coletar todos os cookies de autenticação presentes na requisição
    const authCookieNames = allCookies
      .filter(c => 
        c.name.startsWith("auth-token") || 
        c.name.startsWith("next-auth") ||
        c.name === "__Secure-next-auth.session-token"
      )
      .map(c => c.name);
    
    // Lista completa de possíveis nomes de cookies de autenticação
    const allCookieNames = new Set<string>([
      ...authCookieNames, // Cookies encontrados na requisição
      "auth-token", // Cookie padrão do sistema customizado
      deleteSessionCookie(null).name, // Cookie padrão (método auxiliar)
      "next-auth.session-token", // Cookie padrão do NextAuth
      "__Secure-next-auth.session-token", // Cookie seguro do NextAuth
      "next-auth.csrf-token", // CSRF token do NextAuth
      "next-auth.callback-url", // Callback URL do NextAuth
    ]);

    // Adicionar cookies de outros tenants comuns para ambos os sistemas
    const possibleTenants = ["santos", "teste", "default"];
    for (const tenant of possibleTenants) {
      // Cookies do sistema customizado
      allCookieNames.add(deleteSessionCookie(tenant).name);
      // Cookies do NextAuth com tenant
      allCookieNames.add(`next-auth.session-token.${tenant}`);
      allCookieNames.add(`__Secure-next-auth.session-token.${tenant}`);
      allCookieNames.add(`next-auth.csrf-token.${tenant}`);
      allCookieNames.add(`next-auth.callback-url.${tenant}`);
      allCookieNames.add(`next-auth.state.${tenant}`);
    }

    console.log("[Auth Logout] Deletando cookies:", Array.from(allCookieNames));

    const isSecure = process.env.NODE_ENV === "production";
    const expiresDate = new Date(0);
    const expiresString = "Thu, 01 Jan 1970 00:00:00 GMT";

    // Deletar TODOS os cookies de autenticação usando múltiplos métodos
    for (const cookieName of allCookieNames) {
      // Método 1: Usar delete() do NextResponse
      response.cookies.delete(cookieName);
      
      // Método 2: Usar set() com expires no passado e maxAge 0
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: expiresDate,
      });

      // Método 3: Usar headers Set-Cookie diretamente (garantia máxima)
      // Versão sem Secure (para desenvolvimento)
      const deleteHeader = `${cookieName}=; Path=/; Expires=${expiresString}; HttpOnly; SameSite=Lax`;
      response.headers.append("Set-Cookie", deleteHeader);
      
      // Versão com Secure (para produção)
      if (isSecure) {
        const deleteSecureHeader = `${cookieName}=; Path=/; Expires=${expiresString}; HttpOnly; SameSite=Lax; Secure`;
        response.headers.append("Set-Cookie", deleteSecureHeader);
      }

      // Método 4: Tentar também com domain vazio (alguns navegadores requerem)
      const deleteHeaderNoDomain = `${cookieName}=; Path=/; Domain=; Expires=${expiresString}; HttpOnly; SameSite=Lax`;
      response.headers.append("Set-Cookie", deleteHeaderNoDomain);
    }

    console.log("[Auth Logout] ✅ Logout bem-sucedido");

    return response;
  } catch (error: any) {
    console.error("[Auth Logout] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
