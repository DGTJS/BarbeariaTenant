import { Metadata } from "next";
import { AdminSidebar } from "@/_components/admin-sidebar";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";

export const metadata: Metadata = {
  title: "Dashboard Admin - Barbearia",
  description: "Painel administrativo da barbearia",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const session = await getServerSession(authOptions);
  
  // Se for a página de login E não estiver logado, não mostrar sidebar e header
  if (pathname === "/admin/login" && !session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Header da área admin */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Gerenciamento da Barbearia
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
