/**
 * Função helper para obter dados do tenant a partir do request
 * Simplificado - sempre retorna null (sem multi-tenancy)
 */

import { headers } from "next/headers";
import { db as defaultDb } from "./prisma";
import { PrismaClient } from "@prisma/client";

export async function getTenantFromRequest() {
  return null;
}

/**
 * Função helper para obter o banco de dados em Server Components
 * Sempre retorna o banco padrão
 */
export async function getTenantDbForServerComponent(): Promise<PrismaClient> {
  return defaultDb;
}
