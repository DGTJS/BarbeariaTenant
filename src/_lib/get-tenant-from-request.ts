/**
 * Função helper para obter dados do tenant a partir do request
 */

import { headers } from "next/headers";
import { getTenantDbBySubdomain, getTenantDbByCustomDomain } from "./tenant-db";
import { db as defaultDb } from "./prisma";
import { PrismaClient } from "@prisma/client";

export async function getTenantFromRequest() {
  const headersList = await headers();
  const hostname = headersList.get("host") || "";
  const tenantId = headersList.get("x-tenant-id");

  if (tenantId) {
    // Tenant já identificado pelo middleware
    return {
      tenantId,
      tenantName: headersList.get("x-tenant-name") || "",
      subdomain: headersList.get("x-tenant-subdomain") || "",
    };
  }

  // Se não foi identificado, tentar identificar agora
  try {
    const parts = hostname.split(".");
    let tenantData = null;

    if (parts.length === 2) {
      // Domínio customizado
      tenantData = await getTenantDbByCustomDomain(hostname);
    } else if (parts.length > 2) {
      // Subdomínio
      const subdomain = parts[0];
      tenantData = await getTenantDbBySubdomain(subdomain);
    }

    if (tenantData) {
      return {
        tenantId: tenantData.tenant.id,
        tenantName: tenantData.tenant.name,
        subdomain: tenantData.tenant.subdomain,
        tenant: tenantData.tenant,
        db: tenantData.db,
      };
    }
  } catch (error) {
    console.error("Erro ao obter tenant do request:", error);
  }

  return null;
}

/**
 * Função helper para obter o banco de dados do tenant em Server Components
 * Usa headers() para detectar o tenant e retorna o banco correto
 */
export async function getTenantDbForServerComponent(): Promise<PrismaClient> {
  try {
    const headersList = await headers();
    const hostname = headersList.get("host") || headersList.get("x-forwarded-host") || "";
    
    if (!hostname) {
      console.warn("[getTenantDbForServerComponent] Hostname não encontrado, usando banco padrão");
      return defaultDb;
    }

    // Detectar subdomain
    const hostnameWithoutPort = hostname.split(":")[0];
    const parts = hostnameWithoutPort.split(".");

    let subdomain: string | null = null;

    // Em desenvolvimento: subdomain.localhost
    if (hostnameWithoutPort.includes("localhost") || hostnameWithoutPort.includes("127.0.0.1")) {
      if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "127.0.0.1") {
        subdomain = parts[0];
      }
    } else if (parts.length > 2) {
      // Em produção: subdomain.dominio.com
      subdomain = parts[0];
      if (subdomain === "www" || subdomain === "app") {
        subdomain = null;
      }
    }

    // Se não há subdomain, usar banco padrão
    if (!subdomain) {
      return defaultDb;
    }

    // Obter banco do tenant
    try {
      const { db } = await getTenantDbBySubdomain(subdomain);
      console.log(`✅ [getTenantDbForServerComponent] Usando banco do tenant: ${subdomain}`);
      return db;
    } catch (error) {
      console.warn(`⚠️ [getTenantDbForServerComponent] Erro ao obter banco do tenant (${subdomain}), usando banco padrão:`, error);
      return defaultDb;
    }
  } catch (error) {
    console.error("[getTenantDbForServerComponent] Erro:", error);
    return defaultDb;
  }
}
