/**
 * Sistema de Autenticação Customizado
 * Isolado por tenant - sem NextAuth
 */

import { NextRequest } from "next/server";
import { getTenantDbBySubdomain } from "./tenant-db";
import { db as defaultDb } from "./prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

// Função para obter o subdomain do tenant
export function getTenantSubdomain(req: NextRequest): string | null {
  let hostname =
    req.headers.get("host") || req.headers.get("x-forwarded-host") || "";

  if (!hostname) {
    try {
      const url = new URL(req.url);
      hostname = url.hostname;
      if (url.port) {
        hostname = `${hostname}:${url.port}`;
      }
    } catch (e) {
      return null;
    }
  }

  if (!hostname) {
    return null;
  }

  try {
    // Remover porta se presente
    const hostnameWithoutPort = hostname.split(":")[0];
    const parts = hostnameWithoutPort.split(".");

    // Em desenvolvimento: subdomain.localhost ou subdomain.127.0.0.1
    if (hostnameWithoutPort.includes("localhost") || hostnameWithoutPort.includes("127.0.0.1")) {
      if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "127.0.0.1") {
        return parts[0];
      }
    } else if (parts.length > 2) {
      // Em produção: subdomain.dominio.com
      return parts[0];
    }

    return null;
  } catch (e) {
    return null;
  }
}

// Função para obter o banco de dados do tenant
export async function getTenantDatabase(req: NextRequest) {
  const subdomain = getTenantSubdomain(req);

  if (!subdomain) {
    return defaultDb;
  }

  try {
    const tenantData = await getTenantDbBySubdomain(subdomain);
    return tenantData.db;
  } catch (error) {
    console.log("[Auth] Usando banco padrão:", error);
    return defaultDb;
  }
}

// Função para criar token JWT
export async function createSessionToken(userId: string, email: string, role: number, tenantSubdomain: string | null) {
  const secret = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback-secret-change-in-production"
  );

  const token = await new SignJWT({
    userId,
    email,
    role,
    tenantSubdomain: tenantSubdomain || null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  return token;
}

// Função para verificar token JWT
export async function verifySessionToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback-secret-change-in-production"
    );

    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, secret);

    return payload as {
      userId: string;
      email: string;
      role: number;
      tenantSubdomain: string | null;
    };
  } catch (error) {
    return null;
  }
}

// Função para obter sessão do request
export async function getSession(req: NextRequest) {
  const tenantSubdomain = getTenantSubdomain(req);
  const cookieSuffix = tenantSubdomain ? `.${tenantSubdomain}` : "";
  const cookieName = `auth-token${cookieSuffix}`;

  // CRÍTICO: Em um tenant específico, NUNCA aceitar cookie sem sufixo
  // Em tenant padrão, NUNCA aceitar cookie com sufixo
  if (tenantSubdomain) {
    // Estamos em um tenant específico - buscar APENAS cookie com sufixo
    const token = req.cookies.get(cookieName)?.value;
    
    if (!token) {
      // Verificar se há cookie sem sufixo (não deveria ser usado aqui)
      const defaultCookie = req.cookies.get("auth-token");
      if (defaultCookie) {
        console.warn(`[Auth] ⚠️ Cookie sem sufixo encontrado em tenant específico (${tenantSubdomain}). Ignorando por segurança.`);
      }
      return null;
    }

    const payload = await verifySessionToken(token);

    if (!payload) {
      return null;
    }

    // CRÍTICO: Validar que o token pertence ao tenant atual
    if (payload.tenantSubdomain !== tenantSubdomain) {
      console.warn(`[Auth] ❌ Token de tenant diferente. Token: ${payload.tenantSubdomain}, Atual: ${tenantSubdomain}`);
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      tenantSubdomain: payload.tenantSubdomain,
    };
  } else {
    // Estamos no tenant padrão - buscar APENAS cookie sem sufixo
    const token = req.cookies.get("auth-token")?.value;
    
    if (!token) {
      return null;
    }

    // Verificar se há cookies com sufixo (não deveriam ser usados no tenant padrão)
    const allCookies = req.cookies.getAll();
    const tenantCookies = allCookies.filter(c => c.name.startsWith("auth-token."));
    if (tenantCookies.length > 0) {
      console.warn(`[Auth] ⚠️ Cookies de tenants específicos encontrados no tenant padrão. Ignorando por segurança.`);
    }

    const payload = await verifySessionToken(token);

    if (!payload) {
      return null;
    }

    // CRÍTICO: Validar que o token não tem tenant específico
    if (payload.tenantSubdomain) {
      console.warn(`[Auth] ❌ Token de tenant específico (${payload.tenantSubdomain}) usado no tenant padrão`);
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      tenantSubdomain: null,
    };
  }
}

// Função para criar cookie de sessão
export function createSessionCookie(token: string, tenantSubdomain: string | null) {
  const cookieSuffix = tenantSubdomain ? `.${tenantSubdomain}` : "";
  const cookieName = `auth-token${cookieSuffix}`;
  const isProduction = process.env.NODE_ENV === "production";

  return {
    name: cookieName,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    // NÃO definir domain - cookies devem ser específicos do subdomain
  };
}

// Função para deletar cookie de sessão
export function deleteSessionCookie(tenantSubdomain: string | null) {
  const cookieSuffix = tenantSubdomain ? `.${tenantSubdomain}` : "";
  const cookieName = `auth-token${cookieSuffix}`;
  const isProduction = process.env.NODE_ENV === "production";

  return {
    name: cookieName,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}

