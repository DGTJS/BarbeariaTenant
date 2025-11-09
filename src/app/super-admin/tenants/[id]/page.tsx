"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Save,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TenantDetails {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  status: string;
  isActive: boolean;
  plan?: {
    id: string;
    name: string;
    price: number;
  };
  trialStartDate?: string;
  trialEndDate?: string;
  databaseName: string;
  currentBarbers: number;
  currentServices: number;
  currentBookingsThisMonth: number;
  createdAt: string;
}

export default function TenantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;
  const [tenant, setTenant] = useState<TenantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    customDomain: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    status: "",
    isActive: true,
  });

  useEffect(() => {
    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId]);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`);
      if (response.ok) {
        const data = await response.json();
        setTenant(data);
        setFormData({
          name: data.name,
          subdomain: data.subdomain,
          customDomain: data.customDomain || "",
          ownerName: data.ownerName,
          ownerEmail: data.ownerEmail,
          ownerPhone: data.ownerPhone || "",
          status: data.status,
          isActive: data.isActive,
        });
      } else {
        toast.error("Erro ao buscar tenant.");
        router.push("/super-admin/tenants");
      }
    } catch (error) {
      console.error("Erro ao buscar tenant:", error);
      toast.error("Erro ao buscar tenant.");
      router.push("/super-admin/tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validações básicas
    if (!formData.name.trim()) {
      toast.error("Nome da barbearia é obrigatório");
      return;
    }
    if (!formData.subdomain.trim()) {
      toast.error("Subdomínio é obrigatório");
      return;
    }
    if (!formData.ownerEmail.trim() || !formData.ownerEmail.includes("@")) {
      toast.error("Email válido é obrigatório");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Tenant atualizado com sucesso!");
        fetchTenant();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao atualizar tenant.");
      }
    } catch (error) {
      console.error("Erro ao atualizar tenant:", error);
      toast.error("Erro ao atualizar tenant.");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Tenant não encontrado</p>
          <Button asChild className="mt-4">
            <Link href="/super-admin/tenants">Voltar para Tenants</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/super-admin/tenants">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {tenant.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Detalhes e configurações do tenant
            </p>
          </div>
        </div>
        {getStatusBadge(tenant.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Barbearia</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subdomain">Subdomínio *</Label>
                  <Input
                    id="subdomain"
                    required
                    value={formData.subdomain}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        subdomain: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    placeholder="exemplo"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.subdomain || "exemplo"}.barberboss.com
                  </p>
                </div>
                <div>
                  <Label htmlFor="customDomain">Domínio Customizado</Label>
                  <Input
                    id="customDomain"
                    value={formData.customDomain}
                    onChange={e =>
                      setFormData({ ...formData, customDomain: e.target.value })
                    }
                    placeholder="exemplo.com"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    required
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Ativo</option>
                    <option value="suspended">Suspenso</option>
                    <option value="expired">Expirado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    O status do tenant no sistema
                  </p>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="isActive">Ativo</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir acesso ao sistema
                    </p>
                  </div>
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do Proprietário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ownerName">Nome Completo *</Label>
                <Input
                  id="ownerName"
                  required
                  value={formData.ownerName}
                  onChange={e =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  placeholder="João Silva"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerEmail">Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    required
                    value={formData.ownerEmail}
                    onChange={e =>
                      setFormData({ ...formData, ownerEmail: e.target.value })
                    }
                    placeholder="joao@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerPhone">Telefone</Label>
                  <Input
                    id="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={e =>
                      setFormData({ ...formData, ownerPhone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/super-admin/tenants")}
              disabled={saving}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        {/* Informações Laterais */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">{tenant.plan?.name || "N/A"}</p>
                <p className="text-sm text-muted-foreground">
                  R$ {tenant.plan?.price || 0}/mês
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Barbeiros</span>
                <span className="font-medium">{tenant.currentBarbers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Serviços</span>
                <span className="font-medium">{tenant.currentServices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Agendamentos (mês)
                </span>
                <span className="font-medium">
                  {tenant.currentBookingsThisMonth}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Banco de Dados:</span>
                <p className="font-mono text-xs mt-1">{tenant.databaseName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Criado em:</span>
                <p className="mt-1">
                  {new Date(tenant.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              {tenant.trialEndDate && (
                <div>
                  <span className="text-muted-foreground">Trial até:</span>
                  <p className="mt-1">
                    {new Date(tenant.trialEndDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
