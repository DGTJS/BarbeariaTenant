"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Badge } from "@/_components/ui/badge";
import { Skeleton } from "@/_components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Star, Search, ArrowLeft } from "lucide-react";

interface Barber {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  specialties: string[];
  servicesCount: number;
}

export default function BarberSelectionPage() {
  const router = useRouter();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = barbers.filter((barber) =>
        barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBarbers(filtered);
    } else {
      setFilteredBarbers(barbers);
    }
  }, [searchTerm, barbers]);

  async function fetchBarbers() {
    try {
      const response = await fetch("/api/barbers");
      if (response.ok) {
        const data = await response.json();
        // Adaptar os dados para o formato esperado
        const adaptedData = data.map((barber: any) => ({
          id: barber.id,
          name: barber.name,
          image: barber.image || barber.photo,
          rating: barber.rating || 0,
          specialties: barber.specialties || [],
          servicesCount: barber.servicesCount || 0
        }));
        setBarbers(adaptedData);
        setFilteredBarbers(adaptedData);
      }
    } catch (error) {
      console.error("Erro ao buscar barbeiros:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectBarber(barberId: string) {
    router.push(`/booking/by-barber/${barberId}`);
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-3xl font-bold mb-2">Escolha o Barbeiro</h1>
        <p className="text-muted-foreground">
          Selecione seu profissional favorito
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar barbeiros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Barbers Grid */}
      {filteredBarbers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum barbeiro encontrado</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarbers.map((barber) => (
            <Card
              key={barber.id}
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => handleSelectBarber(barber.id)}
            >
              <CardHeader className="text-center pb-4">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={barber.image || undefined} alt={barber.name} />
                  <AvatarFallback className="text-2xl">
                    {barber.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <CardTitle className="text-xl">{barber.name}</CardTitle>

                {barber.rating > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{barber.rating.toFixed(1)}</span>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Especialidades */}
                {barber.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Especialidades</p>
                    <div className="flex flex-wrap gap-2">
                      {barber.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {barber.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{barber.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Serviços */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>Serviços oferecidos</span>
                  <span className="font-semibold">{barber.servicesCount || 0}</span>
                </div>

                <Button className="w-full">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

