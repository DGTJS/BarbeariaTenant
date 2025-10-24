"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/_hooks/useSiteConfig";

export default function DynamicMetadata() {
  const { config } = useSiteConfig();

  useEffect(() => {
    // Atualizar título da página
    if (config.seo_title) {
      document.title = config.seo_title;
    } else if (config.barbershop_name) {
      document.title = config.barbershop_name;
    }

    // Atualizar meta description
    if (config.seo_description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', config.seo_description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = config.seo_description;
        document.head.appendChild(meta);
      }
    }

    // Atualizar meta keywords
    if (config.seo_keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.seo_keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = config.seo_keywords;
        document.head.appendChild(meta);
      }
    }

    // Atualizar favicon (usar ICO se disponível, senão PNG)
    const faviconUrl = config.barbershop_favicon_ico || config.barbershop_favicon_base64;
    if (faviconUrl) {
      // Remover favicons existentes
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(favicon => favicon.remove());
      
      // Adicionar favicon ICO
      if (config.barbershop_favicon_ico) {
        const icoLink = document.createElement('link');
        icoLink.rel = 'icon';
        icoLink.type = 'image/x-icon';
        icoLink.href = config.barbershop_favicon_ico;
        document.head.appendChild(icoLink);
      }
      
      // Adicionar favicon PNG como fallback
      if (config.barbershop_favicon_base64) {
        const pngLink = document.createElement('link');
        pngLink.rel = 'icon';
        pngLink.type = 'image/png';
        pngLink.href = config.barbershop_favicon_base64;
        document.head.appendChild(pngLink);
      }
    }
  }, [config]);

  return null;
}
