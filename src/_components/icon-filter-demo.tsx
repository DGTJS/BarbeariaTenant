"use client";

import { useTheme, getIconFilter } from "../_hooks/useTheme";

interface IconFilterDemoProps {
  iconUrl: string;
  iconName: string;
}

const IconFilterDemo = ({ iconUrl, iconName }: IconFilterDemoProps) => {
  const { isLight, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <p>Carregando tema...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Demo: Filtro de Ícones</h3>
      <p className="text-sm text-muted-foreground">
        Tema atual: <span className="font-medium">{isLight ? 'Claro' : 'Escuro'}</span>
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h4 className="text-sm font-medium mb-2">Sem Filtro (Original)</h4>
          <div className="p-4 bg-card border rounded-lg">
            <img 
              src={iconUrl} 
              alt={iconName} 
              width={40} 
              height={40}
              className="mx-auto"
            />
          </div>
        </div>
        
        <div className="text-center">
          <h4 className="text-sm font-medium mb-2">Com Filtro (Adaptado)</h4>
          <div className="p-4 bg-card border rounded-lg">
            <img 
              src={iconUrl} 
              alt={iconName} 
              width={40} 
              height={40}
              className="mx-auto"
              style={{ filter: getIconFilter(isLight) }}
            />
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Filtro aplicado: <code className="bg-muted px-1 rounded">{getIconFilter(isLight)}</code></p>
      </div>
    </div>
  );
};

export default IconFilterDemo;
