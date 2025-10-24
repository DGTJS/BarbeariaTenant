"use client";

import { useTheme, getIconFilter } from "../_hooks/useTheme";
import DynamicIcon from "./dynamic-icon";

interface Category {
  id: string;
  name: string;
  IconUrl: string;
}

interface CategoryButtonsProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryButtons = ({ categories, selectedCategory, onCategorySelect }: CategoryButtonsProps) => {
  const { isLight, isLoading } = useTheme();

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onCategorySelect(null); // Deselecionar se já estiver selecionado
    } else {
      onCategorySelect(categoryId);
    }
  };

  // Função para obter o filtro CSS baseado no tema
  const getIconFilterStyle = () => {
    if (isLoading) return '';
    return getIconFilter(isLight);
  };

  return (
    <div className="w-full">
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card-secondary text-card-foreground border-border hover:bg-card-hover hover:border-primary/50"
              }`}
            >
              <DynamicIcon 
                iconUrl={category.IconUrl}
                className="flex-shrink-0 w-5 h-5"
                size={20}
              />
              <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group h-16 w-full flex items-center gap-3 px-4 transition-all duration-200 rounded-xl border cursor-pointer ${
                selectedCategory === category.id
                  ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                  : "border-border bg-card-secondary hover:scale-105 hover:border-primary/50 hover:bg-card-hover hover:shadow-lg"
              }`}
            >
              <DynamicIcon 
                iconUrl={category.IconUrl}
                className={`flex-shrink-0 w-5 h-5 transition-transform duration-200 ${
                  selectedCategory === category.id ? "scale-110" : "group-hover:scale-110"
                }`}
                size={20}
              />
              <span className="text-sm font-medium transition-colors truncate">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Display */}
      {selectedCategory && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary font-medium">Filtro ativo:</span>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </span>
            </div>
            <button
              onClick={() => onCategorySelect(null)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryButtons;
