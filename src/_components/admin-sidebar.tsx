"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/_lib/utils";
import { Button } from "@/_components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  Palette, 
  Image, 
  CreditCard,
  Users, 
  Scissors, 
  Calendar,
  BarChart3,
  Menu,
  X
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Agendamentos",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Barbeiros",
    href: "/admin/barbers",
    icon: Users,
  },
  {
    name: "Serviços",
    href: "/admin/services",
    icon: Scissors,
  },
  {
    name: "Relatórios",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Banner",
    href: "/admin/banner",
    icon: Image,
  },
  {
    name: "Planos",
    href: "/admin/plans",
    icon: CreditCard,
  },
  {
    name: "Temas",
    href: "/admin/themes",
    icon: Palette,
  },
  {
    name: "Cores",
    href: "/admin/colors",
    icon: Palette,
  },
  {
    name: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 position-absolute">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card border-border"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 position-absolute"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Admin</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:translate-x-1"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-105"
                  )} />
                  {item.name}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border/50">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-card-foreground text-xs font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Sistema Online</p>
                <p className="text-xs text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
