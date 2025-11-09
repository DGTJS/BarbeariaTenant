"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  X,
  Users,
  User as UserIcon,
  Loader2,
  Calendar,
  UserCheck,
  UserX,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/_lib/utils";
import { Button } from "@/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_components/ui/popover";
import { Badge } from "@/_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { Label } from "@/_components/ui/label";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  totalBookings: number;
  hasBookings: boolean;
  lastBookingDate?: string;
  daysSinceLastBooking?: number;
  isActive: boolean;
}

interface ClientSelectorEnhancedProps {
  selectedClients: string[];
  onChange: (clientIds: string[]) => void;
  mode?: "multiple" | "single";
}

export function ClientSelectorEnhanced({
  selectedClients,
  onChange,
  mode = "multiple",
}: ClientSelectorEnhancedProps) {
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");

  React.useEffect(() => {
    loadClients();
  }, [filter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("filter", filter);
      }

      const response = await fetch(`/api/admin/clients?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Garante que os cookies de sessão sejam enviados
      });

      if (response.status === 401) {
        console.error(
          "Não autorizado: Verifique se você está logado como Admin"
        );
        setClients([]);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        console.error("Erro ao carregar clientes:", response.status);
        setClients([]);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClient = (clientId: string) => {
    if (mode === "single") {
      onChange([clientId]);
      setOpen(false);
    } else {
      if (selectedClients.includes(clientId)) {
        onChange(selectedClients.filter(id => id !== clientId));
      } else {
        onChange([...selectedClients, clientId]);
      }
    }
  };

  const handleRemoveClient = (clientId: string) => {
    onChange(selectedClients.filter(id => id !== clientId));
  };

  const selectedClientsData = clients.filter(c =>
    selectedClients.includes(c.id)
  );
  const filteredClients = clients.filter(
    client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientBadge = (client: Client) => {
    if (!client.hasBookings) {
      return (
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
        >
          Novo
        </Badge>
      );
    }
    if (client.isActive) {
      return (
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-500 border-green-500/30"
        >
          Ativo
        </Badge>
      );
    }
    if (client.daysSinceLastBooking && client.daysSinceLastBooking > 30) {
      return (
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 bg-orange-500/10 text-orange-500 border-orange-500/30"
        >
          {client.daysSinceLastBooking}d
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Filtros de Clientes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Filtrar Clientes
        </Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="bg-background border-border hover:bg-accent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-lg">
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Todos os Clientes</span>
              </div>
            </SelectItem>
            <SelectItem value="with-bookings">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Com Agendamentos</span>
              </div>
            </SelectItem>
            <SelectItem value="without-bookings">
              <div className="flex items-center gap-2">
                <UserX className="h-4 w-4 text-yellow-500" />
                <span>Sem Agendamentos (Novos)</span>
              </div>
            </SelectItem>
            <SelectItem value="active">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span>Clientes Ativos (últimos 30 dias)</span>
              </div>
            </SelectItem>
            <SelectItem value="inactive">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Clientes Inativos (+30 dias)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Seletor de Clientes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Selecionar Clientes</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-background hover:bg-accent border-border"
            >
              <div className="flex items-center gap-2">
                {mode === "multiple" ? (
                  <Users className="h-4 w-4" />
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
                <span>
                  {selectedClients.length === 0
                    ? "Selecione os clientes..."
                    : mode === "single"
                      ? selectedClientsData[0]?.name
                      : `${selectedClients.length} cliente(s) selecionado(s)`}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border"
            align="start"
          >
            <Command className="bg-popover">
              <CommandInput
                placeholder="Buscar cliente..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="border-none bg-transparent"
              />
              <CommandList className="max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {clients.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground space-y-2">
                        <Users className="h-8 w-8 mx-auto opacity-50" />
                        <div>
                          <p className="font-medium">
                            Nenhum cliente encontrado
                          </p>
                          <p className="text-xs mt-1">
                            {filter === "all"
                              ? "Não há clientes cadastrados no sistema"
                              : "Nenhum cliente corresponde a este filtro"}
                          </p>
                        </div>
                      </div>
                    ) : filteredClients.length === 0 ? (
                      <CommandEmpty>
                        Nenhum cliente encontrado na busca.
                      </CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredClients.map(client => (
                          <CommandItem
                            key={client.id}
                            value={client.id}
                            onSelect={() => handleSelectClient(client.id)}
                            className="hover:bg-accent aria-selected:bg-accent cursor-pointer"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={client.image} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {client.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium truncate">
                                    {client.name}
                                  </span>
                                  {getClientBadge(client)}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="truncate">
                                    {client.email}
                                  </span>
                                  {client.hasBookings && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {client.totalBookings} agend.
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "ml-2 h-4 w-4 text-primary flex-shrink-0",
                                selectedClients.includes(client.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Clients Pills */}
      {mode === "multiple" && selectedClients.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
          {selectedClientsData.map(client => (
            <Badge
              key={client.id}
              variant="secondary"
              className="pl-2 pr-1 py-1.5 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={client.image} />
                <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                  {client.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{client.name}</span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveClient(client.id);
                }}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Info sobre filtro atual */}
      {filter !== "all" && (
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2 border border-border/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>
              {filter === "with-bookings" &&
                "Mostrando apenas clientes que já fizeram agendamentos"}
              {filter === "without-bookings" &&
                "Mostrando apenas clientes novos (sem agendamentos)"}
              {filter === "active" &&
                "Mostrando apenas clientes ativos (agendaram nos últimos 30 dias)"}
              {filter === "inactive" &&
                "Mostrando apenas clientes inativos (não agendam há mais de 30 dias)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
