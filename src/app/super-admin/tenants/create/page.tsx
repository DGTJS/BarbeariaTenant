"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
}

export default function CreateTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    planId: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/super-admin/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data.filter((p: any) => p.status));
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      toast.error("Erro ao carregar planos");
    }
  };

  const handleSubdomainChange = (value: string) => {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .substring(0, 50);

    setFormData({ ...formData, subdomain: cleaned });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/super-admin/tenants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar tenant");
      }

      const data = await response.json();
      toast.success("Tenant criado com sucesso!");
      router.push("/super-admin");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criar Novo Tenant</h1>
          <p className="text-muted-foreground mt-1">
            Adicione um novo cliente ao sistema
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/super-admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Tenant</CardTitle>
          <CardDescription>
            Preencha as informações básicas do novo tenant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nome da Barbearia *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Barbearia Moderna"
                />
              </div>

              <div>
                <Label htmlFor="subdomain">Subdomínio *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    required
                    value={formData.subdomain}
                    onChange={e => handleSubdomainChange(e.target.value)}
                    placeholder="sua-barbearia"
                    pattern="[a-z0-9-]+"
                  />
                  <span className="text-muted-foreground whitespace-nowrap">
                    .barberboss.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Apenas letras, números e hífens
                </p>
              </div>

              <div>
                <Label htmlFor="ownerName">Nome do Dono *</Label>
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

              <div>
                <Label htmlFor="ownerEmail">Email do Dono *</Label>
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
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="planId">Plano *</Label>
                <Select
                  value={formData.planId}
                  onValueChange={value =>
                    setFormData({ ...formData, planId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - R$ {plan.price}/{plan.period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/super-admin">Cancelar</Link>
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
                    Criar Tenant
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

