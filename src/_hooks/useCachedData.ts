"use client";

import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  key: string;
  maxAge: number; // em segundos
}

interface CachedData<T> {
  data: T | null;
  timestamp: number;
}

export function useCachedData<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `cached_${options.key}`;

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar cache local
      if (!forceRefresh && typeof window !== 'undefined') {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed: CachedData<T> = JSON.parse(cached);
          const age = (Date.now() - parsed.timestamp) / 1000;
          
          if (age < options.maxAge) {
            console.log(`🚀 [${options.key}] Usando cache local (idade: ${Math.floor(age)}s)`);
            setData(parsed.data);
            setLoading(false);
            
            // Revalidar em background se cache está velho (> 50% do maxAge)
            if (age > options.maxAge * 0.5) {
              console.log(`🔄 [${options.key}] Revalidando em background...`);
              fetchData(true).catch(console.error);
            }
            return;
          }
        }
      }

      // Buscar dados frescos
      console.log(`🔄 [${options.key}] Buscando dados frescos...`);
      const freshData = await fetcher();
      
      // Salvar no cache
      if (typeof window !== 'undefined') {
        const cacheData: CachedData<T> = {
          data: freshData,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }

      setData(freshData);
      console.log(`✅ [${options.key}] Dados atualizados`);
    } catch (err) {
      console.error(`❌ [${options.key}] Erro:`, err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  }, [fetcher, cacheKey, options.key, options.maxAge]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey);
      console.log(`🧹 [${options.key}] Cache local limpo`);
    }
    fetchData(true);
  }, [cacheKey, options.key, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
  };
}

// Hook específico para barbeiros
export function useCachedBarbers() {
  return useCachedData(
    async () => {
      const response = await fetch('/api/barbers');
      if (!response.ok) throw new Error('Erro ao buscar barbeiros');
      return response.json();
    },
    { key: 'barbers', maxAge: 3600 } // 1 hora
  );
}

// Hook específico para serviços
export function useCachedServices() {
  return useCachedData(
    async () => {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Erro ao buscar serviços');
      return response.json();
    },
    { key: 'services', maxAge: 3600 } // 1 hora
  );
}

