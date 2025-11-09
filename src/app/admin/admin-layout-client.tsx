"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AdminSidebar } from "@/_components/admin-sidebar";
import { AdminMobileMenu } from "@/_components/admin-mobile-menu";
import AdminClientWrapper from "@/_components/admin-client-wrapper";
import { Loader2 } from "lucide-react";

export default function AdminLayoutClient({
  children,
  hasSession,
}: {
  children: React.ReactNode;
  hasSession: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [isChecking, setIsChecking] = useState(true);
  const redirectAttempted = useRef(false);

  // Se estamos na página de login, não fazer nenhuma verificação
  useEffect(() => {
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    // Se temos sessão do servidor, não precisa verificar novamente
    if (hasSession) {
      setIsChecking(false);
      return;
    }

    // Se não temos sessão e não estamos na página de login, redirecionar
    if (!hasSession && !redirectAttempted.current) {
      redirectAttempted.current = true;
      setIsChecking(false); // Parar de verificar antes de redirecionar
      router.replace("/admin/login");
    } else {
      setIsChecking(false);
    }
  }, [isLoginPage, hasSession, router]);

  // Se estiver na página de login, renderizar sem layout (mesmo sem sessão)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Se está verificando sessão, mostrar loading
  if (isChecking && !hasSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não há sessão e não está na página de login, mostrar loading (redirect em andamento)
  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  // Se há sessão, renderizar layout completo
  return (
    <AdminClientWrapper>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />

        {/* Main content area */}
        <div className="flex-1 lg:ml-64 min-h-screen">
          {/* Header da área admin */}
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Botão do menu mobile */}
                  <AdminMobileMenu />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    {new Date().toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo principal */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AdminClientWrapper>
  );
}
