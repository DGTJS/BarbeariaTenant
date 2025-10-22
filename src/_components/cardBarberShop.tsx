"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { BarberShop } from "@/generated/prisma/client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";
import Link from "next/link";

interface BarberShopItemProps {
  barberShop: BarberShop;
  nameButton: string;
}

const CardBarber = ({ barberShop, nameButton }: BarberShopItemProps) => {
  return (
    <>
      {/* Mobile Layout */}
      <Card className="flex max-w-[160px] min-w-[175px] rounded-2xl p-1 lg:hidden">
        <CardContent className="p-0 px-1 pt-1">
          <div className="relative h-[159px] w-full">
            <Image
              src={barberShop.imageUrl ?? "/default-image.png"}
              alt="Logo"
              fill
              className="objet-cover rounded-2xl"
            />
            <Badge
              className="absolute top-2 left-2 bg-black/60 shadow-md backdrop-blur-md"
              variant="secondary"
            >
              <StarIcon className="fill-primary text-primary h-4 w-4" />
              <span className="text-xs font-semibold">5.0</span>
            </Badge>
          </div>
          <div className="px-1 py-3">
            <h3 className="truncate text-lg font-semibold">{barberShop.name}</h3>
            <p className="truncate text-sm text-foreground-muted">{barberShop.address}</p>
            <Button
              variant="outline"
              className="mt-3 w-full border-none bg-card-secondary hover:bg-card-hover"
              asChild
            >
              <Link href={`/barbershop/${barberShop.id}`}>{nameButton}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Layout */}
      <Card className="hidden lg:block group overflow-hidden rounded-2xl border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
        <CardContent className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={barberShop.imageUrl ?? "/default-image.png"}
              alt={barberShop.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Badge
              className="absolute top-3 left-3 bg-card/20 backdrop-blur-md border-card-border text-card-foreground"
              variant="secondary"
            >
              <StarIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold">5.0</span>
            </Badge>
            <div className="absolute bottom-3 right-3 rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-primary-foreground backdrop-blur-sm">
              Barbearia
            </div>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-lg font-bold text-card-foreground truncate">{barberShop.name}</h3>
            <div className="mb-3 space-y-1">
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {barberShop.address}
              </p>
              {barberShop.phones && barberShop.phones.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {barberShop.phones[0]}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              asChild
            >
              <Link href={`/barbershop/${barberShop.id}`} className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {nameButton}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CardBarber;
