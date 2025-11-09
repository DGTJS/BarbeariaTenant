import { Skeleton } from "@/_components/ui/skeleton";

export function TimeSlotSkeleton() {
  return <Skeleton className="h-12 min-w-[100px] rounded-lg" />;
}

export function TimeSlotSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <TimeSlotSkeleton key={i} />
      ))}
    </div>
  );
}
