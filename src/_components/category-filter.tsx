"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTheme } from "@/_hooks/useTheme";
import DynamicIcon from "./dynamic-icon";

interface Category {
  id: string;
  name: string;
  IconUrl: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  const { getIconFilterStyle } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {selectedCategory && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategorySelect(null)}
            className="text-xs"
          >
            Limpar Filtro
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Botão "Todos" */}
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(null)}
          className={`flex items-center gap-2 ${
            selectedCategory === null 
              ? "bg-primary text-primary-foreground" 
              : "bg-card-secondary/90 border border-card-border/30 hover:bg-accent-hover shadow-sm hover:shadow-md transition-all duration-200"
          }`}
        >
          <span className="text-sm">Todos</span>
          <Badge variant="secondary" className="text-xs">
            {categories.length}
          </Badge>
        </Button>

        {/* Botões de categoria */}
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center gap-2 ${
              selectedCategory === category.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-card-secondary/90 border border-card-border/30 hover:bg-accent-hover shadow-sm hover:shadow-md transition-all duration-200"
            }`}
          >
            <DynamicIcon 
              iconUrl={category.IconUrl}
              className="w-4 h-4"
              size={16}
            />
            <span className="text-sm">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
