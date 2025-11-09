/**
 * Gerenciador de conexões de banco de dados por tenant
 * Cada tenant tem seu próprio banco de dados isolado
 */

import { PrismaClient } from "@prisma/client";
import { prismaSuper } from "./prisma-super";

// Cache global de conexões Prisma por tenant (compartilhado entre requisições)
// IMPORTANTE: Em produção, Next.js pode criar múltiplas instâncias, então precisamos
// garantir que o cache seja compartilhado globalmente
const globalForTenantDb = globalThis as unknown as {
  tenantDbClients: Map<string, PrismaClient> | undefined;
};

// Usar cache global para reutilizar conexões (tanto em dev quanto em produção)
// Em produção, isso pode não funcionar perfeitamente se houver múltiplas instâncias,
// mas ajuda a reduzir o número de conexões
const tenantDbClients = globalForTenantDb.tenantDbClients ?? new Map<string, PrismaClient>();

// Sempre definir no global para reutilizar em todas as requisições
globalForTenantDb.tenantDbClients = tenantDbClients;

/**
 * Obtém o cliente Prisma para um tenant específico
 * Cria conexão dinâmica baseada na URL do banco do tenant
 */
export async function getTenantDb(tenantId: string): Promise<PrismaClient> {
  // Verificar cache
  if (tenantDbClients.has(tenantId)) {
    return tenantDbClients.get(tenantId)!;
  }

  // Verificar se prismaSuper está inicializado
  if (!prismaSuper) {
    console.error(
      "[getTenantDb] prismaSuper não está inicializado corretamente"
    );
    throw new Error(
      "PrismaSuper não está inicializado. Verifique a conexão com o banco de dados."
    );
  }

  // Buscar dados do tenant no banco principal
  // O modelo no schema é "Tenant" mas usa @@map("tenants")
  const tenant = await prismaSuper.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      databaseUrl: true,
      databaseName: true,
      status: true,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} não encontrado`);
  }

  // Verificar se tenant está ativo (removido para permitir acesso mesmo em trial)
  // A verificação de status será feita na aplicação se necessário

  // Criar nova conexão Prisma para o tenant com limite de conexões
  // IMPORTANTE: Adicionar connection_limit à URL para evitar "Too many connections"
  // Usar connection_limit=3 para permitir algumas conexões simultâneas por tenant
  let databaseUrlWithLimit = tenant.databaseUrl;
  
  if (!databaseUrlWithLimit.includes("connection_limit")) {
    const separator = databaseUrlWithLimit.includes("?") ? "&" : "?";
    databaseUrlWithLimit = `${databaseUrlWithLimit}${separator}connection_limit=3`;
  }

  const tenantPrisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrlWithLimit,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // Armazenar no cache
  tenantDbClients.set(tenantId, tenantPrisma);

  if (process.env.NODE_ENV === "development") {
    console.log(`✅ [getTenantDb] Cliente Prisma criado para tenant ${tenantId} (${tenant.databaseName})`);
    console.log(`📊 [getTenantDb] Total de conexões em cache: ${tenantDbClients.size}`);
  }

  return tenantPrisma;
}

/**
 * Obtém o cliente Prisma para um tenant por subdomínio
 */
export async function getTenantDbBySubdomain(
  subdomain: string
): Promise<{ tenant: any; db: PrismaClient }> {
  // Normalizar subdomínio (lowercase, trim)
  const normalizedSubdomain = subdomain.toLowerCase().trim();

  // Verificar se prismaSuper está inicializado
  if (!prismaSuper) {
    console.error("[getTenantDbBySubdomain] prismaSuper não está inicializado");
    throw new Error("PrismaSuper não está disponível");
  }

  // O modelo no schema é "Tenant" mas usa @@map("tenants")
  // O cliente Prisma gera o nome como "tenant" (singular)
  const tenant = await prismaSuper.tenant.findUnique({
    where: { subdomain: normalizedSubdomain },
    select: {
      id: true,
      databaseUrl: true,
      databaseName: true,
      status: true,
      isActive: true,
      name: true,
      subdomain: true,
      customDomain: true,
      planId: true,
      plan: {
        include: {
          subscriptions: {
            where: { isActive: true },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!tenant) {
    throw new Error(
      `Tenant com subdomain "${normalizedSubdomain}" não encontrado`
    );
  }

  // Verificar se tenant está ativo
  if (!tenant.isActive) {
    throw new Error(`Tenant "${tenant.name}" está inativo`);
  }

  const db = await getTenantDb(tenant.id);

  return { tenant, db };
}

/**
 * Obtém o cliente Prisma para um tenant por domínio customizado
 */
export async function getTenantDbByCustomDomain(
  domain: string
): Promise<{ tenant: any; db: PrismaClient }> {
  // O modelo no schema é "Tenant" mas usa @@map("tenants")
  const tenant = await prismaSuper.tenant.findUnique({
    where: { customDomain: domain },
    select: {
      id: true,
      databaseUrl: true,
      databaseName: true,
      status: true,
      name: true,
      subdomain: true,
      customDomain: true,
      planId: true,
      plan: {
        include: {
          subscriptions: {
            where: { isActive: true },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!tenant) {
    throw new Error(`Tenant com domínio ${domain} não encontrado`);
  }

  const db = await getTenantDb(tenant.id);

  return { tenant, db };
}

/**
 * Fecha todas as conexões de tenant
 */
export async function closeAllTenantConnections() {
  for (const [tenantId, client] of tenantDbClients.entries()) {
    await client.$disconnect();
    tenantDbClients.delete(tenantId);
  }
}

/**
 * Limpa o cache de conexões de um tenant específico
 */
export function clearTenantCache(tenantId: string) {
  const client = tenantDbClients.get(tenantId);
  if (client) {
    client.$disconnect();
    tenantDbClients.delete(tenantId);
  }
}
