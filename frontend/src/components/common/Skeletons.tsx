export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-64 bg-gray-100 rounded-lg"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 bg-gray-200 rounded w-40"></div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded w-48"></div>
          <div className="h-10 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BalanceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-40 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
      <div className="h-24 bg-gray-100 rounded-lg"></div>
    </div>
  );
}

export function CardsSectionSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4"></div>
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-12 h-12 bg-gray-200 rounded-full"></div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
      {/* Left Column */}
      <div className="lg:col-span-8 space-y-6">
        <SummaryCardsSkeleton />
        <ChartSkeleton />
        <TableSkeleton />
      </div>

      {/* Right Column */}
      <div className="lg:col-span-4 space-y-6">
        <BalanceCardSkeleton />
        <CardsSectionSkeleton />
      </div>
    </div>
  );
}
