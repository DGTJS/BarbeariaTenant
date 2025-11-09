import { Card, CardContent } from "@/_components/ui/card";
import { Skeleton } from "@/_components/ui/skeleton";

export function ServiceCardSkeleton() {
  return (
    <>
      {/* Mobile Layout */}
      <Card className="flex max-w-[160px] min-w-[175px] rounded-2xl p-1 lg:hidden">
        <CardContent className="p-0 px-1 pt-1">
          <div className="relative h-[159px] w-full">
            <Skeleton className="h-full w-full rounded-2xl" />
            <Skeleton className="absolute top-2 left-2 h-6 w-12 rounded-md" />
          </div>
          <div className="px-1 py-3 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full rounded-md mt-3" />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Layout */}
      <Card className="hidden lg:block overflow-hidden rounded-2xl border-0 bg-card/50">
        <CardContent className="p-0">
          <div className="relative h-48 w-full">
            <Skeleton className="h-full w-full" />
            <Skeleton className="absolute top-3 left-3 h-6 w-16 rounded-md" />
          </div>
          <div className="p-6 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function ServiceCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {/* Mobile */}
      <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden lg:hidden">
        {Array.from({ length: count }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
