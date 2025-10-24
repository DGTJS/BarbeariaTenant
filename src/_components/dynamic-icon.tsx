"use client";

import { 
  Scissors, 
  Smile,
  Award,
  Sparkles,
  Heart,
  Star,
  TrendingUp,
  Zap,
  Coffee,
  ShoppingBag,
  Gift,
  Users,
  Crown,
  Gem,
  Palette,
  Brush,
  Droplet,
  Wind,
  Sun,
  Moon,
  CircleDot,
  LucideIcon,
  Flame,
  Waves,
  Sparkle,
  Eye,
  Hand,
  Skull,
  Feather,
  Flower2,
  Leaf,
  Package,
  Bath,
  CircleSlash2,
  ShowerHead,
  Wrench,
  Cog,
  Paintbrush,
  Fingerprint,
  Dumbbell,
  Activity,
  Target,
  CircleEllipsis,
  Hexagon,
  Triangle,
  Square,
  Circle,
  Diamond
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  'Scissors': Scissors,
  'Smile': Smile,
  'Award': Award,
  'Sparkles': Sparkles,
  'Heart': Heart,
  'Star': Star,
  'TrendingUp': TrendingUp,
  'Zap': Zap,
  'Coffee': Coffee,
  'ShoppingBag': ShoppingBag,
  'Gift': Gift,
  'Users': Users,
  'Crown': Crown,
  'Gem': Gem,
  'Palette': Palette,
  'Brush': Brush,
  'Droplet': Droplet,
  'Wind': Wind,
  'Sun': Sun,
  'Moon': Moon,
  'CircleDot': CircleDot,
  'Flame': Flame,
  'Waves': Waves,
  'Sparkle': Sparkle,
  'Eye': Eye,
  'Hand': Hand,
  'Skull': Skull,
  'Feather': Feather,
  'Flower2': Flower2,
  'Leaf': Leaf,
  'Package': Package,
  'Bath': Bath,
  'CircleSlash2': CircleSlash2,
  'ShowerHead': ShowerHead,
  'Wrench': Wrench,
  'Cog': Cog,
  'Paintbrush': Paintbrush,
  'Fingerprint': Fingerprint,
  'Dumbbell': Dumbbell,
  'Activity': Activity,
  'Target': Target,
  'CircleEllipsis': CircleEllipsis,
  'Hexagon': Hexagon,
  'Triangle': Triangle,
  'Square': Square,
  'Circle': Circle,
  'Diamond': Diamond
};

interface DynamicIconProps {
  iconUrl: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ iconUrl, className = "h-5 w-5", size }: DynamicIconProps) {
  // Verificar se iconUrl existe
  if (!iconUrl) {
    return <Scissors className={className} size={size} />;
  }

  // Se é um ícone do Lucide
  if (iconUrl.startsWith('lucide:')) {
    const iconName = iconUrl.replace('lucide:', '');
    const IconComponent = ICON_MAP[iconName];
    
    if (IconComponent) {
      return <IconComponent className={className} size={size} />;
    }
    // Fallback se ícone não encontrado
    return <Scissors className={className} size={size} />;
  }
  
  // Se é um SVG customizado, URL ou base64
  if (iconUrl.startsWith('/') || iconUrl.startsWith('http') || iconUrl.startsWith('data:')) {
    return (
      <img 
        src={iconUrl} 
        alt="Ícone" 
        className={className}
        style={{ objectFit: 'contain' }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // Ícone padrão se formato não reconhecido
  return <Scissors className={className} size={size} />;
}


