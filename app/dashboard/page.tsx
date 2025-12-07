"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsSkeleton } from "@/components/skeleton";
import { ChartIcon, CalendarIcon, HeartIcon, FireIcon, SparklesIcon, HistoryIcon } from "@/components/icons";
import Link from "next/link";

interface Stats {
  totalMealPlans: number;
  totalMealsGenerated: number;
  favoritesCount: number;
  avgCalories: number;
  mostUsedDiet: string;
  recentMealPlans: number;
  dietTypeDistribution: Record<string, number>;
  monthlyTrend: { month: string; count: number }[];
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<{ stats: Stats }>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const stats = data?.stats;

  const getDietTypeColor = (dietType: string) => {
    const colors: Record<string, { bg: string; bar: string }> = {
      balanced: { bg: "bg-blue-100 dark:bg-blue-900/30", bar: "bg-gradient-to-r from-blue-400 to-blue-600" },
      vegetarian: { bg: "bg-green-100 dark:bg-green-900/30", bar: "bg-gradient-to-r from-green-400 to-green-600" },
      vegan: { bg: "bg-emerald-100 dark:bg-emerald-900/30", bar: "bg-gradient-to-r from-emerald-400 to-emerald-600" },
      keto: { bg: "bg-purple-100 dark:bg-purple-900/30", bar: "bg-gradient-to-r from-purple-400 to-purple-600" },
      paleo: { bg: "bg-orange-100 dark:bg-orange-900/30", bar: "bg-gradient-to-r from-orange-400 to-orange-600" },
      mediterranean: { bg: "bg-cyan-100 dark:bg-cyan-900/30", bar: "bg-gradient-to-r from-cyan-400 to-cyan-600" },
      "low-carb": { bg: "bg-yellow-100 dark:bg-yellow-900/30", bar: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
      "high-protein": { bg: "bg-red-100 dark:bg-red-900/30", bar: "bg-gradient-to-r from-red-400 to-red-600" },
    };
    return colors[dietType] || { bg: "bg-slate-100 dark:bg-slate-700", bar: "bg-gradient-to-r from-slate-400 to-slate-600" };
  };

  const maxCount = stats?.monthlyTrend ? Math.max(...stats.monthlyTrend.map(m => m.count), 1) : 1;

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 dark:from-emerald-600/10 dark:to-teal-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 dark:from-blue-600/10 dark:to-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-float">
              <ChartIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Your meal planning insights at a glance
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <StatsSkeleton />
        ) : isError ? (
          <div className="glass-card rounded-3xl p-8 text-center border-red-200/50 dark:border-red-800/30">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Failed to Load Statistics</h3>
            <p className="text-red-600/80 dark:text-red-400/80">Please refresh the page to try again.</p>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Plans */}
              <div className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-300/50 dark:hover:border-emerald-600/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <CalendarIcon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      All Time
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Plans</p>
                  <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stats.totalMealPlans}
                  </p>
                </div>
              </div>

              {/* Meals Generated */}
              <div className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-blue-300/50 dark:hover:border-blue-600/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      Total
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Meals Generated</p>
                  <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stats.totalMealsGenerated}
                  </p>
                </div>
              </div>

              {/* Favorites */}
              <div className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-rose-300/50 dark:hover:border-rose-600/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 dark:from-rose-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <HeartIcon className="w-7 h-7 text-white" filled />
                    </div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      Saved
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Favorites</p>
                  <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stats.favoritesCount}
                  </p>
                </div>
              </div>

              {/* Avg Calories */}
              <div className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-orange-300/50 dark:hover:border-orange-600/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 dark:from-orange-500/10 dark:to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <FireIcon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      Daily
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Avg. Calories</p>
                  <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stats.avgCalories.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Activity */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 dark:border-slate-700/50 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Monthly Activity
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Plans generated over the last 6 months
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center">
                    <ChartIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex items-end gap-3 h-48">
                  {stats.monthlyTrend.map((month, index) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {month.count}
                      </span>
                      <div className="w-full bg-slate-100/80 dark:bg-slate-700/50 rounded-2xl overflow-hidden h-36 flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 rounded-2xl transition-all duration-700 ease-out hover:from-emerald-500 hover:to-teal-300"
                          style={{
                            height: `${(month.count / maxCount) * 100}%`,
                            minHeight: month.count > 0 ? "16px" : "6px",
                            animationDelay: `${index * 150}ms`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {month.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diet Type Distribution */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 dark:border-slate-700/50 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Diet Preferences
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Distribution of your diet choices
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🥗</span>
                  </div>
                </div>
                {Object.keys(stats.dietTypeDistribution).length > 0 ? (
                  <div className="space-y-5">
                    {Object.entries(stats.dietTypeDistribution).map(([diet, count]) => {
                      const total = Object.values(stats.dietTypeDistribution).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      const colors = getDietTypeColor(diet);
                      return (
                        <div key={diet} className="group">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-lg ${colors.bar}`} />
                              <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{diet.replace("-", " ")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">{count}</span>
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="h-3 bg-slate-100/80 dark:bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.bar} rounded-full transition-all duration-700 ease-out group-hover:shadow-lg`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🥗</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">
                      No diet data available yet
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                      Generate some meal plans to see your preferences
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Highlight Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-emerald-100 text-sm font-semibold mb-3">
                    <span className="text-2xl">⭐</span>
                    Most Popular
                  </div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">Favorite Diet</h3>
                  <p className="text-4xl font-black capitalize tracking-tight">
                    {stats.mostUsedDiet || "None yet"}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-blue-100 text-sm font-semibold mb-3">
                    <span className="text-2xl">📅</span>
                    Recent Activity
                  </div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">This Week</h3>
                  <p className="text-4xl font-black tracking-tight">
                    {stats.recentMealPlans} <span className="text-xl font-semibold text-white/80">plans</span>
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-purple-100 text-sm font-semibold mb-3">
                    <span className="text-2xl">📊</span>
                    Average
                  </div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">Meals Per Plan</h3>
                  <p className="text-4xl font-black tracking-tight">
                    {stats.totalMealPlans > 0
                      ? Math.round(stats.totalMealsGenerated / stats.totalMealPlans)
                      : 0} <span className="text-xl font-semibold text-white/80">meals</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 dark:border-slate-700/50 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Jump to common tasks
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/mealplan"
                  className="group relative flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200/50 dark:border-emerald-800/50 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <SparklesIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="relative">
                    <p className="font-bold text-slate-900 dark:text-white">Generate Plan</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Create a new meal plan</p>
                  </div>
                </Link>
                <Link
                  href="/history"
                  className="group relative flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200/50 dark:border-blue-800/50 rounded-2xl hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <HistoryIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="relative">
                    <p className="font-bold text-slate-900 dark:text-white">View History</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Browse past plans</p>
                  </div>
                </Link>
                <Link
                  href="/favorites"
                  className="group relative flex items-center gap-4 p-5 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-200/50 dark:border-rose-800/50 rounded-2xl hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <HeartIcon className="w-7 h-7 text-white" filled />
                  </div>
                  <div className="relative">
                    <p className="font-bold text-slate-900 dark:text-white">Favorites</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View saved meals</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 p-12 text-center">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-full blur-xl opacity-50" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
                <ChartIcon className="w-14 h-14 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              No Data Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Start generating meal plans to see your statistics, insights, and dietary preferences here.
            </p>
            <Link
              href="/mealplan"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <SparklesIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Generate Your First Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
