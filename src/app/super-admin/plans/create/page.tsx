"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreatePlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    period: "monthly",
    description: "",
    status: true,
    maxBarbers: "3",
    maxServices: "10",
    maxServiceOptions: "5",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/super-admin/plans", {
        method: "POST",
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
        throw new Error(error.error || "Erro ao criar plano");
      }

      toast.success("Plano criado com sucesso!");
      router.push("/super-admin/plans");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar plano");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Criar Novo Plano
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure um novo plano de assinatura
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/super-admin/plans">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais do plano</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Starter"
                />
              </div>

              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={e =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="97.00"
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

              <div>
                <Label htmlFor="trialDays">Dias de Trial *</Label>
                <Input
                  id="trialDays"
                  type="number"
                  required
                  value={formData.trialDays}
                  onChange={e =>
                    setFormData({ ...formData, trialDays: e.target.value })
                  }
                  placeholder="14"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição do plano..."
                />
              </div>
            </div>

            {/* Limites */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Limites</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxBarbers">Barbeiros (0 = ilimitado)</Label>
                  <Input
                    id="maxBarbers"
                    type="number"
                    value={formData.maxBarbers}
                    onChange={e =>
                      setFormData({ ...formData, maxBarbers: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxServices">Serviços (0 = ilimitado)</Label>
                  <Input
                    id="maxServices"
                    type="number"
                    value={formData.maxServices}
                    onChange={e =>
                      setFormData({ ...formData, maxServices: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxServiceOptions">
                    Opções por Serviço (0 = ilimitado)
                  </Label>
                  <Input
                    id="maxServiceOptions"
                    type="number"
                    value={formData.maxServiceOptions}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxServiceOptions: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxBookingsPerMonth">
                    Agendamentos/mês (0 = ilimitado)
                  </Label>
                  <Input
                    id="maxBookingsPerMonth"
                    type="number"
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
                    Barbearias (0 = ilimitado)
                  </Label>
                  <Input
                    id="maxBarberShops"
                    type="number"
                    value={formData.maxBarberShops}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxBarberShops: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxStorageMB">
                    Armazenamento MB (0 = ilimitado)
                  </Label>
                  <Input
                    id="maxStorageMB"
                    type="number"
                    value={formData.maxStorageMB}
                    onChange={e =>
                      setFormData({ ...formData, maxStorageMB: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Funcionalidades */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Funcionalidades</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasAnalytics">Analytics</Label>
                  <Switch
                    id="hasAnalytics"
                    checked={formData.hasAnalytics}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasAnalytics: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasNotifications">Notificações</Label>
                  <Switch
                    id="hasNotifications"
                    checked={formData.hasNotifications}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasCustomDomain">Domínio Customizado</Label>
                  <Switch
                    id="hasCustomDomain"
                    checked={formData.hasCustomDomain}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasCustomDomain: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasWhiteLabel">White Label</Label>
                  <Switch
                    id="hasWhiteLabel"
                    checked={formData.hasWhiteLabel}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasWhiteLabel: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasAPI">API</Label>
                  <Switch
                    id="hasAPI"
                    checked={formData.hasAPI}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasAPI: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasPrioritySupport">
                    Suporte Prioritário
                  </Label>
                  <Switch
                    id="hasPrioritySupport"
                    checked={formData.hasPrioritySupport}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, hasPrioritySupport: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requiresCard">Requer Cartão no Trial</Label>
                  <Switch
                    id="requiresCard"
                    checked={formData.requiresCard}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, requiresCard: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/super-admin/plans">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Criar Plano
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
