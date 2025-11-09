"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminLogin from "@/_components/admin-login";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Se já estiver logado, redirecionar para dashboard
    if (session) {
      window.location.href = "/admin";
    }
  }, [session]);

  // Mostrar loading enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-900 dark:text-white" />
          <p className="text-gray-600 dark:text-gray-400">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Se já estiver logado, não mostrar o formulário
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <AdminLogin />
    </div>
  );
}

