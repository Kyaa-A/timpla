"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { TableSkeleton } from "@/components/skeleton";
import { HeartIcon, TrashIcon, FireIcon, SparklesIcon, BookOpenIcon } from "@/components/icons";
import Link from "next/link";
import { useState } from "react";
import RecipeModal from "@/components/recipe-modal";

interface Favorite {
  id: string;
  userId: string;
  mealPlanId: string;
  mealDay: string;
  mealType: string;
  mealName: string;
  calories: number | null;
  createdAt: string;
  mealPlan: {
    id: string;
    name: string;
    dietType: string;
  };
}

interface Recipe {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: string;
  calories: number;
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
  };
  ingredients: { item: string; amount: string; unit: string }[];
  instructions: string[];
  tips: string[];
  substitutions: { original: string; substitute: string }[];
}

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  const { data, isLoading, isError } = useQuery<{ favorites: Favorite[] }>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await fetch("/api/favorites");
      if (!response.ok) throw new Error("Failed to fetch favorites");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/favorites?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove favorite");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to remove favorite");
    },
  });

  const fetchRecipeDetails = async (mealName: string, dietType: string) => {
    setRecipeLoading(true);
    setRecipeModalOpen(true);
    setSelectedRecipe(null);

    try {
      const response = await fetch("/api/recipe-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealName,
          dietType,
          allergies: "",
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch recipe");

      const data = await response.json();
      setSelectedRecipe(data.recipe);
    } catch {
      toast.error("Failed to load recipe details");
      setRecipeModalOpen(false);
    } finally {
      setRecipeLoading(false);
    }
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

  const getMealTypeColor = (mealType: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      breakfast: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800/50" },
      lunch: { bg: "bg-sky-50 dark:bg-sky-900/20", text: "text-sky-700 dark:text-sky-400", border: "border-sky-200 dark:border-sky-800/50" },
      dinner: { bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800/50" },
      snacks: { bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800/50" },
    };
    return colors[mealType.toLowerCase()] || { bg: "bg-slate-50 dark:bg-slate-700/50", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" };
  };

  const groupedByMealType = data?.favorites.reduce((acc, fav) => {
    const type = fav.mealType.toLowerCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(fav);
    return acc;
  }, {} as Record<string, Favorite[]>);

  const mealTypeOrder = ["breakfast", "lunch", "dinner", "snacks"];
  const sortedGroups = groupedByMealType
    ? Object.entries(groupedByMealType).sort(([a], [b]) =>
        mealTypeOrder.indexOf(a) - mealTypeOrder.indexOf(b)
      )
    : [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-rose-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/25">
              <HeartIcon className="w-7 h-7 text-white" filled />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Favorite Meals
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Your collection of saved favorite meals
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
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Failed to Load Favorites</h3>
            <p className="text-red-600 dark:text-red-400/80">Please refresh the page to try again.</p>
          </div>
        ) : data?.favorites && data.favorites.length > 0 ? (
          <div className="space-y-10">
            {sortedGroups.map(([mealType, favorites]) => {
              const colors = getMealTypeColor(mealType);
              return (
                <div key={mealType}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <span className="text-2xl">{getMealIcon(mealType)}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                        {mealType}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {favorites.length} saved {favorites.length === 1 ? "meal" : "meals"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favorites.map((favorite) => {
                      const typeColors = getMealTypeColor(favorite.mealType);
                      return (
                        <div
                          key={favorite.id}
                          className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                        >
                          {/* Header */}
                          <div className={`${typeColors.bg} ${typeColors.border} border-b px-5 py-3 flex items-center justify-between`}>
                            <span className={`inline-flex items-center gap-2 text-sm font-semibold ${typeColors.text}`}>
                              <span>{getMealIcon(favorite.mealType)}</span>
                              {favorite.mealType}
                            </span>
                            <button
                              onClick={() => {
                                if (confirm("Remove this meal from favorites?")) {
                                  deleteMutation.mutate(favorite.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <p className="text-slate-900 dark:text-white font-medium mb-4 line-clamp-3 leading-relaxed">
                              {favorite.mealName}
                            </p>

                            <div className="flex items-center justify-between text-sm mb-4">
                              {favorite.calories ? (
                                <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium">
                                  <FireIcon className="w-4 h-4" />
                                  {favorite.calories} cal
                                </span>
                              ) : (
                                <span />
                              )}
                              <span className="text-slate-500 dark:text-slate-500 text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                {favorite.mealDay}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                              <button
                                onClick={() => fetchRecipeDetails(favorite.mealName, favorite.mealPlan.dietType)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all"
                              >
                                <BookOpenIcon className="w-4 h-4" />
                                View Recipe
                              </button>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 truncate">
                              From: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{favorite.mealPlan.name}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-pink-200 dark:from-rose-900/50 dark:to-pink-900/50 rounded-full blur-xl opacity-50" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                <HeartIcon className="w-14 h-14 text-rose-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No Favorites Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              You haven&apos;t saved any favorite meals yet. Click the heart icon on any meal in your generated meal plan to save it here.
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

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        recipe={selectedRecipe}
        isLoading={recipeLoading}
      />
    </div>
  );
}
