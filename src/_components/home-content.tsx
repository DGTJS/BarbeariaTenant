"use client";

import { useState } from "react";
import Image from "next/image";
import Appointments from "./appointments";
import CategoryButtons from "./category-buttons";
import FilteredSections from "./filtered-sections";
import Search from "./search";
import BookingModal from "./booking-modal";
import HistoryModal from "./history-modal";
import FavoritesModal from "./favorites-modal";
import BannerCarousel from "./banner-carousel";

interface HomeContentProps {
  user: { name?: string | null } | null;
  categories?: any[];
  barbers?: any[];
  services?: any[];
  barberShops?: any[];
  bookings?: any[];
  banners?: any[];
  showBarberShops?: boolean;
}

const HomeContent = ({
  user,
  categories = [],
  barbers = [],
  services = [],
  barberShops = [],
  bookings = [],
  banners = [],
  showBarberShops = true
}: HomeContentProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  const handleHistoryClick = () => {
    setIsHistoryModalOpen(true);
  };

  const handleFavoritesClick = () => {
    setIsFavoritesModalOpen(true);
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="p-5 pb-24 text-foreground lg:hidden bg-background">
        {user?.name && (
          <h2 className="text-xl">
            Olá,{" "}
            <span className="text-xl font-bold text-primary">{user?.name}</span>
          </h2>
        )}
        {!user?.name && (
          <h2 className="text-xl font-semibold">
            Entre ou Cadastre-se e faça seus agendamentos!
          </h2>
        )}
        <p>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-5">
          <Search />
        </div>

        {/* Category Buttons */}
        <div className="mt-5">
          <CategoryButtons
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategoryChange}
          />
        </div>

        {/* BANNER CAROUSEL */}
        <div className="mt-5">
          <BannerCarousel banners={banners} />
        </div>

        {/* AGENDAMENTOS */}
                <h2 className="font mt-5 text-sm font-semibold text-foreground-muted uppercase">
                  Agendamentos
                </h2>
                <Appointments bookings={bookings} user={user} />

        {/* Filtered Sections */}
        <div className="mt-8">
          <FilteredSections
            selectedCategory={selectedCategory}
            barbers={barbers}
            services={services}
            barberShops={barberShops}
            bookings={bookings}
            showBarberShops={showBarberShops}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            {user?.name && (
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                  Olá,{" "}
                  <span className="text-primary">
                    {user?.name}
                  </span>
                </h1>
                <p className="mt-2 text-lg text-foreground-muted">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            {!user?.name && (
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                  Entre ou Cadastre-se e faça seus agendamentos!
                </h1>
                <p className="mt-2 text-lg text-foreground-muted">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <Search />
          </div>

          {/* Main Grid Layout - Desktop */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column - Categories & Content */}
            <div className="lg:col-span-8">
              {/* Category Buttons */}
              <div className="mb-8">
                <CategoryButtons
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategoryChange}
                />
              </div>

              {/* Banner Section */}
              <section className="mb-12">
                <div className="h-64 w-full overflow-hidden rounded-2xl">
                  <BannerCarousel banners={banners} />
                </div>
              </section>

              {/* Filtered Sections */}
              <div className="mt-8">
                <FilteredSections
                  selectedCategory={selectedCategory}
                  barbers={barbers}
                  services={services}
                  barberShops={barberShops}
                  bookings={bookings}
                  showBarberShops={showBarberShops}
                />
              </div>
            </div>

            {/* Right Column - Appointments & Quick Actions */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                        {/* Appointments Card */}
                        <div className="rounded-xl bg-card/90 backdrop-blur-sm border border-card-border/30 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                            Próximos Agendamentos
                          </h3>
                          <Appointments bookings={bookings} user={user} />
                        </div>

                {/* Quick Stats */}
                <div className="rounded-xl bg-card-secondary/90 backdrop-blur-sm border border-card-border/30 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                    Estatísticas
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-foreground-muted text-sm">Barbeiros Ativos</span>
                      </div>
                      <span className="text-lg font-bold text-card-foreground">
                        {barbers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <span className="text-foreground-muted text-sm">Serviços Disponíveis</span>
                      </div>
                      <span className="text-lg font-bold text-card-foreground">
                        {services.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-foreground-muted text-sm">Categorias</span>
                      </div>
                      <span className="text-lg font-bold text-card-foreground">
                        {categories.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl bg-card-tertiary/90 backdrop-blur-sm border border-card-border/30 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                    Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button 
                      onClick={handleBookingClick}
                      className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:scale-[1.02]"
                    >
                      Agendar Serviço
                    </button>
                    <button 
                      onClick={handleHistoryClick}
                      className="w-full rounded-lg border border-card-border/50 px-4 py-3 text-sm font-medium text-card-foreground transition-all duration-200 hover:bg-accent-hover hover:border-card-border hover:shadow-sm hover:scale-[1.02]"
                    >
                      Ver Histórico
                    </button>
                    <button 
                      onClick={handleFavoritesClick}
                      className="w-full rounded-lg border border-card-border/50 px-4 py-3 text-sm font-medium text-card-foreground transition-all duration-200 hover:bg-accent-hover hover:border-card-border hover:shadow-sm hover:scale-[1.02]"
                    >
                      Favoritos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        services={services}
        barbers={barbers}
        bookings={bookings}
        categories={categories}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        user={user}
        bookings={bookings}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        user={user}
        barbers={barbers}
      />
    </>
  );
};

export default HomeContent;
