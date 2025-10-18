"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Phone,
  Mail,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CalendarDays,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Loader2,
  X
} from "lucide-react";
import BookingCalendar from "@/_components/booking-calendar";

interface Booking {
  id: string;
  dateTime: string;
  status: string;
  rating?: number;
  comment?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };
  service: {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    imageUrl: string;
  };
  barber: {
    id: string;
    name: string;
    photo: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  todayRevenue: number;
  avgRating: number;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    todayRevenue: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [expandedBookings, setExpandedBookings] = useState<Set<string>>(new Set());
  const [newDateTime, setNewDateTime] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("email");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Carregar dados do banco
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/bookings?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar agendamentos');
      }
      
      const data = await response.json();
      setBookings(data);
      
      // Calcular estatísticas
      const total = data.length;
      const confirmed = data.filter((b: Booking) => b.status === "Confirmada").length;
      const pending = data.filter((b: Booking) => b.status === "Pendente").length;
      const cancelled = data.filter((b: Booking) => b.status === "Cancelada").length;
      const todayRevenue = data
        .filter((b: Booking) => {
          const bookingDate = new Date(b.dateTime);
          const today = new Date();
          return bookingDate.toDateString() === today.toDateString() && b.status === "Confirmada";
        })
        .reduce((sum: number, b: Booking) => sum + b.service.price, 0);
      const avgRating = data
        .filter((b: Booking) => b.rating)
        .reduce((sum: number, b: Booking) => sum + (b.rating || 0), 0) / 
        data.filter((b: Booking) => b.rating).length || 0;

      setStats({
        total,
        confirmed,
        pending,
        cancelled,
        todayRevenue,
        avgRating: Math.round(avgRating * 10) / 10
      });
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  useEffect(() => {
    loadBookings();
  }, [filter, searchTerm]);

  const handleStatusChange = useCallback(async (bookingId: string, newStatus: string) => {
    // Adicionar o booking ao loading individual
    setLoadingBookings(prev => new Set(prev).add(bookingId));
    
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      // Atualizar o estado local sem recarregar a página
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do agendamento');
    } finally {
      // Remover o booking do loading individual
      setLoadingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  }, []);

  const handleReschedule = async () => {
    if (!selectedBooking || !newDateTime) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedBooking.id,
          dateTime: newDateTime
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao reagendar');
      }

      await loadBookings();
      setShowRescheduleModal(false);
      setSelectedBooking(null);
      setNewDateTime("");
    } catch (error) {
      console.error('Erro ao reagendar:', error);
      alert('Erro ao reagendar agendamento');
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedBooking || !messageText) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          message: messageText,
          type: messageType
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      alert('Mensagem enviada com sucesso!');
      setShowMessageModal(false);
      setSelectedBooking(null);
      setMessageText("");
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setSaving(false);
    }
  };

  const toggleExpanded = useCallback((bookingId: string) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      // Se o card já está expandido, fecha ele
      newExpanded.delete(bookingId);
    } else {
      // Se o card não está expandido, fecha todos os outros e abre apenas este
      newExpanded.clear();
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  }, [expandedBookings]);

  const getStatusColor = useCallback((status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "CONFIRMED":
      case "CONFIRMADA":
        return "bg-emerald-500";
      case "PENDING":
      case "PENDENTE":
        return "bg-amber-500";
      case "CANCELLED":
      case "CANCELADA":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "CONFIRMED":
      case "CONFIRMADA":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
      case "PENDENTE":
        return <AlertCircle className="h-4 w-4" />;
      case "CANCELLED":
      case "CANCELADA":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "CONFIRMED":
      case "CONFIRMADA":
        return "Confirmado";
      case "PENDING":
      case "PENDENTE":
        return "Aguardando";
      case "CANCELLED":
      case "CANCELADA":
        return "Cancelado";
      default:
        return status;
    }
  }, []);

  const formatDateTime = useCallback((dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-lg">Carregando agendamentos...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard de Agendamentos
              </h1>
              <p className="text-muted-foreground text-lg">
                Gerencie todos os agendamentos da sua barbearia
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Lista
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendário
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar agendamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todos</option>
                <option value="Confirmada">Confirmados</option>
                <option value="Pendente">Pendentes</option>
                <option value="Cancelada">Cancelados</option>
              </select>
              <Button variant="outline" onClick={loadBookings} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.confirmed}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aguardando</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.cancelled}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cancelados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    R$ {stats.todayRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receita Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avaliação</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualização de agendamentos */}
        {viewMode === 'calendar' ? (
          <BookingCalendar 
            bookings={bookings} 
            onDateSelect={(date) => {
              // Filtrar agendamentos para a data selecionada
              const dateStr = date.toDateString();
              const dayBookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.dateTime);
                return bookingDate.toDateString() === dateStr;
              });
              // Aqui você pode implementar lógica adicional se necessário
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bookings
            .sort((a, b) => {
              // Card expandido sempre aparece primeiro
              const aExpanded = expandedBookings.has(a.id);
              const bExpanded = expandedBookings.has(b.id);
              
              if (aExpanded && !bExpanded) return -1;
              if (!aExpanded && bExpanded) return 1;
              return 0;
            })
            .map((booking) => {
            const isExpanded = expandedBookings.has(booking.id);
            const { date, time } = formatDateTime(booking.dateTime);
            
            return (
              <Card 
                key={booking.id} 
                className={`group border border-border/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                  isExpanded ? 'ring-2 ring-primary/20 col-span-full' : 'h-72'
                }`}
                onClick={() => toggleExpanded(booking.id)}
              >
                <CardContent className={`${isExpanded ? 'p-6' : 'p-3 h-full flex flex-col'}`}>
                  {!isExpanded ? (
                    // Card compacto elegante
                    <div className="flex flex-col h-full">
                      {/* Header com avatar e status */}
                      <div className="flex items-center justify-between mb-2">
                        <Avatar className="h-8 w-8 ring-2 ring-white shadow-lg">
                          <AvatarImage src={booking.user.image} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
                            {booking.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Badge 
                          variant={booking.status.toUpperCase() === "CONFIRMED" || booking.status === "Confirmada" ? "default" : 
                                  booking.status.toUpperCase() === "PENDING" || booking.status === "Pendente" ? "secondary" : "destructive"}
                          className="flex items-center space-x-1 px-1.5 py-0.5 text-xs shadow-sm"
                        >
                          {getStatusIcon(booking.status)}
                          <span className="hidden sm:inline">{getStatusText(booking.status)}</span>
                        </Badge>
                      </div>
                      
                    {/* Informações principais */}
                      <div className="mb-2">
                        <h3 className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate">
                          {booking.user.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {booking.service.name}
                        </p>
                      </div>
                      
                      {/* Data e hora */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 mb-2">
                        <div className="flex items-center space-x-1 text-xs">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">{time}</span>
                        </div>
                      </div>
                      
                      {/* Preço e barbeiro */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-gray-100">
                            R$ {booking.service.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{booking.service.duration} min</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={booking.barber.photo} />
                            <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                              {booking.barber.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate max-w-[40px]">
                            {booking.barber.name}
                          </p>
                        </div>
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="mt-auto space-y-1">
                        {/* Botões de ação para agendamentos pendentes e confirmados */}
                        {(() => {
                          const normalizedStatus = booking.status.toUpperCase();
                          const canCancel = normalizedStatus === "PENDING" || normalizedStatus === "PENDENTE" || 
                                           normalizedStatus === "CONFIRMED" || normalizedStatus === "CONFIRMADA";
                          return canCancel;
                        })() && (
                          <div className="flex space-x-1">
                            {/* Botão Confirmar - apenas para agendamentos pendentes */}
                            {(() => {
                              const normalizedStatus = booking.status.toUpperCase();
                              const isPending = normalizedStatus === "PENDING" || normalizedStatus === "PENDENTE";
                              return isPending;
                            })() && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(booking.id, "Confirmada");
                                }}
                                disabled={loadingBookings.has(booking.id)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-6 px-2"
                              >
                                {loadingBookings.has(booking.id) ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                )}
                                <span className="hidden sm:inline">Confirmar</span>
                              </Button>
                            )}
                            
                            {/* Botão Cancelar - para agendamentos pendentes e confirmados */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(booking.id, "Cancelada");
                              }}
                              disabled={loadingBookings.has(booking.id)}
                              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 text-xs h-6 px-2"
                            >
                              {loadingBookings.has(booking.id) ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              <span className="hidden sm:inline">Cancelar</span>
                            </Button>
                          </div>
                        )}
                        
                        {/* Botão para ver detalhes */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(booking.id);
                          }}
                          className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 text-xs h-6"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Detalhes</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Card expandido com todos os detalhes
                    <div className="space-y-4">
                      {/* Header expandido */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.user.image} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {booking.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.user.name}</h3>
                            <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={booking.status.toUpperCase() === "CONFIRMED" || booking.status === "Confirmada" ? "default" : 
                                    booking.status.toUpperCase() === "PENDING" || booking.status === "Pendente" ? "secondary" : "destructive"}
                            className="flex items-center space-x-1 px-3 py-1"
                          >
                            {getStatusIcon(booking.status)}
                            <span>{getStatusText(booking.status)}</span>
                          </Badge>
                          
                          <div className="text-right">
                            <p className="font-semibold text-lg">R$ {booking.service.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{booking.service.duration} min</p>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(booking.id);
                            }}
                            className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Informações detalhadas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Informações do Cliente</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.user.email}</span>
                          </div>
                          {booking.user.phone && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Detalhes do Agendamento</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{date}</span>
                        </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{time}</span>
                        </div>
                              <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                                <span>{booking.barber.name}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Scissors className="h-4 w-4 text-muted-foreground" />
                                <span>{booking.service.name} ({booking.service.duration} min)</span>
                              </div>
                        </div>
                      </div>
                    </div>

                        <div className="space-y-4">
                          {booking.comment && (
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">Comentário</h4>
                              <p className="text-sm bg-muted/50 p-3 rounded-lg">{booking.comment}</p>
                            </div>
                          )}
                          
                        {booking.rating && (
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">Avaliação</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{booking.rating}/5</span>
                              </div>
                          </div>
                        )}
                        </div>
                      </div>

                      {/* Botões de ação */}
                      <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-border/50">
                        {(() => {
                          const normalizedStatus = booking.status.toUpperCase();
                          const canCancel = normalizedStatus === "PENDING" || normalizedStatus === "PENDENTE" || 
                                           normalizedStatus === "CONFIRMED" || normalizedStatus === "CONFIRMADA";
                          return canCancel;
                        })() && (
                          <>
                            {/* Botão Confirmar - apenas para agendamentos pendentes */}
                            {(() => {
                              const normalizedStatus = booking.status.toUpperCase();
                              const isPending = normalizedStatus === "PENDING" || normalizedStatus === "PENDENTE";
                              return isPending;
                            })() && (
                            <Button
                              size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(booking.id, "Confirmada");
                                }}
                                disabled={loadingBookings.has(booking.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                {loadingBookings.has(booking.id) ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                              Confirmar
                            </Button>
                            )}
                            
                            {/* Botão Cancelar - para agendamentos pendentes e confirmados */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(booking.id, "Cancelada");
                              }}
                              disabled={loadingBookings.has(booking.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                            >
                              {loadingBookings.has(booking.id) ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Cancelar
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setShowRescheduleModal(true);
                          }}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Reagendar
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setShowMessageModal(true);
                          }}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Mensagem
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {bookings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-muted-foreground text-lg">
                  {searchTerm || filter !== "all" 
                    ? "Tente ajustar os filtros de busca"
                    : "Não há agendamentos cadastrados ainda"
                  }
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        )}

        {/* Modal de Reagendamento */}
        {showRescheduleModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  Reagendar Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Cliente: {selectedBooking.user.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    Serviço: {selectedBooking.service.name}
                  </p>
                </div>
                <div>
                  <Label htmlFor="newDateTime">Nova Data e Hora</Label>
                  <Input
                    id="newDateTime"
                    type="datetime-local"
                    value={newDateTime}
                    onChange={(e) => setNewDateTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleReschedule} 
                    disabled={saving || !newDateTime}
                    className="flex-1"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Reagendando..." : "Reagendar"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setSelectedBooking(null);
                      setNewDateTime("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de Mensagem */}
        {showMessageModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Enviar Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Para: {selectedBooking.user.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.user.email}
                  </p>
                </div>
                <div>
                  <Label htmlFor="messageType">Tipo de Mensagem</Label>
                  <select
                    id="messageType"
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    className="w-full p-2 border border-input bg-background rounded-md"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="messageText">Mensagem</Label>
                  <textarea
                    id="messageText"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-2 border border-input bg-background rounded-md h-24 resize-none"
                    placeholder="Digite sua mensagem..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={saving || !messageText}
                    className="flex-1"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Enviando..." : "Enviar"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowMessageModal(false);
                      setSelectedBooking(null);
                      setMessageText("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}