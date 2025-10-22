"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/_components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/_components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { 
  LogOut, 
  Settings, 
  User, 
  ChevronDown,
  Loader2
} from "lucide-react";

export default function AdminHeader() {
  const { data: session, status } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({ 
        callbackUrl: "/admin/login",
        redirect: true 
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setLoggingOut(false);
    }
  };

  if (status === "loading") {
    return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  if (!session) {
    return null;
  }

  const userInitials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistema de Gerenciamento
            </p>
          </div>
        </div>

        {/* Menu do Usuário */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={loggingOut}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.user?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {session.user?.email}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user?.name || "Usuário"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => router.push("/admin/settings")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => router.push("/admin/profile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                <span>{loggingOut ? "Saindo..." : "Sair"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
