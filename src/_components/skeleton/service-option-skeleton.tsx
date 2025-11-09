import { Card, CardContent } from "@/_components/ui/card";
import { Skeleton } from "@/_components/ui/skeleton";

export function ServiceOptionSkeleton() {
  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Imagem */}
          <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />

          {/* Conteúdo */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />

            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ServiceOptionsSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceOptionSkeleton key={i} />
      ))}
    </div>
  );
}
