"use client";

import DynamicIcon from "./dynamic-icon";

export default function TestIcons() {
  const testIcons = [
    { name: "Combo", url: "lucide:Package" },
    { name: "Tratamento", url: "lucide:Sparkles" },
    { name: "Hidratação", url: "lucide:Sparkles" },
    { name: "Cabelo", url: "lucide:Scissors" },
    { name: "Barba", url: "lucide:Flame" },
    { name: "Sobrancelha", url: "lucide:Eye" },
    { name: "Massagem", url: "lucide:Hand" },
    { name: "Acabamento", url: "lucide:Sparkle" },
  ];

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Teste de Ícones</h2>
      <div className="grid grid-cols-4 gap-4">
        {testIcons.map((icon) => (
          <div key={icon.name} className="flex flex-col items-center gap-2 p-4 border rounded">
            <DynamicIcon iconUrl={icon.url} className="h-8 w-8" />
            <span className="text-sm">{icon.name}</span>
            <code className="text-xs text-muted-foreground">{icon.url}</code>
          </div>
        ))}
      </div>
    </div>
  );
}


