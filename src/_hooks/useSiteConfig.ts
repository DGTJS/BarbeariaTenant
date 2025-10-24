"use client";

import { useState, useEffect } from "react";

interface DaySchedule {
  id: number;
  name: string;
  short: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

interface SiteConfig {
  // Informações da barbearia
  barbershop_name?: string;
  barbershop_address?: string;
  barbershop_email?: string;
  barbershop_phone?: string;
  barbershop_description?: string;
  
  // Logo e favicon
  barbershop_logo_base64?: string;
  barbershop_logo_width?: number;
  barbershop_logo_height?: number;
  barbershop_favicon_base64?: string;
  barbershop_favicon_ico?: string;
  barbershop_favicon_width?: number;
  barbershop_favicon_height?: number;
  
  // Horários de funcionamento
  working_days?: number[];
  working_hours_start?: string;
  working_hours_end?: string;
  custom_schedules?: DaySchedule[];
  
  // SEO
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  
  // Cores do tema
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  foreground_color?: string;
  muted_color?: string;
  muted_foreground_color?: string;
  border_color?: string;
  card_color?: string;
  card_foreground_color?: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/site-config');
      if (!response.ok) {
        throw new Error('Falha ao carregar configurações');
      }
      
      const data = await response.json();
      
      // Parse custom_schedules se for string
      if (data.custom_schedules && typeof data.custom_schedules === 'string') {
        try {
          data.custom_schedules = JSON.parse(data.custom_schedules);
        } catch (e) {
          data.custom_schedules = [];
        }
      }
      
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    try {
      setError(null);
      
      const response = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ configs: updates }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar configurações');
      }
      
      // Atualizar estado local
      setConfig(prev => ({ ...prev, ...updates }));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao atualizar configurações:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    updateConfig,
    refetch: fetchConfig,
  };
}
