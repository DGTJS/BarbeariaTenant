import { Card, CardContent } from "@/_components/ui/card";
import { Skeleton } from "@/_components/ui/skeleton";

export function AppointmentCardSkeleton() {
  return (
    <Card className="border-0 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Status Badge e ID */}
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Service Name */}
            <Skeleton className="h-6 w-3/4 mb-2" />

            {/* Barber Info */}
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Service Details */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Date Card */}
          <div className="ml-4 text-center">
            <div className="rounded-lg bg-booking-card p-3 backdrop-blur-sm space-y-2">
              <Skeleton className="h-3 w-12 mx-auto" />
              <Skeleton className="h-8 w-8 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AppointmentCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <AppointmentCardSkeleton key={i} />
      ))}
    </div>
  );
}
