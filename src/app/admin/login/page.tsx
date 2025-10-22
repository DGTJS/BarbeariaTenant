"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLogin from "@/_components/admin-login";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se já estiver logado, redirecionar para settings
    if (session) {
      router.push("/admin/settings");
    }
  }, [session, router]);

  // Mostrar loading enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
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
