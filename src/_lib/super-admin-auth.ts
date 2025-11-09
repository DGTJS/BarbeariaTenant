/**
 * Autenticação do Super Admin
 * Sistema separado e único para acesso ao painel de gerenciamento
 */

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "super-admin-secret";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "admin@barberboss.com";

export interface SuperAdminSession {
  email: string;
  type: "super_admin";
}

/**
 * Verifica se o usuário está autenticado como Super Admin
 */
export async function requireSuperAdmin(): Promise<SuperAdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get("superAdminToken")?.value;

  if (!token) {
    throw new Error("Não autorizado. Faça login como Super Admin.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SuperAdminSession;

    if (decoded.type !== "super_admin") {
      throw new Error("Token inválido");
    }

    return decoded;
  } catch (error) {
    throw new Error("Sessão expirada ou inválida. Faça login novamente.");
  }
}

/**
 * Verifica se o usuário está autenticado (opcional)
 */
export async function getSuperAdminSession(): Promise<SuperAdminSession | null> {
  try {
    return await requireSuperAdmin();
  } catch {
    return null;
  }
}

/**
 * Valida credenciais do Super Admin
 */
export async function validateSuperAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "admin123";

  return email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD;
}

/**
 * Gera token JWT para Super Admin
 */
export function generateSuperAdminToken(email: string): string {
  return jwt.sign(
    { email, type: "super_admin" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

