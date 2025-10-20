"use client";

import { Badge } from "./ui/badge";
import { useTheme, getIconFilter } from "../_hooks/useTheme";

interface SpecialtyBadgeProps {
  name: string;
  IconUrl: string;
  id: string;
}

const SpecialtyBadge = ({ name, IconUrl }: SpecialtyBadgeProps) => {
  const { isLight, isLoading } = useTheme();

  const getIconFilterStyle = () => {
    if (isLoading) return '';
    return getIconFilter(isLight);
  };

  return (
    <Badge 
      variant="secondary" 
      className="flex items-center gap-2 px-3 py-2 bg-card-secondary/50 border border-card-border/30 hover:bg-card-hover transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <img 
        src={IconUrl} 
        alt={name} 
        width={16} 
        height={16}
        style={{ filter: getIconFilterStyle() }}
        className="flex-shrink-0"
      />
      <span className="text-sm font-medium text-card-foreground whitespace-nowrap">
        {name}
      </span>
    </Badge>
  );
};

export default SpecialtyBadge;
