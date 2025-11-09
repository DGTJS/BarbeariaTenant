/**
 * Hook React para Autenticação Customizada
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: number;
  phone: string | null;
  whatsappNumber: string | null;
  image: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  // Carregar sessão
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.user) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      console.error("[useAuth] Erro ao carregar sessão:", error);
      setAuthState({
        user: null,
        loading: false,
        error: error.message || "Erro ao carregar sessão",
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // Recarregar sessão
      await loadSession();

      return { success: true, user: data.user };
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao fazer login";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    email: string,
    password: string,
    name?: string,
    whatsappNumber?: string
  ) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          name,
          whatsappNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      // Recarregar sessão
      await loadSession();

      return { success: true, user: data.user };
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao cadastrar";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (redirectTo?: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      // Deletar cookies manualmente no cliente também (garantia extra) - ambos os sistemas
      const possibleCookieNames = [
        // Sistema customizado
        "auth-token",
        "auth-token.santos",
        "auth-token.teste",
        "auth-token.default",
        // NextAuth
        "next-auth.session-token",
        "next-auth.session-token.santos",
        "next-auth.session-token.teste",
        "next-auth.session-token.default",
        "__Secure-next-auth.session-token",
        "__Secure-next-auth.session-token.santos",
        "next-auth.csrf-token",
        "next-auth.csrf-token.santos",
        "next-auth.csrf-token.teste",
        "next-auth.callback-url",
        "next-auth.callback-url.santos",
        "next-auth.callback-url.teste",
        "next-auth.state",
        "next-auth.state.santos",
      ];

      // Deletar todos os cookies possíveis
      possibleCookieNames.forEach((cookieName) => {
        document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
      });

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Limpar estado local imediatamente
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });

      // Redirecionar para o caminho especificado ou home
      const redirectPath = redirectTo || "/";
      
      // Forçar reload completo imediatamente para limpar qualquer estado residual
      window.location.href = redirectPath;
    } catch (error: any) {
      console.error("[useAuth] Erro ao fazer logout:", error);
      // Mesmo com erro, limpar estado local
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
      const redirectPath = redirectTo || "/";
      // Forçar reload completo
      window.location.href = redirectPath;
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    refresh: loadSession,
  };
}

