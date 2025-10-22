// lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Garantir que a conexão seja fechada adequadamente
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Função para fechar conexões adequadamente
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export const db = prisma;
