export function MealPlanSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((day, index) => (
        <div
          key={day}
          className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="bg-gradient-to-r from-slate-200 dark:from-slate-700 to-slate-300 dark:to-slate-600 px-6 py-4 animate-pulse">
            <div className="h-6 w-28 bg-slate-300 dark:bg-slate-600 rounded-lg" />
          </div>
          <div className="p-5 space-y-4">
            {[1, 2, 3, 4].map((meal) => (
              <div key={meal} className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Skeleton */}
        <div className="mb-10 animate-pulse">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div>
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2" />
              <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden animate-pulse">
              <div className="bg-gradient-to-br from-slate-200 dark:from-slate-700 to-slate-300 dark:to-slate-600 p-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-300 dark:bg-slate-600 rounded-full mb-4" />
                <div className="h-6 w-36 bg-slate-300 dark:bg-slate-600 rounded-lg mb-2" />
                <div className="h-4 w-48 bg-slate-300 dark:bg-slate-600 rounded" />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2].map((card) => (
              <div key={card} className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  <div>
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2" />
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i, index) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2" />
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
            <div className="h-44 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Highlight Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i, index) => (
          <div
            key={i}
            className="bg-slate-200 dark:bg-slate-700 rounded-2xl p-6 animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="h-4 w-24 bg-slate-300 dark:bg-slate-600 rounded mb-2" />
            <div className="h-5 w-32 bg-slate-300 dark:bg-slate-600 rounded mb-2" />
            <div className="h-10 w-28 bg-slate-300 dark:bg-slate-600 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 animate-pulse"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded mt-2" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FavoritesSkeleton() {
  return (
    <div className="space-y-10">
      {[1, 2, 3].map((group, groupIndex) => (
        <div key={group}>
          <div className="flex items-center gap-3 mb-5 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div>
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg mb-1" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((card, index) => (
              <div
                key={card}
                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden animate-pulse"
                style={{ animationDelay: `${(groupIndex * 3 + index) * 50}ms` }}
              >
                <div className="bg-slate-100 dark:bg-slate-700/50 px-5 py-3 flex items-center justify-between">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-600 rounded" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecipeModalSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="h-7 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-3" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-2" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded mx-auto mb-2" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-600 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Nutrition */}
      <div>
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="h-5 w-10 bg-slate-200 dark:bg-slate-600 rounded mx-auto mb-1" />
              <div className="h-3 w-12 bg-slate-200 dark:bg-slate-600 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <div className="h-6 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <div className="h-6 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
