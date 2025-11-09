"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/_components/ui/badge";
import { Skeleton } from "@/_components/ui/skeleton";
import { Clock, Users, Search, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  availableBarbersCount: number;
  image: string | null;
  serviceOptions?: Array<{ id: string; name: string; price: number }>;
}

export default function ServiceSelectionPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = services.filter(
        service =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, services]);

  async function fetchServices() {
    try {
      const response = await fetch("/api/services/available");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectService(serviceId: string) {
    router.push(`/booking/by-service/${serviceId}`);
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-3xl font-bold mb-2">Escolha o Serviço</h1>
        <p className="text-muted-foreground">
          Selecione o que você deseja fazer
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum serviço encontrado</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <Card
              key={service.id}
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => handleSelectService(service.id)}
            >
              {service.image && (
                <div className="relative h-40 w-full">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {service.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {service.category.name}
                    </Badge>
                  </div>
                </div>
                {service.description && (
                  <CardDescription className="mt-2">
                    {service.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Preço - apenas das opções */}
                  {service.serviceOptions &&
                  service.serviceOptions.length > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Preço
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(
                          Math.min(
                            ...service.serviceOptions.map(opt =>
                              Number(opt.price ?? 0)
                            )
                          )
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Preço
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Selecione uma opção
                      </span>
                    </div>
                  )}

                  {/* Barbeiros Disponíveis */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {service.availableBarbersCount}{" "}
                      {service.availableBarbersCount === 1
                        ? "barbeiro"
                        : "barbeiros"}
                    </span>
                  </div>

                  <Button className="w-full mt-4">Ver Barbeiros</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
