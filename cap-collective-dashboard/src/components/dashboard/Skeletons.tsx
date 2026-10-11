'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function StatCardSkeleton() {
  return (
    <Card variant="outlined" padding="md">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </Card>
  );
}

export function ChartSkeleton({ title = 'Chart' }) {
  return (
    <Card variant="outlined" padding="md" className="h-full">
      <CardHeader>
        <CardTitle className="animate-pulse h-5 w-48 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent>
        <div className="animate-pulse h-72 w-full bg-gray-100 rounded" />
      </CardContent>
    </Card>
  );
}

export function LeaderboardSkeleton() {
  return (
    <Card variant="outlined" padding="md">
      <CardHeader>
        <div className="animate-pulse h-5 w-40 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 px-2 py-2">
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded mt-1" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded text-right" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SensorStatusSkeleton() {
  return (
    <Card variant="outlined" padding="md">
      <CardHeader>
        <div className="animate-pulse h-5 w-40 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-3">
              <div className="h-9 w-9 rounded-lg bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded mt-1" />
              </div>
              <div className="w-40 h-6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}