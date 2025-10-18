"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Star,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

interface ReportData {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  topServices: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  topBarbers: Array<{
    name: string;
    bookings: number;
    rating: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  dailyStats: {
    todayBookings: number;
    todayRevenue: number;
    pendingBookings: number;
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // últimos 30 dias

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ReportData = {
        totalRevenue: 12450.00,
        totalBookings: 156,
        averageRating: 4.7,
        topServices: [
          { name: "Corte Masculino", bookings: 45, revenue: 1575.00 },
          { name: "Barba Completa", bookings: 38, revenue: 950.00 },
          { name: "Sobrancelha", bookings: 25, revenue: 375.00 },
          { name: "Corte + Barba", bookings: 20, revenue: 1200.00 }
        ],
        topBarbers: [
          { name: "Carlos Santos", bookings: 45, rating: 4.9 },
          { name: "Ana Costa", bookings: 38, rating: 4.8 },
          { name: "Pedro Silva", bookings: 32, rating: 4.6 },
          { name: "Maria Oliveira", bookings: 28, rating: 4.7 }
        ],
        monthlyData: [
          { month: "Jan", revenue: 3200, bookings: 42 },
          { month: "Fev", revenue: 2800, bookings: 38 },
          { month: "Mar", revenue: 3500, bookings: 45 },
          { month: "Abr", revenue: 2950, bookings: 31 }
        ],
        dailyStats: {
          todayBookings: 12,
          todayRevenue: 450.00,
          pendingBookings: 3
        }
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implementar exportação de relatório
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando relatórios...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p>Erro ao carregar dados dos relatórios</p>
            <Button onClick={loadReportData} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Relatórios e Analytics
              </h1>
              <p className="text-muted-foreground">
                Acompanhe o desempenho da sua barbearia
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {reportData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% em relação ao período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% em relação ao período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +0.2 em relação ao período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.dailyStats.todayBookings}</div>
              <p className="text-xs text-muted-foreground">
                R$ {reportData.dailyStats.todayRevenue.toFixed(2)} em receita
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Serviços mais populares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Serviços Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topServices.map((service, index) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.bookings} agendamentos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        R$ {service.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Barbeiros com melhor desempenho */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Melhores Barbeiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topBarbers.map((barber, index) => (
                  <div key={barber.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{barber.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {barber.bookings} agendamentos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{barber.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados mensais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Desempenho Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportData.monthlyData.map((month) => (
                <div key={month.month} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{month.month}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Receita: R$ {month.revenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agendamentos: {month.bookings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
