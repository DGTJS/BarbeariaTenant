import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Adicionar pathname aos headers para o layout admin
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  
  // Se estiver tentando acessar rotas admin
  if (pathname.startsWith("/admin")) {
    // Permitir acesso à página de login
    if (pathname === "/admin/login") {
      return response;
    }
    
    // Para outras rotas admin, verificar se tem token de sessão
    const token = request.cookies.get("next-auth.session-token") || 
                  request.cookies.get("__Secure-next-auth.session-token");
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
