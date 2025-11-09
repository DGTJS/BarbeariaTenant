"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Textarea } from "@/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { Switch } from "@/_components/ui/switch";
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
  hasNotifications: boolean;
  hasCustomDomain: boolean;
  hasWhiteLabel: boolean;
  hasAPI: boolean;
  hasPrioritySupport: boolean;
  trialDays: number;
  requiresCard: boolean;
}

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    period: "monthly",
    description: "",
    status: true,
    maxBarbers: "0",
    maxServices: "0",
    maxServiceOptions: "0",
    maxBookingsPerMonth: "0",
    maxBarberShops: "1",
    maxStorageMB: "100",
    hasAnalytics: false,
    hasNotifications: true,
    hasCustomDomain: false,
    hasWhiteLabel: false,
    hasAPI: false,
    hasPrioritySupport: false,
    trialDays: "14",
    requiresCard: true,
  });

  useEffect(() => {
    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/plans/${planId}`);
      if (response.ok) {
        const data = await response.json();
        setPlan(data);
        setFormData({
          name: data.name || "",
          price: String(data.price || 0),
          period: data.period || "monthly",
          description: data.description || "",
          status: data.status ?? true,
          maxBarbers: String(data.maxBarbers || 0),
          maxServices: String(data.maxServices || 0),
          maxServiceOptions: String(data.maxServiceOptions || 0),
          maxBookingsPerMonth: String(data.maxBookingsPerMonth || 0),
          maxBarberShops: String(data.maxBarberShops || 1),
          maxStorageMB: String(data.maxStorageMB || 100),
          hasAnalytics: data.hasAnalytics || false,
          hasNotifications: data.hasNotifications ?? true,
          hasCustomDomain: data.hasCustomDomain || false,
          hasWhiteLabel: data.hasWhiteLabel || false,
          hasAPI: data.hasAPI || false,
          hasPrioritySupport: data.hasPrioritySupport || false,
          trialDays: String(data.trialDays || 14),
          requiresCard: data.requiresCard ?? true,
        });
      } else {
        toast.error("Erro ao buscar plano");
        router.push("/super-admin/plans");
      }
    } catch (error) {
      console.error("Erro ao buscar plano:", error);
      toast.error("Erro ao carregar plano");
      router.push("/super-admin/plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.name.trim()) {
      toast.error("Nome do plano é obrigatório");
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Preço inválido");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/super-admin/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxBarbers: parseInt(formData.maxBarbers) || 0,
          maxServices: parseInt(formData.maxServices) || 0,
          maxServiceOptions: parseInt(formData.maxServiceOptions) || 0,
          maxBookingsPerMonth: parseInt(formData.maxBookingsPerMonth) || 0,
          maxBarberShops: parseInt(formData.maxBarberShops) || 0,
          maxStorageMB: parseInt(formData.maxStorageMB) || 0,
          trialDays: parseInt(formData.trialDays) || 14,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar plano");
      }

      toast.success("Plano atualizado com sucesso!");
      router.push("/super-admin/plans");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar plano");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
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
        router.push("/super-admin/plans");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao deletar plano");
      }
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      toast.error("Erro ao deletar plano");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Carregando plano...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/super-admin/plans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Editar Plano: {plan?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Atualize as configurações do plano
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={saving}>
          <Trash2 className="h-4 w-4 mr-2" />
          Deletar
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais do plano de assinatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Starter, Pro, Enterprise"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={e =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="period">Período *</Label>
                  <Select
                    value={formData.period}
                    onValueChange={value =>
                      setFormData({ ...formData, period: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva o plano..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Plano ativo e visível
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={checked =>
                    setFormData({ ...formData, status: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Limites e Recursos */}
          <Card>
            <CardHeader>
              <CardTitle>Limites e Recursos</CardTitle>
              <CardDescription>
                Configure os limites e recursos do plano
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxBarbers">Barbeiros (0 = Ilimitado)</Label>
                  <Input
                    id="maxBarbers"
                    type="number"
                    min="0"
                    value={formData.maxBarbers}
                    onChange={e =>
                      setFormData({ ...formData, maxBarbers: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxServices">Serviços (0 = Ilimitado)</Label>
                  <Input
                    id="maxServices"
                    type="number"
                    min="0"
                    value={formData.maxServices}
                    onChange={e =>
                      setFormData({ ...formData, maxServices: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxBookingsPerMonth">
                    Agendamentos/mês (0 = Ilimitado)
                  </Label>
                  <Input
                    id="maxBookingsPerMonth"
                    type="number"
                    min="0"
                    value={formData.maxBookingsPerMonth}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxBookingsPerMonth: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxBarberShops">
                    Barbearias (0 = Ilimitado)
                  </Label>
                  <Input
                    id="maxBarberShops"
                    type="number"
                    min="0"
                    value={formData.maxBarberShops}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxBarberShops: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxStorageMB">
                  Armazenamento (MB, 0 = Ilimitado)
                </Label>
                <Input
                  id="maxStorageMB"
                  type="number"
                  min="0"
                  value={formData.maxStorageMB}
                  onChange={e =>
                    setFormData({ ...formData, maxStorageMB: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="trialDays">Dias de Trial</Label>
                <Input
                  id="trialDays"
                  type="number"
                  min="0"
                  value={formData.trialDays}
                  onChange={e =>
                    setFormData({ ...formData, trialDays: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requiresCard">Requer Cartão</Label>
                  <p className="text-sm text-muted-foreground">
                    Exige cartão para trial
                  </p>
                </div>
                <Switch
                  id="requiresCard"
                  checked={formData.requiresCard}
                  onCheckedChange={checked =>
                    setFormData({ ...formData, requiresCard: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades Premium */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Funcionalidades Premium</CardTitle>
              <CardDescription>
                Ative ou desative funcionalidades do plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasAnalytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Relatórios e análises avançadas
                    </p>
                  </div>
                  <Switch
                    id="hasAnalytics"
                    checked={formData.hasAnalytics}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasAnalytics: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasCustomDomain">Domínio Customizado</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir domínio próprio
                    </p>
                  </div>
                  <Switch
                    id="hasCustomDomain"
                    checked={formData.hasCustomDomain}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasCustomDomain: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasWhiteLabel">White Label</Label>
                    <p className="text-sm text-muted-foreground">
                      Remover marca BarberBoss
                    </p>
                  </div>
                  <Switch
                    id="hasWhiteLabel"
                    checked={formData.hasWhiteLabel}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasWhiteLabel: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasAPI">API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Acesso à API REST
                    </p>
                  </div>
                  <Switch
                    id="hasAPI"
                    checked={formData.hasAPI}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasAPI: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasPrioritySupport">
                      Suporte Prioritário
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Suporte com prioridade
                    </p>
                  </div>
                  <Switch
                    id="hasPrioritySupport"
                    checked={formData.hasPrioritySupport}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasPrioritySupport: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasNotifications">Notificações</Label>
                    <p className="text-sm text-muted-foreground">
                      Sistema de notificações
                    </p>
                  </div>
                  <Switch
                    id="hasNotifications"
                    checked={formData.hasNotifications}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasNotifications: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/super-admin/plans")}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
