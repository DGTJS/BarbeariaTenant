"use client";

import { useState } from "react";
import Header from "./header";
import AppointmentsModal from "./appointments-modal";
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
}

const HeaderWrapper = ({ categories, user, bookings }: HeaderWrapperProps) => {
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);

  const handleAppointmentsClick = () => {
    setIsAppointmentsModalOpen(true);
  };

  return (
    <>
      <Header 
        categories={categories} 
        onAppointmentsClick={handleAppointmentsClick}
      />
      <AppointmentsModal
        isOpen={isAppointmentsModalOpen}
        onClose={() => setIsAppointmentsModalOpen(false)}
        user={user}
        bookings={bookings}
      />
    </>
  );
};

export default HeaderWrapper;
