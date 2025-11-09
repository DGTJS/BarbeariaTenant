"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Tag,
  MessageSquare,
  Image,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/_components/ui/button";
import { cn } from "@/_lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    href: "/super-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Tenants",
    href: "/super-admin/tenants",
    icon: Building2,
  },
  {
    title: "Planos",
    href: "/super-admin/plans",
    icon: CreditCard,
  },
  {
    title: "Promoções",
    href: "/super-admin/promotions",
    icon: Tag,
  },
  {
    title: "Chat",
    href: "/super-admin/chat",
    icon: MessageSquare,
  },
  {
    title: "Landing Page",
    href: "/super-admin/landing",
    icon: Image,
  },
  {
    title: "Relatórios",
    href: "/super-admin/reports",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    href: "/super-admin/settings",
    icon: Settings,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Verificar autenticação ao carregar
  useEffect(() => {
    if (pathname === "/super-admin/login") {
      setAuthenticated(false);
      return;
    }

    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        router.push("/super-admin/login");
        return;
      }

      const response = await fetch("/api/super-admin/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem("superAdminToken");
        localStorage.removeItem("superAdminEmail");
        router.push("/super-admin/login");
      }
    } catch (error) {
      router.push("/super-admin/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdminEmail");
    router.push("/super-admin/login");
  };

  // Se estiver na página de login, não mostrar layout
  if (pathname === "/super-admin/login") {
    return <>{children}</>;
  }

  // Se ainda não verificou autenticação, mostrar loading
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-pulse mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não mostrar layout (será redirecionado)
  if (authenticated === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16",
          "hidden md:flex flex-col fixed h-screen z-40"
        )}
      >
        {/* Header Sidebar */}
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-lg font-bold text-foreground">Super Admin</h2>
              <p className="text-xs text-muted-foreground">
                Painel de Controle
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={!sidebarOpen ? item.title : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        {sidebarOpen && (
          <div className="p-4 border-t space-y-2">
            <div className="text-xs text-muted-foreground">
              <p>BarberBoss</p>
              <p>Multi-Tenant System</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed left-0 top-0 h-full w-64 bg-card border-r z-40 transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Super Admin</h2>
            <p className="text-xs text-muted-foreground">Painel de Controle</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-16",
          "pt-0"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
