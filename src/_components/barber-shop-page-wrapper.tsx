"use client";

import { useRouter } from "next/navigation";
import FloatingMenu from "./floating-menu";

interface BarberShopPageWrapperProps {
  children: React.ReactNode;
}

const BarberShopPageWrapper = ({ children }: BarberShopPageWrapperProps) => {
  const router = useRouter();

  return (
    <>
      <FloatingMenu
        onAppointmentsClick={() => router.push("/")}
        onBookingClick={() => router.push("/")}
        onFavoritesClick={() => router.push("/")}
        onHistoryClick={() => router.push("/")}
        onAccountClick={() => router.push("/profile")}
      />
      <div className="pb-24 lg:pb-0">{children}</div>
    </>
  );
};

export default BarberShopPageWrapper;

