"use client";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const BarberLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="relative h-[400px] lg:h-[500px] w-full">
        <Skeleton className="h-full w-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="absolute top-4 right-4">
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-16 w-20 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories skeleton */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-16 rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services skeleton */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-slate-700/30 border-slate-600">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <Skeleton className="h-48 sm:h-32 sm:w-32 md:h-36 md:w-36" />
                          <div className="flex-1 p-4 space-y-3">
                            <div className="space-y-2">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-8 w-20" />
                              <Skeleton className="h-10 w-24" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Contact info skeleton */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardContent>
            </Card>

            {/* Reviews skeleton */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border-b border-slate-700 pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Skeleton key={j} className="h-4 w-4" />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberLoading;
