/**
 * Utilitários de Autenticação e Autorização para Área Admin
 *
 * CRÍTICO: Esta função verifica se o usuário tem permissão para acessar a área administrativa.
 * NUNCA remova esta verificação ou assuma que apenas verificar sessão é suficiente.
 *
 * @module admin-auth
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";
import { db } from "./prisma";
import { getTenantDatabase, getSession } from "./auth";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";

// Tipo para sessão customizada
export interface CustomSession {
  userId: string;
  email: string;
  role: number;
  tenantSubdomain?: string | null;
}

export interface AdminAuthResult {
  isAdmin: boolean;
  isBarbeiro: boolean;
  userId: string;
  role: number; // 1=Admin, 2=Barbeiro, 3=Cliente
  hasAdminAccess?: boolean; // Para barbeiros com permissões de admin
}

/**
 * Verifica se o usuário atual tem permissão de admin ou barbeiro
 *
 * @param session - Sessão do NextAuth (opcional, busca automaticamente se não fornecido)
 * @returns Objeto com informações de autorização
 * @throws Error se usuário não estiver autenticado ou não tiver permissão
 *
 * @example
 * ```typescript
 * try {
 *   const auth = await requireAdmin();
 *   // Usuário tem permissão, continuar...
 * } catch (error) {
 *   // Retornar 403 ou redirecionar
 * }
 * ```
 */
export async function requireAdmin(
  session?: CustomSession | null,
  req?: NextRequest | null
): Promise<AdminAuthResult> {
  console.log("🔐 [ADMIN-AUTH] Verificando permissões de admin...");
  
  // Buscar sessão se não fornecida
  let currentSession = session;
  
  if (!currentSession && req) {
    console.log("🔐 [ADMIN-AUTH] Buscando sessão do request...");
    currentSession = await getSession(req);
    console.log("🔐 [ADMIN-AUTH] Sessão encontrada:", currentSession ? "Sim" : "Não");
  }

  if (!currentSession?.userId) {
    console.error("❌ [ADMIN-AUTH] Sessão não encontrada ou sem userId");
    throw new Error("Não autorizado. Faça login para continuar.");
  }

  console.log("🔐 [ADMIN-AUTH] userId:", currentSession.userId);
  console.log("🔐 [ADMIN-AUTH] role da sessão:", currentSession.role);

  // Detectar tenant e usar banco correto
  let dbToUse = db;
  if (req) {
    try {
      console.log("🔐 [ADMIN-AUTH] Obtendo banco do tenant...");
      dbToUse = await getTenantDatabase(req);
      console.log("🔐 [ADMIN-AUTH] Banco do tenant obtido com sucesso");
    } catch (error) {
      console.error("❌ [ADMIN-AUTH] Erro ao obter banco do tenant:", error);
      // Continuar com banco padrão se houver erro
    }
  }

  // Buscar role do banco de dados (fonte de verdade)
  // NÃO confiar apenas na sessão, pois pode estar desatualizada
  console.log("🔐 [ADMIN-AUTH] Buscando usuário no banco:", currentSession.userId);
  
  const dbUser = await dbToUse.user.findUnique({
    where: { id: currentSession.userId },
    select: {
      role: true,
      email: true,
      name: true,
      barber: {
        select: {
          id: true,
          hasAdminAccess: true,
        },
      },
    },
  });

  console.log("🔐 [ADMIN-AUTH] Usuário encontrado no banco:", dbUser ? "Sim" : "Não");
  
  if (!dbUser) {
    console.error("❌ [ADMIN-AUTH] Usuário não encontrado no banco. userId:", currentSession.userId);
    throw new Error("Usuário não encontrado no banco de dados.");
  }
  
  console.log("🔐 [ADMIN-AUTH] dbUser.role:", dbUser.role);
  console.log("🔐 [ADMIN-AUTH] dbUser.email:", dbUser.email);

  // Converter role para número se for string (retrocompatibilidade)
  let roleNumber: number;
  if (typeof dbUser.role === "string") {
    const roleStr = (dbUser.role || "").toLowerCase().trim();
    if (roleStr === "admin" || roleStr === "administrador") {
      roleNumber = 1;
    } else if (roleStr === "barbeiro" || roleStr === "barber") {
      roleNumber = 2;
    } else {
      roleNumber = 3;
    }
  } else {
    roleNumber = dbUser.role || 3;
  }

  // Verificar se é admin (role = 1)
  const isAdmin = roleNumber === 1;
  
  console.log("🔐 [ADMIN-AUTH] isAdmin:", isAdmin);
  console.log("🔐 [ADMIN-AUTH] roleNumber:", roleNumber);

  // Verificar se é barbeiro (role = 2 ou tem registro na tabela barber)
  const isBarbeiro = roleNumber === 2 || !!dbUser.barber;
  
  console.log("🔐 [ADMIN-AUTH] isBarbeiro:", isBarbeiro);
  console.log("🔐 [ADMIN-AUTH] dbUser.barber:", !!dbUser.barber);

  // Verificar se barbeiro tem permissões de admin
  const hasAdminAccess =
    isAdmin || (isBarbeiro && dbUser.barber?.hasAdminAccess === true);

  // Log para auditoria (apenas em desenvolvimento ou com flag de debug)
  if (process.env.NODE_ENV === "development") {
    console.log("🔐 [ADMIN-AUTH] Verificação de acesso:", {
      userId: currentSession.userId,
      role: roleNumber,
      hasBarberRecord: !!dbUser.barber,
      hasAdminAccess: dbUser.barber?.hasAdminAccess,
      isAdmin,
      isBarbeiro,
      finalAccess: hasAdminAccess || isBarbeiro,
    });
  }

  // Verificar permissão
  // Permite: Admins (role=1) ou Barbeiros (role=2 ou tem registro barber)
  if (!isAdmin && !isBarbeiro) {
    console.warn("⚠️ [ADMIN-AUTH] Tentativa de acesso não autorizada:", {
      userId: currentSession.userId,
      role: roleNumber,
      timestamp: new Date().toISOString(),
    });

    throw new Error(
      "Acesso negado. Apenas administradores e barbeiros têm acesso à área administrativa."
    );
  }

  return {
    isAdmin,
    isBarbeiro,
    userId: currentSession.userId,
    role: roleNumber,
    hasAdminAccess,
  };
}

/**
 * Verifica apenas se o usuário está autenticado (sem verificar role)
 * Útil para rotas que requerem apenas autenticação
 *
 * @param session - Sessão customizada (opcional)
 * @param req - Request do Next.js (opcional, usado se session não fornecida)
 * @returns ID do usuário
 * @throws Error se usuário não estiver autenticado
 */
export async function requireAuth(
  session?: CustomSession | null,
  req?: NextRequest | null
): Promise<string> {
  let currentSession = session;
  
  if (!currentSession && req) {
    currentSession = await getSession(req);
  }

  if (!currentSession?.userId) {
    throw new Error("Não autorizado. Faça login para continuar.");
  }

  return currentSession.userId;
}

/**
 * Verifica se o usuário atual é admin (sem permitir barbeiros)
 * Útil para funcionalidades que requerem apenas permissão de admin
 *
 * @param session - Sessão customizada (opcional)
 * @param req - Request do Next.js (opcional, usado se session não fornecida)
 * @returns Objeto com informações de autorização
 * @throws Error se usuário não for admin
 */
export async function requireAdminOnly(
  session?: CustomSession | null,
  req?: NextRequest | null
): Promise<AdminAuthResult> {
  const auth = await requireAdmin(session, req);

  // Verificar se é admin (role=1) OU barbeiro com hasAdminAccess
  if (!auth.isAdmin && !auth.hasAdminAccess) {
    throw new Error(
      "Acesso negado. Apenas administradores têm acesso a esta funcionalidade."
    );
  }

  return auth;
}
