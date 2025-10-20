import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { barber } from "@/generated/prisma/client";
import { Badge } from "./ui/badge";
import { Calendar, StarIcon } from "lucide-react";
import Link from "next/link";

interface BarberCardHorizontalProps {
  barber: barber;
  nameButton: string;
  averageRating?: number;
}

const BarberCardHorizontal = ({ barber, nameButton, averageRating = 5.0 }: BarberCardHorizontalProps) => {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-300 hover:shadow-lg lg:hover:shadow-xl lg:hover:shadow-primary/10">
      <CardContent className="px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Foto do lado esquerdo */}
          <div className="relative h-20 w-20 lg:h-24 lg:w-24 flex-shrink-0 overflow-hidden rounded-xl lg:rounded-2xl">
            <Image
              src={barber.photo}
              alt={barber.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {averageRating && averageRating > 0 && (
              <Badge
                className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-primary text-primary-foreground text-xs lg:text-sm px-1 py-0.5 lg:px-2 lg:py-1"
                variant="secondary"
              >
                <StarIcon className="mr-1 h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)}
              </Badge>
            )}
          </div>

          {/* Informações no centro */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground truncate mb-0 lg:mb-1">{barber.name}</h3>
            <p className="text-sm text-foreground-muted truncate mb-1 lg:mb-2">{barber.phone}</p>
            <div className="flex items-center gap-1 lg:gap-2">
              {averageRating && averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <StarIcon className="h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs lg:text-sm font-medium text-foreground">{averageRating.toFixed(1)}</span>
                </div>
              )}
              {averageRating && averageRating > 0 && (
                <span className="hidden lg:inline text-sm text-foreground-muted">•</span>
              )}
              <span className="hidden lg:inline text-sm text-foreground-muted">Barbeiro Profissional</span>
            </div>
          </div>

          {/* Botão do lado direito */}
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 px-3 py-2 lg:px-6 lg:py-3"
              asChild
            >
              <Link href={`/barber/${barber.id}`} className="flex items-center gap-1 lg:gap-2">
                <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-xs lg:text-sm">{nameButton}</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberCardHorizontal;
