"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Plus, Tag, Calendar, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Promotion {
  id: string;
  name: string;
  description?: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  validFrom: string;
  validUntil?: string;
  status: boolean;
  createdAt: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      // TODO: Implementar API endpoint
      // const response = await fetch("/api/super-admin/promotions");
      // if (response.ok) {
      //   const data = await response.json();
      //   setPromotions(data);
      // } else {
      //   toast.error("Erro ao buscar promoções.");
      // }
      toast.info("Funcionalidade em desenvolvimento");
    } catch (error) {
      console.error("Erro ao buscar promoções:", error);
      toast.error("Erro ao buscar promoções.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promoções</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie códigos promocionais e descontos
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/promotions/create">
            <Plus className="h-4 w-4 mr-2" />
            Nova Promoção
          </Link>
        </Button>
      </div>

      {/* Lista de Promoções */}
      <Card>
        <CardHeader>
          <CardTitle>Promoções Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma promoção cadastrada</p>
              <p className="text-sm mt-2">
                Crie sua primeira promoção para começar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {promotions.map(promotion => (
                <Card
                  key={promotion.id}
                  className="hover:border-primary/50 transition"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {promotion.name}
                          </h3>
                          <Badge
                            variant={promotion.status ? "default" : "secondary"}
                          >
                            {promotion.status ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {promotion.description}
                        </p>
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Código:
                            </span>
                            <p className="font-mono font-medium">
                              {promotion.code}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Desconto:
                            </span>
                            <p className="font-medium">
                              {promotion.discountType === "percentage"
                                ? `${promotion.discountValue}%`
                                : `R$ ${promotion.discountValue}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Uso:</span>
                            <p className="font-medium">
                              {promotion.currentUses} /{" "}
                              {promotion.maxUses || "∞"}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Válido até:
                            </span>
                            <p className="font-medium">
                              {promotion.validUntil
                                ? new Date(
                                    promotion.validUntil
                                  ).toLocaleDateString("pt-BR")
                                : "Sem limite"}
                            </p>
                          </div>
                        </div>
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
