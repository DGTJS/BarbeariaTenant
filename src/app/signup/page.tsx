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
import { Badge } from "@/_components/ui/badge";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  trialDays: number;
  maxBarbers: number;
  maxServices: number;
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    planId: "",
  });

  // Buscar planos ao carregar
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
    }
  };

  const handleSubdomainChange = (value: string) => {
    // Limpar e validar subdomínio
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .substring(0, 50);

    setFormData({ ...formData, subdomain: cleaned });
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({ ...formData, planId: plan.id });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Integrar com Asaas para capturar cartão
      // Por enquanto, apenas criar tenant

      const response = await fetch("/api/super-admin/tenants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          planId: selectedPlan?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar conta");
      }

      const data = await response.json();

      toast.success("Conta criada com sucesso! Redirecionando...");

      // Redirecionar para o subdomínio do tenant
      setTimeout(() => {
        window.location.href = `https://${formData.subdomain}.barberboss.com`;
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Criar sua Conta</h1>
          <p className="text-muted-foreground">
            Comece seu trial grátis de {selectedPlan?.trialDays || 14} dias
          </p>
        </div>

        {/* Step 1: Seleção de Plano */}
        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <Card
                key={plan.id}
                className="cursor-pointer hover:border-primary transition"
                onClick={() => handlePlanSelect(plan)}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">R$ {plan.price}</span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <Badge className="mt-2">{plan.trialDays} dias grátis</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      {plan.maxBarbers || "Ilimitados"} barbeiros
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      {plan.maxServices || "Ilimitados"} serviços
                    </li>
                  </ul>
                  <Button className="w-full mt-4">
                    Escolher Plano
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Formulário de Cadastro */}
        {step === 2 && selectedPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da Sua Barbearia</CardTitle>
              <CardDescription>
                Plano selecionado: <strong>{selectedPlan.name}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <span className="text-muted-foreground">
                      .barberboss.com
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Apenas letras, números e hífens
                  </p>
                </div>

                <div>
                  <Label htmlFor="ownerName">Seu Nome *</Label>
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
                  <Label htmlFor="ownerEmail">Seu Email *</Label>
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
