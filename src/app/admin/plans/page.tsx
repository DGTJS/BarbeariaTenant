"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Switch } from "@/_components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_components/ui/table";
import { Badge } from "@/_components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { Plus, Edit, Trash2, CreditCard, Users, Settings } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly?: number;
  allowFranchises?: boolean;
  franchiseExtraFee?: number;
  limits?: Record<string, number>;
  description?: string;
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Plan>>({ name: "", priceMonthly: 0, limits: {} });
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/services-list');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    })();
  }, []);

  const createPlan = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", priceMonthly: 0, allowFranchises: false, franchiseExtraFee: 0, limits: {} });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const removePlan = async (id: string) => {
    await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
    await load();
  };

  const startEdit = (plan: Plan) => {
    setEditPlan({ ...plan });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    if (!editPlan) return;
    await fetch("/api/admin/plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPlan),
    });
    setOpenEdit(false);
    setEditPlan(null);
    await load();
  };

  if (loading) return <div className="p-4 sm:p-6">Carregando planos...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            Planos SaaS
          </h1>
          <p className="text-muted-foreground">Gerencie os planos que serão oferecidos para as barbearias</p>
        </div>

        <Alert className="mb-6">
          <Settings className="h-4 w-4" />
          <AlertDescription>
            Estes são os planos do SaaS que você oferece para as barbearias. As barbearias assinam estes planos para usar o sistema.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Planos Cadastrados
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar Novo Plano
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Planos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                {plans.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum plano cadastrado ainda.</p>
                    <p className="text-sm text-muted-foreground">Crie seu primeiro plano para começar.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Preço Mensal</TableHead>
                        <TableHead>Preço Anual</TableHead>
                        <TableHead>Franquias</TableHead>
                        <TableHead>Taxa Extra</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.map(plan => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell>R$ {plan.priceMonthly?.toFixed(2)}</TableCell>
                          <TableCell>
                            {plan.priceYearly ? `R$ ${plan.priceYearly.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={plan.allowFranchises ? "default" : "secondary"}>
                              {plan.allowFranchises ? "Sim" : "Não"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {plan.franchiseExtraFee ? `R$ ${plan.franchiseExtraFee.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => startEdit(plan)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => removePlan(plan.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Criar Novo Plano
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Plano</Label>
                    <Input 
                      id="name" 
                      value={form.name || ""} 
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ex: Básico, Premium, Enterprise"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pm">Preço Mensal (BRL)</Label>
                    <Input 
                      id="pm" 
                      type="number" 
                      value={form.priceMonthly ?? 0} 
                      onChange={e => setForm(f => ({ ...f, priceMonthly: Number(e.target.value) }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="py">Preço Anual (opcional)</Label>
                  <Input 
                    id="py" 
                    type="number" 
                    value={form.priceYearly ?? 0} 
                    onChange={e => setForm(f => ({ ...f, priceYearly: Number(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Permitir Franquias</h3>
                      <p className="text-sm text-muted-foreground">Libera criação de múltiplas barbearias</p>
                    </div>
                    <Switch 
                      checked={!!form.allowFranchises} 
                      onCheckedChange={(v) => setForm(f => ({ ...f, allowFranchises: v }))} 
                    />
                  </div>

                  <div>
                    <Label htmlFor="fee">Taxa adicional por franquia</Label>
                    <Input 
                      id="fee" 
                      type="number" 
                      value={form.franchiseExtraFee ?? 0} 
                      onChange={e => setForm(f => ({ ...f, franchiseExtraFee: Number(e.target.value) }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Serviços incluídos e limites</h3>
                    <p className="text-sm text-muted-foreground">Selecione os serviços e informe quantas utilizações por ciclo</p>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-auto border rounded-md p-4">
                    {services.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum serviço cadastrado. Cadastre serviços primeiro.
                      </p>
                    ) : (
                      services.map(s => {
                        const qty = form.limits?.[s.id] ?? 0;
                        return (
                          <div key={s.id} className="flex items-center justify-between gap-3 p-2 hover:bg-muted/50 rounded">
                            <label className="text-sm flex-1">{s.name}</label>
                            <Input
                              type="number"
                              className="w-28"
                              min={0}
                              value={qty}
                              onChange={e => setForm(f => ({ ...f, limits: { ...(f.limits || {}), [s.id]: Number(e.target.value) } }))}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <Button onClick={createPlan} disabled={saving} className="w-full">
                  {saving ? "Salvando..." : "Criar Plano"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de edição */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
          </DialogHeader>
          {editPlan && (
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={editPlan.name} onChange={e => setEditPlan(pl => pl ? { ...pl, name: e.target.value } : pl)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Mensal</Label>
                  <Input type="number" value={editPlan.priceMonthly} onChange={e => setEditPlan(pl => pl ? { ...pl, priceMonthly: Number(e.target.value) } : pl)} />
                </div>
                <div>
                  <Label>Anual</Label>
                  <Input type="number" value={editPlan.priceYearly ?? 0} onChange={e => setEditPlan(pl => pl ? { ...pl, priceYearly: Number(e.target.value) } : pl)} />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">Permitir Franquias</h3>
                  <p className="text-sm text-muted-foreground">Libera criação de múltiplas barbearias</p>
                </div>
                <Switch checked={!!editPlan.allowFranchises} onCheckedChange={(v) => setEditPlan(pl => pl ? { ...pl, allowFranchises: v } : pl)} />
              </div>
              <div>
                <Label>Taxa adicional por franquia</Label>
                <Input type="number" value={editPlan.franchiseExtraFee ?? 0} onChange={e => setEditPlan(pl => pl ? { ...pl, franchiseExtraFee: Number(e.target.value) } : pl)} />
              </div>
              <div className="space-y-2">
                <div className="font-medium">Serviços incluídos e limites</div>
                <div className="space-y-2 max-h-64 overflow-auto border rounded-md p-3">
                  {services.map(s => {
                    const qty = editPlan.limits?.[s.id] ?? 0;
                    return (
                      <div key={s.id} className="flex items-center justify-between gap-3">
                        <label className="text-sm flex-1">{s.name}</label>
                        <Input
                          type="number"
                          className="w-28"
                          min={0}
                          value={qty}
                          onChange={e => setEditPlan(pl => pl ? { ...pl, limits: { ...(pl.limits || {}), [s.id]: Number(e.target.value) } } : pl)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
                <Button onClick={saveEdit}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


