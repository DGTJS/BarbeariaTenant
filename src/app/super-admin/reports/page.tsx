"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  type: string;
  period: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // TODO: Implementar API endpoint
      // const response = await fetch(`/api/super-admin/reports?period=${selectedPeriod}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setReports(data);
      // } else {
      //   toast.error("Erro ao buscar relatórios.");
      // }
      toast.info("Funcionalidade em desenvolvimento");
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      toast.error("Erro ao buscar relatórios.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    try {
      // TODO: Implementar API endpoint
      toast.info(`Gerando relatório de ${type}...`);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Análises e relatórios do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="day">Dia</option>
            <option value="week">Semana</option>
            <option value="month">Mês</option>
            <option value="year">Ano</option>
          </select>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Tenants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
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
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => generateReport("revenue")}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Relatório de Receita</p>
                  <p className="text-xs text-muted-foreground">
                    Análise financeira detalhada
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => generateReport("tenants")}
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Relatório de Tenants</p>
                  <p className="text-xs text-muted-foreground">
                    Estatísticas de uso e crescimento
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => generateReport("bookings")}
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Relatório de Agendamentos</p>
                  <p className="text-xs text-muted-foreground">
                    Análise de agendamentos
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => generateReport("general")}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Relatório Geral</p>
                  <p className="text-xs text-muted-foreground">
                    Visão geral do sistema
                  </p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum relatório gerado ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map(report => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{report.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.generatedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
