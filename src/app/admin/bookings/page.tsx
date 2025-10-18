"use client";

import { useState, useEffect } from "react";
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
  Loader2
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
  const loadBookings = async () => {
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
  };

  useEffect(() => {
    loadBookings();
  }, [filter, searchTerm]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setSaving(true);
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

      await loadBookings();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do agendamento');
    } finally {
      setSaving(false);
    }
  };

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

  const toggleExpanded = (bookingId: string) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-emerald-500";
      case "Pendente":
        return "bg-amber-500";
      case "Cancelada":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmada":
        return <CheckCircle className="h-4 w-4" />;
      case "Pendente":
        return <AlertCircle className="h-4 w-4" />;
      case "Cancelada":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Confirmados</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.confirmed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pendentes</p>
                  <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.pending}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Cancelados</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300">{stats.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Receita Hoje</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    R$ {stats.todayRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avaliação Média</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-500" />
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
          <div className="space-y-4">
          {bookings.map((booking) => {
            const isExpanded = expandedBookings.has(booking.id);
            const { date, time } = formatDateTime(booking.dateTime);
            
            return (
              <Card key={booking.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Informações principais */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                      {/* Cliente */}
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.user.image} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {booking.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.user.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{booking.user.email}</span>
                          </div>
                          {booking.user.phone && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{booking.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Detalhes do agendamento */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{date}</span>
                          <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                          <span className="text-sm font-medium">{time}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Scissors className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{booking.service.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({booking.service.duration} min)
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{booking.barber.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status e ações */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          R$ {booking.service.price.toFixed(2)}
                        </p>
                        {booking.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{booking.rating}/5</span>
                          </div>
                        )}
                      </div>

                      <Badge 
                        variant={booking.status === "Confirmada" ? "default" : 
                                booking.status === "Pendente" ? "secondary" : "destructive"}
                        className="flex items-center space-x-1 px-3 py-1"
                      >
                        {getStatusIcon(booking.status)}
                        <span>{booking.status}</span>
                      </Badge>

                      <div className="flex space-x-2">
                        {booking.status === "Pendente" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, "Confirmada")}
                              disabled={saving}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(booking.id, "Cancelada")}
                              disabled={saving}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowRescheduleModal(true);
                          }}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Reagendar
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowMessageModal(true);
                          }}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Mensagem
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleExpanded(booking.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações do serviço */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Scissors className="h-4 w-4 mr-2" />
                            Detalhes do Serviço
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Serviço:</span> {booking.service.name}</p>
                            <p><span className="font-medium">Duração:</span> {booking.service.duration} minutos</p>
                            <p><span className="font-medium">Preço:</span> R$ {booking.service.price.toFixed(2)}</p>
                            {booking.service.description && (
                              <p><span className="font-medium">Descrição:</span> {booking.service.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Informações do barbeiro */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Barbeiro Responsável
                          </h4>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={booking.barber.photo} />
                              <AvatarFallback>
                                {booking.barber.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.barber.name}</p>
                              <p className="text-sm text-muted-foreground">Barbeiro</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comentário e avaliação */}
                      {(booking.comment || booking.rating) && (
                        <div className="mt-6 pt-6 border-t border-border/50">
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Star className="h-4 w-4 mr-2" />
                            Avaliação do Cliente
                          </h4>
                          <div className="bg-muted/50 rounded-lg p-4">
                            {booking.rating && (
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium">Avaliação:</span>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < booking.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ({booking.rating}/5)
                                </span>
                              </div>
                            )}
                            {booking.comment && (
                              <p className="text-sm">
                                <span className="font-medium">Comentário:</span> {booking.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
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