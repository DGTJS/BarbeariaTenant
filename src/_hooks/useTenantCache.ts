"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCachedItem,
  setCachedItem,
  invalidateCacheItem,
  hasCachedItem,
  getTenantCacheKey,
} from "@/_lib/tenant-cache";

interface UseTenantCacheOptions<T> {
  cacheKey: string;
  fetcher: () => Promise<T>;
  ttl?: number; // Time to live em milissegundos (padrão: 5 minutos)
  enabled?: boolean; // Se false, não usa cache
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseTenantCacheReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
}

/**
 * Hook para cache isolado por tenant
 * Garante que cada tenant tenha seu próprio cache sem interferência
 */
export function useTenantCache<T>({
  cacheKey,
  fetcher,
  ttl = 5 * 60 * 1000, // 5 minutos padrão
  enabled = true,
  onSuccess,
  onError,
}: UseTenantCacheOptions<T>): UseTenantCacheReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const tenantKeyRef = useRef<string>("");

  // Obter chave do tenant atual
  useEffect(() => {
    tenantKeyRef.current = getTenantCacheKey();
  }, []);

  // Função para buscar dados
  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      // Verificar cache primeiro
      const cached = getCachedItem<T>(cacheKey);

      if (cached !== null) {
        console.log(
          `🚀 [CACHE] Cache HIT para: ${cacheKey} (tenant: ${tenantKeyRef.current})`
        );
        setData(cached);
        setIsLoading(false);
        onSuccess?.(cached);
        return;
      }

      console.log(
        `🔄 [CACHE] Cache MISS para: ${cacheKey} (tenant: ${tenantKeyRef.current})`
      );

      // Buscar dados
      const result = await fetcher();

      // Verificar se foi cancelado
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      // Salvar no cache
      setCachedItem(cacheKey, result, ttl);

      setData(result);
      setIsLoading(false);
      onSuccess?.(result);
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const error = err instanceof Error ? err : new Error("Erro desconhecido");
      setError(error);
      setIsLoading(false);
      onError?.(error);
    }
  }, [cacheKey, fetcher, ttl, enabled, onSuccess, onError]);

  // Carregar dados inicialmente
  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Função para refetch (força nova busca)
  const refetch = useCallback(async () => {
    // Invalidar cache antes de buscar
    invalidateCacheItem(cacheKey);
    await fetchData();
  }, [cacheKey, fetchData]);

  // Função para invalidar cache
  const invalidate = useCallback(() => {
    invalidateCacheItem(cacheKey);
    setData(null);
  }, [cacheKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
  };
}

/**
 * Hook específico para cache de serviços
 */
export function useCachedServices() {
  return useTenantCache({
    cacheKey: "services",
    fetcher: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) {
        throw new Error("Erro ao buscar serviços");
      }
      return response.json();
    },
    ttl: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook específico para cache de barbeiros
 */
export function useCachedBarbers() {
  return useTenantCache({
    cacheKey: "barbers",
    fetcher: async () => {
      const response = await fetch("/api/barbers");
      if (!response.ok) {
        throw new Error("Erro ao buscar barbeiros");
      }
      return response.json();
    },
    ttl: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook específico para cache de agendamentos do usuário
 */
export function useCachedBookings(userId?: string) {
  return useTenantCache({
    cacheKey: userId ? `bookings-${userId}` : "bookings",
    fetcher: async () => {
      if (!userId) {
        return [];
      }
      const response = await fetch(`/api/bookings?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar agendamentos");
      }
      return response.json();
    },
    ttl: 2 * 60 * 1000, // 2 minutos (agendamentos mudam mais frequentemente)
    enabled: !!userId,
  });
}
