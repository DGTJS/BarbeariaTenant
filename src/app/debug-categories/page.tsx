"use client";

import { useEffect, useState } from "react";
import DynamicIcon from "@/_components/dynamic-icon";

export default function DebugCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        console.log('Categorias recebidas:', data);
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar categorias:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Debug - Categorias e Ícones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center">
                <DynamicIcon 
                  iconUrl={category.IconUrl} 
                  className="h-10 w-10 text-primary" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description || 'Sem descrição'}
                </p>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded text-xs font-mono space-y-1">
              <div><span className="font-bold">ID:</span> {category.id}</div>
              <div><span className="font-bold">IconUrl:</span> {category.IconUrl || 'NULL'}</div>
              <div><span className="font-bold">Tipo:</span> {typeof category.IconUrl}</div>
              <div><span className="font-bold">Começa com lucide:</span> {String(category.IconUrl?.startsWith('lucide:'))}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="font-bold text-xl mb-4">Teste Manual dos Ícones:</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <DynamicIcon iconUrl="lucide:Package" className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">Package</p>
          </div>
          <div className="text-center">
            <DynamicIcon iconUrl="lucide:Sparkles" className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">Sparkles</p>
          </div>
          <div className="text-center">
            <DynamicIcon iconUrl="lucide:Scissors" className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">Scissors</p>
          </div>
          <div className="text-center">
            <DynamicIcon iconUrl="lucide:Flame" className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">Flame</p>
          </div>
        </div>
      </div>
    </div>
  );
}


