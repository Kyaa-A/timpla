"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { TableSkeleton } from "@/components/skeleton";
import { TrashIcon, CalendarIcon, FireIcon, HistoryIcon, SparklesIcon, ChevronDownIcon } from "@/components/icons";
import Link from "next/link";
import { useState } from "react";

interface MealPlan {
  id: string;
  name: string;
  dietType: string;
  calories: number;
  allergies: string | null;
  cuisine: string | null;
  days: number;
  snacks: boolean;
  planData: Record<string, Record<string, string>>;
  createdAt: string;
  _count?: {
    favorites: number;
  };
}

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<{ mealPlans: MealPlan[] }>({
    queryKey: ["mealplans"],
    queryFn: async () => {
      const response = await fetch("/api/mealplans");
      if (!response.ok) throw new Error("Failed to fetch meal plans");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/mealplans/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete meal plan");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealplans"] });
      toast.success("Meal plan deleted");
    },
    onError: () => {
      toast.error("Failed to delete meal plan");
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDietTypeColor = (dietType: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      balanced: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
      vegetarian: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
      vegan: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
      keto: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
      paleo: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
      mediterranean: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-400" },
      "low-carb": { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400" },
      "high-protein": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
    };
    return colors[dietType] || { bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-700 dark:text-slate-300" };
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast": return "🌅";
      case "lunch": return "☀️";
      case "dinner": return "🌙";
      case "snacks": return "🍎";
      default: return "🍽️";
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast": return "text-amber-600 dark:text-amber-400";
      case "lunch": return "text-sky-600 dark:text-sky-400";
      case "dinner": return "text-violet-600 dark:text-violet-400";
      case "snacks": return "text-rose-600 dark:text-rose-400";
      default: return "text-emerald-600 dark:text-emerald-400";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <HistoryIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Meal Plan History
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                View and manage your saved meal plans
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : isError ? (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Failed to Load History</h3>
            <p className="text-red-600 dark:text-red-400/80">Please refresh the page to try again.</p>
          </div>
        ) : data?.mealPlans && data.mealPlans.length > 0 ? (
          <div className="space-y-4">
            {data.mealPlans.map((plan, index) => {
              const dietColors = getDietTypeColor(plan.dietType);
              const isExpanded = expandedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div
                    className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                    onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Plan Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {plan.name}
                          </h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${dietColors.bg} ${dietColors.text}`}>
                            {plan.dietType}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <CalendarIcon className="w-4 h-4 text-emerald-500" />
                            <span className="font-medium">{plan.days}</span> days
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <FireIcon className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">{plan.calories}</span> cal/day
                          </span>
                          {plan.cuisine && (
                            <span className="text-slate-500 dark:text-slate-500">
                              {plan.cuisine} cuisine
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 flex items-center gap-1">
                          <span>Created</span>
                          <span className="font-medium">{formatDate(plan.createdAt)}</span>
                          <span>at</span>
                          <span className="font-medium">{formatTime(plan.createdAt)}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this meal plan?")) {
                              deleteMutation.mutate(plan.id);
                            }
                          }}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all"
                          title="Delete meal plan"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        <div className={`p-2.5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                          <ChevronDownIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="border-t border-slate-200 dark:border-slate-700 p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {Object.entries(plan.planData).map(([day, meals], dayIndex) => (
                          <div
                            key={day}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
                              <h4 className="font-bold text-white flex items-center gap-2">
                                <span className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center text-xs">
                                  {dayIndex + 1}
                                </span>
                                {day}
                              </h4>
                            </div>
                            <div className="p-4 space-y-3">
                              {Object.entries(meals).map(([mealType, meal]) => (
                                <div key={mealType} className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm">{getMealIcon(mealType)}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-bold uppercase tracking-wide ${getMealColor(mealType)}`}>
                                      {mealType}
                                    </p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mt-0.5">
                                      {meal}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full blur-xl opacity-50" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                <span className="text-5xl">📋</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No Meal Plans Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              You haven&apos;t saved any meal plans yet. Generate your first meal plan and save it to see it here.
            </p>
            <Link
              href="/mealplan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02]"
            >
              <SparklesIcon className="w-5 h-5" />
              Generate Meal Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
