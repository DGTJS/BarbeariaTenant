/**
 * Cliente Prisma para o banco principal (Super Tenant)
 * Gerencia todos os tenants, assinaturas e planos
 */

import { PrismaClient } from "@/generated/prisma-super";

const globalForPrismaSuper = globalThis as unknown as {
  prismaSuper: PrismaClient | undefined;
};

let prismaSuperInstance: PrismaClient;

try {
  prismaSuperInstance =
    globalForPrismaSuper.prismaSuper ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL_SUPER || process.env.DATABASE_URL,
        },
      },
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrismaSuper.prismaSuper = prismaSuperInstance;
  }
} catch (error) {
  console.error("[prisma-super] Erro ao inicializar PrismaSuper:", error);
  // Criar uma instância vazia para evitar erros de runtime
  prismaSuperInstance = new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL_SUPER || process.env.DATABASE_URL || "",
      },
    },
  });
}

export const prismaSuper = prismaSuperInstance;
export default prismaSuper;
