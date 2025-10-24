import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import DynamicLogo from "./dynamic-logo";

interface Category {
  id: string;
  name: string;
  IconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
}

interface HeaderProps {
  onNotificationClick?: () => void;
  unreadNotifications?: number;
}

const Header = ({ onNotificationClick, unreadNotifications = 0 }: HeaderProps) => {
  return (
    <div className="text-card-foreground backdrop-blur-md ">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/" className="cursor-pointer transition-transform hover:scale-105">
          <DynamicLogo 
            alt="Logo" 
            width={80} 
            height={80} 
            className="drop-shadow-sm" 
            priority={true}
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationClick}
          className="relative hover:bg-accent-hover transition-all duration-200 h-10 w-10 group"
        >
          <Bell className="h-6 w-6 text-card-foreground group-hover:text-primary transition-colors" />
          {/* Indicador de notificação melhorado */}
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold border-2 border-background animate-pulse flex items-center justify-center p-0 min-w-[20px]">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Header;
