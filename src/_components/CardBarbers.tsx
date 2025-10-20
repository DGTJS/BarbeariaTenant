import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { barber } from "@/generated/prisma/client";
import { Badge } from "./ui/badge";
import { Calendar, StarIcon } from "lucide-react";
import Link from "next/link";

interface BarbersProps {
  barber: barber;
  nameButton: string;
  averageRating?: number;
}

const Barbers = ({ barber, nameButton, averageRating = 5.0 }: BarbersProps) => {

  return (
    <>
      {/* Mobile Layout */}
      <Card className="flex max-w-[160px] min-w-[175px] rounded-2xl p-1 lg:hidden">
        <CardContent className="p-0 px-1 pt-1">
          <div className="relative h-[159px] w-full">
            <Image
              src={barber.photo}
              alt="Logo"
              fill
              className="objet-cover rounded-2xl"
            />
            {averageRating && averageRating > 0 && (
              <Badge
                className="absolute top-2 left-2 bg-black/60 shadow-md backdrop-blur-md"
                variant="secondary"
              >
                <StarIcon className="fill-yellow-400 text-yellow-400 h-4 w-4" />
                    <span className="text-xs font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
              </Badge>
            )}
          </div>
          <div className="px-1 py-3">
            <h3 className="truncate text-lg font-semibold">{barber.name}</h3>
            <p className="truncate text-sm text-foreground-muted">{barber.phone}</p>

            <Button
              variant="outline"
              className="mt-3 flex w-full cursor-pointer flex-row border-none bg-card-secondary hover:bg-card-hover"
              asChild
            >
              <Link href={`/barber/${barber.id}`}>
                <Calendar /> {nameButton}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Layout */}
      <Card className="hidden lg:block group overflow-hidden rounded-2xl border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
        <CardContent className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={barber.photo}
              alt={barber.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {averageRating && averageRating > 0 && (
              <Badge
                className="absolute top-3 left-3 bg-card/20 backdrop-blur-md border-card-border text-card-foreground"
                variant="secondary"
              >
                <StarIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
              </Badge>
            )}
          </div>
          <div className="p-4">
            <h3 className="mb-1 text-lg font-bold text-card-foreground truncate">{barber.name}</h3>
            <p className="mb-3 text-sm text-muted-foreground truncate">{barber.phone}</p>

            <Button
              variant="outline"
              className="w-full border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              asChild
            >
              <Link href={`/barber/${barber.id}`} className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                {nameButton}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Barbers;
