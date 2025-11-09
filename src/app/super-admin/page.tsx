"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Activity,
  CreditCard,
  Calendar,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

interface DashboardStats {
  total: number;
  active: number;
  trial: number;
  expired: number;
  suspended: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    trial: 0,
    expired: 0,
    suspended: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Buscar tenants
      const tenantsResponse = await fetch(
        `/api/super-admin/tenants?status=${statusFilter}`
      );

      if (tenantsResponse.ok) {
        const tenantsData = await tenantsResponse.json();
        setTenants(tenantsData);

        // Calcular estatísticas
        const calculatedStats = {
          total: tenantsData.length,
          active: tenantsData.filter(
            (t: Tenant) => t.status === "active" && t.isActive
          ).length,
          trial: tenantsData.filter((t: Tenant) => t.status === "trial").length,
          expired: tenantsData.filter((t: Tenant) => t.status === "expired")
            .length,
          suspended: tenantsData.filter((t: Tenant) => t.status === "suspended")
            .length,
          totalRevenue: tenantsData.reduce((sum: number, t: Tenant) => {
            return sum + (t.plan?.price || 0);
          }, 0),
          monthlyRevenue: tenantsData
            .filter((t: Tenant) => t.status === "active" && t.isActive)
            .reduce((sum: number, t: Tenant) => {
              return sum + (t.plan?.price || 0);
            }, 0),
        };

        setStats(calculatedStats);
      } else {
        toast.error("Erro ao buscar tenants");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive && status !== "expired") {
      return <Badge variant="destructive">Suspenso</Badge>;
    }

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

  const handleToggleActive = async (
    tenantId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenantId}/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      if (response.ok) {
        toast.success(currentStatus ? "Tenant suspenso" : "Tenant ativado");
        fetchData();
      } else {
        toast.error("Erro ao atualizar tenant");
      }
    } catch (error) {
      console.error("Erro ao atualizar tenant:", error);
      toast.error("Erro ao atualizar tenant");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral de todos os tenants e assinaturas
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button asChild>
            <Link href="/super-admin/tenants/create">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tenant
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Tenants
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0
                ? `${Math.round((stats.active / stats.total) * 100)}% do total`
                : "0% do total"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Trial</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.trial}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Período de teste ativo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De tenants ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirados</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.expired}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspensos</CardTitle>
            <PowerOff className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.suspended}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Bloqueados temporariamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Potencial mensal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Tenants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tenants</CardTitle>
              <CardDescription>
                Lista completa de todos os tenants cadastrados
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md bg-background w-64"
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
            <div className="text-center py-12 text-muted-foreground">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Carregando...</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum tenant encontrado</p>
              <p className="text-sm mt-1">
                {tenants.length === 0
                  ? "Comece criando seu primeiro tenant"
                  : "Tente ajustar os filtros de busca"}
              </p>
              {tenants.length === 0 && (
                <Button asChild className="mt-4">
                  <Link href="/super-admin/tenants/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Tenant
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTenants.map(tenant => (
                <Card
                  key={tenant.id}
                  className="hover:border-primary/50 transition cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
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
                          {getStatusBadge(tenant.status, tenant.isActive)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleActive(tenant.id, tenant.isActive)
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
