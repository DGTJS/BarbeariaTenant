import DynamicIcon from "@/_components/dynamic-icon";

export default function TestIconsPage() {
  const testIcons = [
    { name: "Package (Combo)", url: "lucide:Package" },
    { name: "Sparkles (Tratamento)", url: "lucide:Sparkles" },
    { name: "Scissors (Cabelo)", url: "lucide:Scissors" },
    { name: "Flame (Barba)", url: "lucide:Flame" },
    { name: "Eye (Sobrancelha)", url: "lucide:Eye" },
    { name: "Hand (Massagem)", url: "lucide:Hand" },
    { name: "Sparkle (Acabamento)", url: "lucide:Sparkle" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Teste de Ícones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testIcons.map((icon) => (
          <div key={icon.url} className="border p-4 rounded-lg flex flex-col items-center gap-3">
            <DynamicIcon iconUrl={icon.url} className="h-12 w-12" />
            <div className="text-center">
              <p className="font-semibold">{icon.name}</p>
              <code className="text-xs text-muted-foreground">{icon.url}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="font-bold mb-2">Teste Individual:</h2>
        <div className="flex items-center gap-4">
          <span>lucide:Package →</span>
          <DynamicIcon iconUrl="lucide:Package" className="h-8 w-8 text-primary" />
          <DynamicIcon iconUrl="lucide:Sparkles" className="h-8 w-8 text-green-500" />
          <DynamicIcon iconUrl="lucide:Scissors" className="h-8 w-8 text-blue-500" />
          <DynamicIcon iconUrl="lucide:Flame" className="h-8 w-8 text-red-500" />
        </div>
      </div>
    </div>
  );
}


