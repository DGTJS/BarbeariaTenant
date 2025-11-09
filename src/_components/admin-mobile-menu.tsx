"use client";

import { Button } from "@/_components/ui/button";
import { Menu } from "lucide-react";

export function AdminMobileMenu() {
  const handleToggle = () => {
    // Disparar evento global para o sidebar
    window.dispatchEvent(new Event('toggleAdminSidebar'));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="lg:hidden"
      title="Abrir menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

