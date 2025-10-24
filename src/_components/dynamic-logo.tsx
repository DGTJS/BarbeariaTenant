"use client";

import Image from "next/image";
import { useSiteConfig } from "@/_hooks/useSiteConfig";
import { Skeleton } from "@/_components/ui/skeleton";

interface DynamicLogoProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export default function DynamicLogo({
  width = 80,
  height = 80,
  alt = "Logo",
  className = "",
  fallbackSrc = "/logo.png",
  priority = false,
}: DynamicLogoProps) {
  const { config, loading } = useSiteConfig();

  if (loading) {
    return (
      <Skeleton 
        className={`${className}`} 
        style={{ width, height }}
      />
    );
  }

  // Se há logo configurada, usar ela
  if (config.barbershop_logo_base64) {
    return (
      <Image
        src={config.barbershop_logo_base64}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        unoptimized={true} // Força o uso da imagem sem otimização
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: width,
          maxHeight: height,
        }}
      />
    );
  }

  // Fallback para logo padrão
  return (
    <Image
      src={fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
