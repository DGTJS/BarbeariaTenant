"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useTheme, getIconFilter } from "../_hooks/useTheme";

interface CategorySearchProps {
  name: string;
  IconUrl: string;
  id: string;
}

const Category = ({ id, name, IconUrl }: CategorySearchProps) => {
  const { isLight, isLoading } = useTheme();

  const getIconFilterStyle = () => {
    if (isLoading) return '';
    return getIconFilter(isLight);
  };

  return (
    <>
      {/* Mobile Layout */}
      <Link href={`/search?category=${id}`} className="lg:hidden">
        <Button variant="outline" className="columns h-[50px] justify-center w-full">
          <img 
            src={IconUrl} 
            alt="Logo" 
            width={15} 
            height={15}
            style={{ filter: getIconFilterStyle() }}
          />
          <span className="justify-center text-center text-xs">{name}</span>
        </Button>
      </Link>

      {/* Desktop Layout */}
      <Link href={`/search?category=${id}`} className="hidden lg:block">
        <Button 
          variant="outline" 
          className="group h-16 w-full flex-col gap-2 border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg"
        >
          <img 
            src={IconUrl} 
            alt={name} 
            width={20} 
            height={20}
            className="transition-transform duration-200 group-hover:scale-110"
            style={{ filter: getIconFilterStyle() }}
          />
          <span className="text-xs font-medium text-card-foreground group-hover:text-primary">
            {name}
          </span>
        </Button>
      </Link>
    </>
  );
};

export default Category;
