"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createBooking } from "@/app/_actions/create-booking";
import { toast } from "sonner";

interface BookingData {
  barberId: string;
  dateTime: Date;
  serviceId: string;
  serviceOptionId?: string;
  status?: string;
}

interface BookingSuccessData {
  serviceName: string;
  serviceOption?: string;
  barberName: string;
  date: string;
  time: string;
  price: number;
}

export function useBooking() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<BookingSuccessData | null>(null);

  const createBookingWithSuccess = useCallback(async (
    bookingData: BookingData,
    successData: BookingSuccessData
  ) => {
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para fazer um agendamento");
      return false;
    }

    setIsLoading(true);
    
    try {
      await createBooking({
        barberId: bookingData.barberId,
        dateTime: bookingData.dateTime,
        serviceId: bookingData.serviceId,
        status: bookingData.status || "pending",
        userId: session.user.id,
      });

      // Definir dados de sucesso e mostrar modal
      setSuccessData(successData);
      setShowSuccessModal(true);
      
      return true;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento. Tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    setSuccessData(null);
  }, []);

  return {
    isLoading,
    showSuccessModal,
    successData,
    createBookingWithSuccess,
    closeSuccessModal,
  };
}
