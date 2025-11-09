"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Eye,
  Power,
  PowerOff,
  RefreshCw,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  ownerName: string;
  ownerEmail: string;
  status: string;
  isActive: boolean;
  plan?: {
    id: string;
    name: string;
    price: number;
  };
  trialEndDate?: string;
  currentBarbers: number;
  currentServices: number;
  currentBookingsThisMonth: number;
  createdAt: string;
}

export default function TenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/super-admin/tenants?status=${statusFilter}`
      );
      if (response.ok) {
        const data = await response.json();
        setTenants(data);
      } else {
        toast.error("Erro ao buscar tenants.");
      }
    } catch (error) {
      console.error("Erro ao buscar tenants:", error);
      toast.error("Erro ao buscar tenants.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTenants();
  };

  const handleToggleTenantStatus = async (
    tenantId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenantId}/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      if (response.ok) {
        toast.success(
          `Tenant ${currentStatus ? "desativado" : "ativado"} com sucesso!`
        );
        fetchTenants();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao alterar status do tenant.");
      }
    } catch (error) {
      console.error("Erro ao alterar status do tenant:", error);
      toast.error("Erro ao alterar status do tenant.");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      trial: { label: "Trial", variant: "secondary" as const },
      active: { label: "Ativo", variant: "default" as const },
      suspended: { label: "Suspenso", variant: "destructive" as const },
      expired: { label: "Expirado", variant: "destructive" as const },
      cancelled: { label: "Cancelado", variant: "outline" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.trial;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os tenants do sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/tenants/create">
            <Plus className="h-4 w-4 mr-2" />
            Novo Tenant
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Tenants</CardTitle>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md bg-background"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="all">Todos</option>
                <option value="trial">Trial</option>
                <option value="active">Ativos</option>
                <option value="suspended">Suspensos</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum tenant encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTenants.map(tenant => (
                <Card
                  key={tenant.id}
                  className="hover:border-primary/50 transition"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {tenant.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {tenant.subdomain}.barberboss.com
                              {tenant.customDomain &&
                                ` • ${tenant.customDomain}`}
                            </p>
                          </div>
                          {getStatusBadge(tenant.status)}
                        </div>
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dono:</span>
                            <p className="font-medium">{tenant.ownerName}</p>
                            <p className="text-muted-foreground text-xs">
                              {tenant.ownerEmail}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Plano:
                            </span>
                            <p className="font-medium">
                              {tenant.plan?.name || "N/A"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              R$ {tenant.plan?.price || 0}/mês
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Uso:</span>
                            <p className="font-medium">
                              {tenant.currentBarbers} barbeiros •{" "}
                              {tenant.currentServices} serviços
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {tenant.currentBookingsThisMonth} agendamentos
                              este mês
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Criado em:
                            </span>
                            <p className="font-medium">
                              {new Date(tenant.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                            {tenant.trialEndDate && (
                              <p className="text-muted-foreground text-xs">
                                Trial até:{" "}
                                {new Date(
                                  tenant.trialEndDate
                                ).toLocaleDateString("pt-BR")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleTenantStatus(tenant.id, tenant.isActive)
                          }
                          title={
                            tenant.isActive
                              ? "Suspender tenant"
                              : "Ativar tenant"
                          }
                        >
                          {tenant.isActive ? (
                            <PowerOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Power className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/super-admin/tenants/${tenant.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
