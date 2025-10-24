"use client";

import { useState } from "react";
import { MapPin, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { toast } from "sonner";

interface BarbershopMapProps {
  address: string;
  name: string;
  className?: string;
}

export default function BarbershopMap({ address, name, className = "" }: BarbershopMapProps) {
  const [copied, setCopied] = useState(false);

  // Gerar URL do Google Maps
  const encodedAddress = encodeURIComponent(address);
  const mapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Endereço copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar endereço");
    }
  };

  const handleOpenMaps = () => {
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Localização</h3>
      </div>

      {/* Mapa */}
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-border shadow-md">
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapsEmbedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent">
            <div className="text-center p-4">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Configure a API Key do Google Maps para exibir o mapa
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Endereço e ações */}
      <div className="bg-accent/50 rounded-lg p-3 space-y-2">
        <p className="text-sm text-foreground-muted font-medium">{name}</p>
        <p className="text-sm text-foreground">{address}</p>
        
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1 h-8"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copiar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenMaps}
            className="flex-1 h-8"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Abrir no Maps
          </Button>
        </div>
      </div>
    </div>
  );
}

