"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  status: boolean;
  maxBarbers: number;
  maxServices: number;
  maxServiceOptions: number;
  maxBookingsPerMonth: number;
  maxBarberShops: number;
  maxStorageMB: number;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  hasWhiteLabel: boolean;
  hasAPI: boolean;
  hasPrioritySupport: boolean;
  trialDays: number;
  requiresCard: boolean;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/super-admin/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        toast.error("Erro ao buscar planos");
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      toast.error("Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/super-admin/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });

      if (response.ok) {
        toast.success(
          currentStatus
            ? "Plano desativado com sucesso"
            : "Plano ativado com sucesso"
        );
        fetchPlans();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao atualizar plano");
      }
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      toast.error("Erro ao atualizar plano");
    }
  };

  const handleDelete = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (
      !confirm(
        `Tem certeza que deseja deletar o plano "${plan?.name}"?\n\nEsta ação não pode ser desfeita e o plano será removido permanentemente.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/plans/${planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Plano deletado com sucesso");
        fetchPlans();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao deletar plano");
      }
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      toast.error("Erro ao deletar plano");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os planos de assinatura disponíveis
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchPlans} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button asChild>
            <Link href="/super-admin/plans/create">
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/super-admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Carregando planos...</p>
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum plano encontrado</p>
            <p className="text-sm text-muted-foreground mb-4">
              Crie seu primeiro plano para começar
            </p>
            <Button asChild>
              <Link href="/super-admin/plans/create">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Plano
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={`relative ${!plan.status ? "opacity-60" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">
                        R$ {Number(plan.price).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">
                        /{plan.period === "monthly" ? "mês" : "ano"}
                      </span>
                    </div>
                  </div>
                  <Badge variant={plan.status ? "default" : "secondary"}>
                    {plan.status ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                {plan.description && (
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Limites */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Barbeiros:</span>
                      <span className="font-medium">
                        {plan.maxBarbers === 0 ? "Ilimitado" : plan.maxBarbers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serviços:</span>
                      <span className="font-medium">
                        {plan.maxServices === 0
                          ? "Ilimitado"
                          : plan.maxServices}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Agendamentos:
                      </span>
                      <span className="font-medium">
                        {plan.maxBookingsPerMonth === 0
                          ? "Ilimitado"
                          : `${plan.maxBookingsPerMonth}/mês`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Barbearias:</span>
                      <span className="font-medium">
                        {plan.maxBarberShops === 0
                          ? "Ilimitado"
                          : plan.maxBarberShops}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Armazenamento:
                      </span>
                      <span className="font-medium">
                        {plan.maxStorageMB === 0
                          ? "Ilimitado"
                          : `${plan.maxStorageMB} MB`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trial:</span>
                      <span className="font-medium">{plan.trialDays} dias</span>
                    </div>
                  </div>

                  {/* Funcionalidades */}
                  <div className="pt-2 border-t space-y-1 text-sm">
                    {plan.hasAnalytics && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500" />
                        Analytics
                      </div>
                    )}
                    {plan.hasCustomDomain && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500" />
                        Domínio Customizado
                      </div>
                    )}
                    {plan.hasWhiteLabel && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500" />
                        White Label
                      </div>
                    )}
                    {plan.hasAPI && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500" />
                        API
                      </div>
                    )}
                    {plan.hasPrioritySupport && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500" />
                        Suporte Prioritário
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/super-admin/plans/${plan.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(plan.id, plan.status)}
                    >
                      {plan.status ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
