"use client";

import { useMemo } from "react";
import Barbers from "./CardBarbers";
import CardServices from "./CardServices";
import CardBarber from "./cardBarberShop";

interface Barber {
  id: string;
  name: string;
  photo: string;
  phone: string | null;
  barberShopId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  categories: Array<{ id: string; name: string; IconUrl: string }>;
  workingHours: Array<{
    id: string;
    barberId: string;
    weekday: number;
    startTime: string;
    endTime: string;
    pauses: Array<{
      id: string;
      startTime: string;
      endTime: string;
    }>;
  }>;
  booking: Array<{
    rating: number | null;
  }>;
}

interface Service {
  id: string;
  name: string;
  price: any;
  duration: number;
  imageUrl: string;
  categoryId: string | null;
  barberShopId: string;
  description?: string;
  priceAdjustments?: Array<{ priceAdjustment: any }>;
  barberShop: {
    id: string;
    name: string;
    address: string | null;
    phones: string[];
    imageUrl: string | null;
    rating: string | null;
    description: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface BarberShop {
  id: string;
  name: string;
  address: string | null;
  phones: string[];
  imageUrl: string | null;
  rating: string | null;
  description: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Booking {
  dateTime: Date;
  service: { duration: number };
  barberId: string;
}

interface FilteredSectionsProps {
  selectedCategory: string | null;
  barbers?: Barber[];
  services?: Service[];
  barberShops?: BarberShop[];
  bookings?: Booking[];
  showBarberShops?: boolean;
}

const FilteredSections = ({ selectedCategory, barbers, services, barberShops, bookings, showBarberShops = true }: FilteredSectionsProps) => {
  const filteredData = useMemo(() => {
    // Garantir que os arrays existam e não sejam undefined
    const safeBarbers = barbers || [];
    const safeServices = services || [];
    const safeBarberShops = barberShops || [];
    const safeBookings = bookings || [];


    if (!selectedCategory) {
      return {
        filteredBarbers: safeBarbers.filter((barber, index, self) => 
          index === self.findIndex(b => b.id === barber.id)
        ),
        filteredServices: safeServices.filter((service, index, self) => 
          index === self.findIndex(s => s.id === service.id)
        ),
        filteredBarberShops: safeBarberShops.filter((barberShop, index, self) => 
          index === self.findIndex(bs => bs.id === barberShop.id)
        ),
      };
    }

    // Filtrar barbeiros que têm a categoria selecionada e deduplicar
    const filteredBarbers = safeBarbers
      .filter((barber) => barber.categories?.some((cat) => cat.id === selectedCategory))
      .filter((barber, index, self) => 
        index === self.findIndex(b => b.id === barber.id)
      );

            // Filtrar serviços globais da categoria selecionada
            const filteredServices = safeServices
              .filter((service) => service.categoryId === selectedCategory)
              .filter((service, index, self) => 
                index === self.findIndex(s => s.id === service.id)
              );

            // Para serviços globais, mostrar todas as barbearias (exceto a barbearia global)
            const filteredBarberShops = safeBarberShops
              .filter((barberShop) => barberShop.name !== "Serviços")
              .filter((barberShop, index, self) => 
                index === self.findIndex(bs => bs.id === barberShop.id)
              );

    return {
      filteredBarbers,
      filteredServices,
      filteredBarberShops,
    };
  }, [selectedCategory, barbers, services, barberShops, bookings]);

  const hasResults = 
    filteredData.filteredBarbers.length > 0 ||
    filteredData.filteredServices.length > 0 ||
    filteredData.filteredBarberShops.length > 0;

  // Se uma categoria está selecionada mas não há resultados
  if (selectedCategory && !hasResults) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-400">
            Não encontramos barbeiros, serviços ou barbearias para esta categoria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barbeiros */}
      {filteredData.filteredBarbers.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-secondary"></div>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory ? "Barbeiros Especializados" : "Nossos Barbeiros"}
            </h2>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {filteredData.filteredBarbers.length}
            </span>
          </div>
          
          {/* Mobile */}
          <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden lg:hidden">
            {filteredData.filteredBarbers.map((barber) => {
              // Calcular avaliação média apenas com ratings válidos
              const validRatings = barber.booking?.filter(booking => booking.rating !== null) || [];
              const averageRating = validRatings.length > 0 
                ? validRatings.reduce((sum, booking) => sum + (booking.rating || 0), 0) / validRatings.length
                : undefined;
              
              return (
                <Barbers
                  key={barber.id}
                  barber={barber}
                  nameButton="Agendar"
                  averageRating={averageRating}
                />
              );
            })}
          </div>
          
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.filteredBarbers.map((barber) => {
              // Calcular avaliação média apenas com ratings válidos
              const validRatings = barber.booking?.filter(booking => booking.rating !== null) || [];
              const averageRating = validRatings.length > 0 
                ? validRatings.reduce((sum, booking) => sum + (booking.rating || 0), 0) / validRatings.length
                : undefined;
              
              return (
                <Barbers
                  key={barber.id}
                  barber={barber}
                  nameButton="Agendar"
                  averageRating={averageRating}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Serviços */}
      {filteredData.filteredServices.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-secondary"></div>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory ? "Serviços Disponíveis" : "Serviços"}
            </h2>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {filteredData.filteredServices.length}
            </span>
          </div>
          
          {/* Mobile */}
          <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden lg:hidden">
            {filteredData.filteredServices.map((service) => {
              // Para serviços globais, usar todos os barbeiros
              const allBarbers = (barbers || []).filter((barber, index, self) => 
                index === self.findIndex(b => b.id === barber.id)
              );

              const sanitizedBookings = (bookings || []).map((booking) => ({
                dateTime: booking.dateTime,
                service: {
                  duration: Number(booking.service.duration),
                },
                barberId: booking.barberId,
              }));

              return (
                <CardServices
                  key={service.id}
                  BarberShopService={{
                    ...service,
                    barber: allBarbers, // Passa todos os barbeiros para serviços globais
                  }}
                  nameButton="Agendar"
                  bookings={sanitizedBookings}
                  barbers={allBarbers} // Passa todos os barbeiros
                />
              );
            })}
          </div>
          
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.filteredServices.map((service) => {
              // Para serviços globais, usar todos os barbeiros
              const allBarbers = (barbers || []).filter((barber, index, self) => 
                index === self.findIndex(b => b.id === barber.id)
              );

              const sanitizedBookings = (bookings || []).map((booking) => ({
                dateTime: booking.dateTime,
                service: {
                  duration: Number(booking.service.duration),
                },
                barberId: booking.barberId,
              }));

              return (
                <CardServices
                  key={service.id}
                  BarberShopService={{
                    ...service,
                    barber: allBarbers, // Passa todos os barbeiros para serviços globais
                  }}
                  nameButton="Agendar"
                  bookings={sanitizedBookings}
                  barbers={allBarbers} // Passa todos os barbeiros
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Barbearias */}
      {showBarberShops && filteredData.filteredBarberShops.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-secondary"></div>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory ? "Barbearias Especializadas" : "Barbearias Populares"}
            </h2>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {filteredData.filteredBarberShops.length}
            </span>
          </div>
          
          {/* Mobile */}
          <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden lg:hidden">
            {filteredData.filteredBarberShops.map((barberShop) => (
              <CardBarber
                key={barberShop.id}
                barberShop={barberShop}
                nameButton="Reservar"
              />
            ))}
          </div>
          
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.filteredBarberShops.map((barberShop) => (
              <CardBarber
                key={barberShop.id}
                barberShop={barberShop}
                nameButton="Reservar"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FilteredSections;
