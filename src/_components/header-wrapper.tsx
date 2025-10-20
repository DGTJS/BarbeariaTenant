"use client";

import { useState } from "react";
import Header from "./header";
import FloatingMenu from "./floating-menu";
import AppointmentsModal from "./appointments-modal";
import RateServicesModal from "./rate-services-modal";
import BookingModal from "./booking-modal";
import FavoritesModal from "./favorites-modal";
import HistoryModal from "./history-modal";
import NotificationsModal from "./notifications-modal";
import { Booking } from "@/_types/booking";

interface Category {
  id: string;
  name: string;
  IconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
}

interface HeaderWrapperProps {
  categories: Category[];
  user: { name?: string | null; id?: string } | null;
  bookings: Booking[];
  services?: any[];
  barbers?: any[];
}

const HeaderWrapper = ({ categories, user, bookings, services, barbers }: HeaderWrapperProps) => {
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [isRateServicesModalOpen, setIsRateServicesModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const handleAppointmentsClick = () => {
    setIsAppointmentsModalOpen(true);
  };

  const handleRateServicesClick = () => {
    setIsRateServicesModalOpen(true);
  };

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  const handleFavoritesClick = () => {
    setIsFavoritesModalOpen(true);
  };

  const handleHistoryClick = () => {
    setIsHistoryModalOpen(true);
  };

  const handleAccountClick = () => {
    // Redirecionar para página de perfil ou abrir modal de conta
    window.location.href = "/profile";
  };

  const handleNotificationClick = () => {
    // Abrir modal de notificações
    setIsNotificationsModalOpen(true);
  };

  return (
    <>
      <Header 
        onNotificationClick={handleNotificationClick} 
        unreadNotifications={2} // Mock - em produção viria de uma API
      />
      
      <FloatingMenu
        categories={categories}
        onAppointmentsClick={handleAppointmentsClick}
        onRateServicesClick={handleRateServicesClick}
        onBookingClick={handleBookingClick}
        onFavoritesClick={handleFavoritesClick}
        onHistoryClick={handleHistoryClick}
        onAccountClick={handleAccountClick}
      />

      <AppointmentsModal
        isOpen={isAppointmentsModalOpen}
        onClose={() => setIsAppointmentsModalOpen(false)}
        user={user}
        bookings={bookings}
      />
      <RateServicesModal
        isOpen={isRateServicesModalOpen}
        onClose={() => setIsRateServicesModalOpen(false)}
        user={user}
      />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        services={services || []}
        barbers={barbers || []}
        bookings={bookings}
        categories={categories}
      />
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        user={user}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        user={user}
        bookings={bookings}
      />
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
    </>
  );
};

export default HeaderWrapper;
