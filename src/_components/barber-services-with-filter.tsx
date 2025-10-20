"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Calendar } from "lucide-react";
import ServiceBarberCard from "@/_components/cardServiceBarber";
import CategoryFilter from "@/_components/category-filter";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: any;
  duration: number;
  imageUrl: string;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  priceAdjustments: Array<{
    priceAdjustment: any;
  }>;
}

interface Barber {
  id: string;
  name: string;
  photo: string;
  workingHours?: Array<{
    id: string;
    weekday: number;
    startTime: string;
    endTime: string;
    pauses: Array<{
      id: string;
      startTime: string;
      endTime: string;
    }>;
  }>;
  barberShop?: {
    name: string;
    address?: string;
  };
}

interface BarberServicesWithFilterProps {
  services: Service[];
  barber: Barber;
  user: { id: string; name?: string | null } | null;
  allBookings: any[];
  allServices?: any[];
  allBarbers?: any[];
  categories?: any[];
}

const BarberServicesWithFilter = ({ 
  services, 
  barber, 
  user, 
  allBookings,
  allServices,
  allBarbers,
  categories
}: BarberServicesWithFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtrar serviços por categoria selecionada
  const filteredServices = useMemo(() => {
    if (!selectedCategory) {
      return services;
    }
    return services.filter(service => service.categoryId === selectedCategory);
  }, [services, selectedCategory]);

  // Obter categorias únicas dos serviços
  const serviceCategories = useMemo(() => {
    const categoryMap = new Map();
    services.forEach(service => {
      if (service.category) {
        categoryMap.set(service.category.id, service.category);
      }
    });
    return Array.from(categoryMap.values());
  }, [services]);

  return (
    <div className="space-y-8">
      {/* Filtro de Categoria */}
      {serviceCategories.length > 0 && (
        <Card className="bg-card-secondary/90 backdrop-blur-sm border border-card-border/30 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Filtrar Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryFilter
              categories={serviceCategories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </CardContent>
        </Card>
      )}

      {/* Serviços */}
      <Card className="bg-card-secondary border-card-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            Serviços Disponíveis
            {selectedCategory && (
              <Badge variant="secondary" className="ml-2">
                {filteredServices.length} serviço{filteredServices.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceBarberCard
                  key={service.id}
                  service={{
                    ...service,
                    price: Number(service.price),
                    priceAdjustments: service.priceAdjustments?.map((adj) => ({
                      ...adj,
                      priceAdjustment: Number(adj.priceAdjustment),
                    })),
                  }}
                  barber={{
                    id: barber.id,
                    name: barber.name,
                    photo: barber.photo,
                    workingHours: barber.workingHours?.map((hour) => ({
                      ...hour,
                      pauses: hour.pauses || [],
                    })),
                    barberShop: barber.barberShop?.name ? {
                      name: barber.barberShop.name,
                      address: barber.barberShop.address || undefined,
                    } : undefined,
                  }}
                  user={user}
                  bookings={allBookings}
                  allServices={allServices}
                  allBarbers={allBarbers}
                  categories={categories}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-foreground-muted mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {selectedCategory ? "Nenhum serviço nesta categoria" : "Nenhum serviço disponível"}
                </h3>
                <p className="text-foreground-muted">
                  {selectedCategory 
                    ? "Este barbeiro não possui serviços nesta categoria."
                    : "Este barbeiro ainda não possui serviços cadastrados."
                  }
                </p>
                {selectedCategory && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4"
                  >
                    Ver Todos os Serviços
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberServicesWithFilter;
