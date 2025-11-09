"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Switch } from "@/_components/ui/switch";
import { Loader2, Shield, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

interface BarberPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barberId: string | null;
  barberName: string;
}

export function BarberPermissionsModal({
  open,
  onOpenChange,
  barberId,
  barberName,
}: BarberPermissionsModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // Buscar permissões quando modal abrir
  useEffect(() => {
    if (open && barberId) {
      fetchPermissions();
    } else {
      // Resetar campos quando fechar
      setEmail("");
      setPassword("");
      setHasAdminAccess(false);
    }
  }, [open, barberId]);

  const fetchPermissions = async () => {
    if (!barberId) return;

    try {
      setFetching(true);
      const response = await fetch(
        `/api/admin/barbers/${barberId}/permissions`
      );

      if (!response.ok) {
        let errorData: any = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (parseError) {
          console.error("Erro ao parsear resposta de erro:", parseError);
          errorData = {
            error: `Erro HTTP ${response.status}`,
            details: "Não foi possível ler a resposta do servidor",
          };
        }

        console.error("Erro na resposta da API:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });

        const errorMessage =
          errorData.error ||
          errorData.details ||
          `Erro ao carregar permissões (${response.status})`;

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setEmail(data.email || data.user?.email || "");
      setHasAdminAccess(data.hasAdminAccess || false);
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao carregar permissões do barbeiro";
      toast.error(errorMessage);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!barberId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/barbers/${barberId}/permissions`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email || null,
            password: password || undefined, // Só envia senha se preenchida
            hasAdminAccess,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar permissões");
      }

      toast.success("Permissões atualizadas com sucesso!");
      onOpenChange(false);
      setPassword(""); // Limpar campo de senha após salvar
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar permissões"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gerenciar Permissões - {barberName}
          </DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Email para login */}
            <div className="space-y-2">
              <Label htmlFor="barber-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email para Login
              </Label>
              <Input
                id="barber-email"
                type="email"
                placeholder="barbeiro@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Email que o barbeiro usará para fazer login no sistema
              </p>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label
                htmlFor="barber-password"
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Nova Senha
              </Label>
              <Input
                id="barber-password"
                type="password"
                placeholder="Deixe vazio para não alterar"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Deixe vazio para manter a senha atual. Senha será criptografada
                automaticamente.
              </p>
            </div>

            {/* Permissões de Admin */}
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="admin-access"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Permissões de Administrador
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Permite acesso total à área administrativa
                  </p>
                </div>
                <Switch
                  id="admin-access"
                  checked={hasAdminAccess}
                  onCheckedChange={setHasAdminAccess}
                />
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                {hasAdminAccess
                  ? "⚠️ Este barbeiro terá acesso completo como administrador"
                  : "Este barbeiro terá apenas permissões limitadas de barbeiro"}
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Permissões"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
