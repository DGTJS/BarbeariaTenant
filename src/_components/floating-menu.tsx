"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Home, 
  Calendar, 
  Heart, 
  History,
  User
} from "lucide-react";
import { useTheme } from "@/_hooks/useTheme";
interface Category {
  id: string;
  name: string;
  IconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
}

interface FloatingMenuProps {
  categories: Category[];
  onAppointmentsClick?: () => void;
  onRateServicesClick?: () => void;
  onBookingClick?: () => void;
  onFavoritesClick?: () => void;
  onHistoryClick?: () => void;
  onAccountClick?: () => void;
}

const FloatingMenu = ({ 
  categories, 
  onAppointmentsClick, 
  onRateServicesClick, 
  onBookingClick,
  onFavoritesClick,
  onHistoryClick,
  onAccountClick
}: FloatingMenuProps) => {
  const { getIconFilterStyle } = useTheme();

  const menuItems = [
    {
      id: "home",
      label: "Início",
      icon: Home,
      onClick: () => window.location.href = "/",
    },
    {
      id: "booking",
      label: "Agendar",
      icon: Calendar,
      onClick: onBookingClick,
    },
    {
      id: "appointments",
      label: "Agendamentos",
      icon: Calendar,
      onClick: onAppointmentsClick,
    },
    {
      id: "favorites",
      label: "Favoritos",
      icon: Heart,
      onClick: onFavoritesClick,
    },
    {
      id: "account",
      label: "Conta",
      icon: User,
      onClick: onAccountClick,
    },
  ];

  return (
    <>
      {/* Menu flutuante para mobile */}
      <div className=" fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
        <Card className="py-2 bg-card/95 backdrop-blur-sm border border-card-border/30 shadow-lg rounded-t-lg">
          <CardContent className="p-1">
            <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {menuItems.map((item, index) => {
                const isAppointmentsButton = item.id === "appointments";
                const isMiddleButton = index === Math.floor(menuItems.length / 2);
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={item.onClick}
                    className={`flex flex-col items-center gap-0.5 h-auto py-0 px-1.5 text-xs whitespace-nowrap transition-all duration-200 ${
                      isAppointmentsButton 
                        ? "min-w-[65px] py-5 !bg-primary !text-primary-foreground shadow-lg shadow-primary/25 hover:!bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 border-0" 
                        : "min-w-[65px]"
                    }`}
                  >
                    <item.icon 
                      className={isAppointmentsButton ? "h-5 w-5" : "h-5 w-5"} 
                      style={isAppointmentsButton ? {} : { filter: getIconFilterStyle() }}
                    />
                    <span className={`leading-none ${isAppointmentsButton ? "text-[10px] font-bold" : "text-[8px]"}`}>
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu lateral para desktop */}
      <div className="hidden lg:block fixed left-2 top-1/2 transform -translate-y-1/2 z-30">
        <Card className="bg-card/95 backdrop-blur-sm border border-card-border/30 shadow-lg">
          <CardContent className="p-2">
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const isAppointmentsButton = item.id === "appointments";
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={item.onClick}
                    className={`flex items-center gap-2 justify-start h-auto py-2 px-2 w-full transition-all duration-200 ${
                      isAppointmentsButton 
                        ? "!bg-primary !text-primary-foreground shadow-lg shadow-primary/25 hover:!bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 border-0" 
                        : ""
                    }`}
                    title={item.label}
                  >
                    <item.icon 
                      className={isAppointmentsButton ? "h-6 w-6" : "h-4 w-4"} 
                      style={isAppointmentsButton ? {} : { filter: getIconFilterStyle() }}
                    />
                    <span className={`font-medium ${isAppointmentsButton ? "text-base font-bold" : "text-xs"}`}>
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FloatingMenu;
