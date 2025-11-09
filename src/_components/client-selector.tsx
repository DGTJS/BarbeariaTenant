"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Users, User as UserIcon, Loader2 } from "lucide-react";
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

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface ClientSelectorProps {
  selectedClients: string[];
  onChange: (clientIds: string[]) => void;
  mode?: "multiple" | "single";
}

export function ClientSelector({ selectedClients, onChange, mode = "multiple" }: ClientSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
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

  const selectedClientsData = clients.filter(c => selectedClients.includes(c.id));
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
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
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Buscar cliente..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup>
                    {filteredClients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.id}
                        onSelect={() => handleSelectClient(client.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={client.image} />
                            <AvatarFallback className="text-xs">
                              {client.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{client.name}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedClients.includes(client.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Clients Pills */}
      {mode === "multiple" && selectedClients.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border">
          {selectedClientsData.map((client) => (
            <Badge
              key={client.id}
              variant="secondary"
              className="pl-2 pr-1 py-1 flex items-center gap-2"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={client.image} />
                <AvatarFallback className="text-[10px]">
                  {client.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{client.name}</span>
              <button
                onClick={() => handleRemoveClient(client.id)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

