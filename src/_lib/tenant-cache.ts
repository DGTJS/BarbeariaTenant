/**
 * Sistema de Cache Isolado por Tenant
 * Garante que cada tenant tenha seu próprio cache sem interferência
 */

// Função para obter a chave de cache baseada no tenant
export function getTenantCacheKey(): string {
  if (typeof window === "undefined") {
    // Server-side: não deve usar cache do cliente
    return "";
  }

  // Client-side: usar hostname como chave
  const hostname = window.location.hostname;
  const port = window.location.port;

  // Normalizar hostname para garantir consistência
  let cacheKey = hostname;

  // Em desenvolvimento, incluir porta se presente
  if (
    port &&
    (hostname.includes("localhost") || hostname.includes("127.0.0.1"))
  ) {
    cacheKey = `${hostname}:${port}`;
  }

  return cacheKey;
}

// Função para obter subdomain do tenant
export function getTenantSubdomainFromHostname(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // Em desenvolvimento: subdomain.localhost ou subdomain.127.0.0.1
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    if (
      parts.length > 1 &&
      parts[0] !== "localhost" &&
      parts[0] !== "127.0.0.1"
    ) {
      return parts[0];
    }
  } else if (parts.length > 2) {
    // Em produção: subdomain.dominio.com
    return parts[0];
  }

  return null;
}

// Interface para item de cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache global isolado por tenant (client-side)
const tenantCaches: Map<string, Map<string, CacheItem<any>>> = new Map();

/**
 * Obter ou criar cache para um tenant específico
 */
function getTenantCache(): Map<string, CacheItem<any>> {
  const cacheKey = getTenantCacheKey();

  if (!cacheKey) {
    // Server-side: retornar cache vazio
    return new Map();
  }

  if (!tenantCaches.has(cacheKey)) {
    tenantCaches.set(cacheKey, new Map());
  }

  return tenantCaches.get(cacheKey)!;
}

/**
 * Limpar cache de um tenant específico
 */
export function clearTenantCache(tenantKey?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const cacheKey = tenantKey || getTenantCacheKey();

  if (cacheKey && tenantCaches.has(cacheKey)) {
    tenantCaches.get(cacheKey)!.clear();
    console.log(`🧹 [CACHE] Cache limpo para tenant: ${cacheKey}`);
  }
}

/**
 * Limpar todos os caches
 */
export function clearAllTenantCaches(): void {
  tenantCaches.clear();
  console.log("🧹 [CACHE] Todos os caches limpos");
}

/**
 * Obter item do cache
 */
export function getCachedItem<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const cache = getTenantCache();
  const item = cache.get(key);

  if (!item) {
    return null;
  }

  const now = Date.now();

  // Verificar se expirou
  if (now > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.data as T;
}

/**
 * Salvar item no cache
 */
export function setCachedItem<T>(
  key: string,
  data: T,
  ttl: number = 5 * 60 * 1000 // 5 minutos padrão
): void {
  if (typeof window === "undefined") {
    return;
  }

  const cache = getTenantCache();
  const now = Date.now();

  cache.set(key, {
    data,
    timestamp: now,
    expiresAt: now + ttl,
  });
}

/**
 * Invalidar item específico do cache
 */
export function invalidateCacheItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const cache = getTenantCache();
  cache.delete(key);
}

/**
 * Verificar se item existe e está válido no cache
 */
export function hasCachedItem(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const cache = getTenantCache();
  const item = cache.get(key);

  if (!item) {
    return false;
  }

  const now = Date.now();

  if (now > item.expiresAt) {
    cache.delete(key);
    return false;
  }

  return true;
}

/**
 * Obter estatísticas do cache para um tenant
 */
export function getCacheStats(): {
  tenantKey: string;
  itemCount: number;
  items: Array<{ key: string; age: number; expiresIn: number }>;
} {
  if (typeof window === "undefined") {
    return {
      tenantKey: "",
      itemCount: 0,
      items: [],
    };
  }

  const cacheKey = getTenantCacheKey();
  const cache = getTenantCache();
  const now = Date.now();

  const items: Array<{ key: string; age: number; expiresIn: number }> = [];

  cache.forEach((item, key) => {
    if (now <= item.expiresAt) {
      items.push({
        key,
        age: now - item.timestamp,
        expiresIn: item.expiresAt - now,
      });
    }
  });

  return {
    tenantKey: cacheKey,
    itemCount: items.length,
    items,
  };
}
