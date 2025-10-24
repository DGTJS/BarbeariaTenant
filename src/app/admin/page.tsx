"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { 
  CalendarIcon, 
  UsersIcon, 
  ScissorsIcon, 
  DollarSignIcon, 
  TrendingUpIcon, 
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ActivityIcon,
  StarIcon,
  Sparkles,
  Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import LoadingScreen from "@/_components/loading-screen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalBarbers: number;
  totalServices: number;
  todayBookings: number;
  pendingBookings: number;
  averageRating: number;
  recentBookings: any[];
  weeklyData: any[];
  serviceDistribution: any[];
  barberPerformance: any[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<string>("7days");

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/dashboard?range=${dateRange}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeLabel = () => {
    switch(dateRange) {
      case "today": return "Hoje";
      case "7days": return "Últimos 7 dias";
      case "30days": return "Últimos 30 dias";
      case "future7": return "Próximos 7 dias";
      case "future30": return "Próximos 30 dias";
      case "all": return "Todo o período";
      default: return "Período";
    }
  };

  if (loading) {
    return <LoadingScreen message="Carregando dashboard" />;
  }

  if (!stats) {
    return (
      <div className="p-6">
        <p>Erro ao carregar dados</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "Confirmado";
      case "pending": return "Pendente";
      case "cancelled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-background to-muted/20 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do seu negócio • {getDateRangeLabel()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[200px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">📅 Hoje</SelectItem>
                <SelectItem value="7days">📊 Últimos 7 dias</SelectItem>
                <SelectItem value="30days">📈 Últimos 30 dias</SelectItem>
                <SelectItem value="future7">🔮 Próximos 7 dias</SelectItem>
                <SelectItem value="future30">🚀 Próximos 30 dias</SelectItem>
                <SelectItem value="all">🌍 Todo o período</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Relatório
            </Button>
          </div>
        </div>

        {/* KPI Cards com Gradiente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Total de Agendamentos
              </CardTitle>
              <CalendarIcon className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBookings || 0}</div>
              <div className="flex items-center mt-2 text-sm text-white/80">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>12% vs mês passado</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Receita Total
              </CardTitle>
              <DollarSignIcon className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R$ {(stats.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center mt-2 text-sm text-white/80">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>18% vs mês passado</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Barbeiros Ativos
              </CardTitle>
              <UsersIcon className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBarbers || 0}</div>
              <div className="flex items-center mt-2 text-sm text-white/80">
                <ActivityIcon className="h-4 w-4 mr-1" />
                <span>Todos disponíveis</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Avaliação Média
              </CardTitle>
              <StarIcon className="h-5 w-5 text-white/80 fill-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(stats.averageRating || 0).toFixed(1)}
              </div>
              <div className="flex items-center mt-2 text-sm text-white/80">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>0.3 vs mês passado</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico de Receita Semanal - Area Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-primary" />
                Receita Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.weeklyData || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Serviços - Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScissorsIcon className="h-5 w-5 text-primary" />
                Distribuição de Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.serviceDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(stats.serviceDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance dos Barbeiros e Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Performance dos Barbeiros - Bar Chart */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-primary" />
                Performance dos Barbeiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.barberPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cards de Status Hoje */}
          <div className="space-y-6">
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.todayBookings || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Agendamentos confirmados
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ActivityIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {stats.pendingBookings || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Aguardando confirmação
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Agendamentos Recentes */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Agendamentos Recentes
              </span>
              <Badge variant="outline" className="text-xs">
                Últimos 5
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats.recentBookings || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento encontrado
                </div>
              ) : (
                (stats.recentBookings || []).map((booking: any) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all bg-card"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)} shadow-lg`}></div>
                      <div>
                        <p className="font-semibold">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.service} • {booking.barber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{booking.time}</p>
                        <p className="text-sm font-semibold text-green-600">
                          R$ {booking.price.toFixed(2)}
                        </p>
                      </div>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        className="min-w-[100px] justify-center"
                      >
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" size="lg">
                Ver Todos os Agendamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
