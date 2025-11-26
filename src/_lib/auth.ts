/**
 * Sistema de Autenticação Customizado
 * Isolado por tenant - sem NextAuth
 */

import { NextRequest } from "next/server";
import { db as defaultDb } from "./prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

// Função para obter o subdomain do tenant (mantida para compatibilidade, mas sempre retorna null)
export function getTenantSubdomain(req: NextRequest): string | null {
  return null;
}

// Função para obter o banco de dados (sempre retorna o banco padrão)
export async function getTenantDatabase(req: NextRequest) {
  return defaultDb;
}

// Função para criar token JWT
export async function createSessionToken(userId: string, email: string, role: number, tenantSubdomain?: string | null) {
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
  const token = req.cookies.get("auth-token")?.value;
  
  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    tenantSubdomain: null,
  };
}

// Função para criar cookie de sessão
export function createSessionCookie(token: string, tenantSubdomain?: string | null) {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  };
}

// Função para deletar cookie de sessão
export function deleteSessionCookie(tenantSubdomain?: string | null) {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}

