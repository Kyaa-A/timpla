"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/spinner";
import { MealPlanSkeleton } from "@/components/skeleton";
import RecipeModal from "@/components/recipe-modal";
import SwapMealModal from "@/components/swap-meal-modal";
import CalendarView from "@/components/calendar-view";
import {
  HeartIcon,
  DownloadIcon,
  ShoppingCartIcon,
  SparklesIcon,
  RefreshIcon,
  CheckIcon,
  BookOpenIcon,
  SwapIcon,
  StarIcon,
  CalendarIcon,
} from "@/components/icons";

interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}

interface MealPlanData {
  mealPlan: { [day: string]: DailyMealPlan };
}

interface ShoppingItem {
  name: string;
  quantity: string;
  unit?: string;
}

interface ShoppingList {
  [category: string]: ShoppingItem[];
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

interface Alternative {
  name: string;
  calories: number;
  quickDescription: string;
}

interface MealRatings {
  [key: string]: number;
}

export default function MealPlanDashboard() {
  const [formData, setFormData] = useState({
    dietType: "balanced",
    calories: "2000",
    allergies: "",
    cuisine: "",
    snacks: true,
    days: "7",
  });

  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [savedMealPlanId, setSavedMealPlanId] = useState<string | null>(null);

  // Recipe Modal State
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  // Swap Meal Modal State
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapAlternatives, setSwapAlternatives] = useState<Alternative[]>([]);
  const [swapLoading, setSwapLoading] = useState(false);
  const [currentSwapMeal, setCurrentSwapMeal] = useState<{
    day: string;
    mealType: string;
    mealName: string;
  } | null>(null);

  // Meal Ratings State
  const [mealRatings, setMealRatings] = useState<MealRatings>({});

  // View Mode State (list or calendar)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Fetch user preferences
  const { data: preferencesData } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await fetch("/api/preferences");
      if (!response.ok) return null;
      return response.json();
    },
  });

  // Load user preferences into form
  useEffect(() => {
    if (preferencesData?.preferences) {
      const prefs = preferencesData.preferences;
      setFormData({
        dietType: prefs.defaultDietType || "balanced",
        calories: String(prefs.defaultCalories || 2000),
        allergies: prefs.allergies || "",
        cuisine: prefs.preferredCuisine || "",
        snacks: prefs.includeSnacks ?? true,
        days: String(prefs.defaultPlanDays || 7),
      });
    }
  }, [preferencesData]);

  const generateMealPlan = async (data: typeof formData) => {
    const response = await fetch("/api/generate-mealplan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate meal plan");
    }

    return response.json();
  };

  const { mutate, data, isPending } = useMutation<MealPlanData, Error, typeof formData>({
    mutationFn: generateMealPlan,
    onSuccess: () => {
      toast.success("Meal plan generated successfully!");
      setSavedMealPlanId(null);
      setShoppingList(null);
      setShowShoppingList(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate meal plan");
    },
  });

  const saveMealPlanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/mealplans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          planData: data?.mealPlan,
        }),
      });
      if (!response.ok) throw new Error("Failed to save meal plan");
      return response.json();
    },
    onSuccess: (result) => {
      setSavedMealPlanId(result.mealPlan.id);
      toast.success("Meal plan saved to history!");
    },
    onError: () => {
      toast.error("Failed to save meal plan");
    },
  });

  const shoppingListMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealPlan: data?.mealPlan }),
      });
      if (!response.ok) throw new Error("Failed to generate shopping list");
      return response.json();
    },
    onSuccess: (result) => {
      setShoppingList(result.shoppingList);
      setShowShoppingList(true);
      toast.success("Shopping list generated!");
    },
    onError: () => {
      toast.error("Failed to generate shopping list");
    },
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: async ({
      mealDay,
      mealType,
      mealName,
    }: {
      mealDay: string;
      mealType: string;
      mealName: string;
    }) => {
      if (!savedMealPlanId) {
        // First save the meal plan
        const saveResponse = await fetch("/api/mealplans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            planData: data?.mealPlan,
          }),
        });
        if (!saveResponse.ok) throw new Error("Failed to save meal plan");
        const savedPlan = await saveResponse.json();
        setSavedMealPlanId(savedPlan.mealPlan.id);

        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mealPlanId: savedPlan.mealPlan.id,
            mealDay,
            mealType,
            mealName,
            calories: extractCalories(mealName),
          }),
        });
        if (!response.ok) throw new Error("Failed to add to favorites");
        return response.json();
      }

      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealPlanId: savedMealPlanId,
          mealDay,
          mealType,
          mealName,
          calories: extractCalories(mealName),
        }),
      });
      if (!response.ok) throw new Error("Failed to add to favorites");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Added to favorites!");
    },
    onError: () => {
      toast.error("Failed to add to favorites");
    },
  });

  const extractCalories = (mealDescription: string): number | null => {
    const match = mealDescription.match(/(\d+)\s*calories/i);
    return match ? parseInt(match[1]) : null;
  };

  // Fetch recipe details
  const fetchRecipeDetails = async (mealName: string) => {
    setRecipeLoading(true);
    setRecipeModalOpen(true);
    setSelectedRecipe(null);

    try {
      const response = await fetch("/api/recipe-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealName,
          dietType: formData.dietType,
          allergies: formData.allergies,
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

  // Fetch swap alternatives
  const fetchSwapAlternatives = async (day: string, mealType: string, mealName: string) => {
    setSwapLoading(true);
    setSwapModalOpen(true);
    setSwapAlternatives([]);
    setCurrentSwapMeal({ day, mealType, mealName });

    try {
      const response = await fetch("/api/swap-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentMeal: mealName,
          mealType,
          dietType: formData.dietType,
          calories: Math.round(parseInt(formData.calories) / 4), // Approximate per-meal calories
          allergies: formData.allergies,
          cuisine: formData.cuisine,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch alternatives");

      const data = await response.json();
      setSwapAlternatives(data.alternatives || []);
    } catch {
      toast.error("Failed to load alternatives");
      setSwapModalOpen(false);
    } finally {
      setSwapLoading(false);
    }
  };

  // Handle meal swap selection
  const handleSwapMeal = (newMealName: string) => {
    if (!currentSwapMeal || !data?.mealPlan) return;

    const { day, mealType } = currentSwapMeal;

    // Update the meal plan data
    const updatedMealPlan = { ...data.mealPlan };
    if (updatedMealPlan[day]) {
      updatedMealPlan[day] = {
        ...updatedMealPlan[day],
        [mealType]: newMealName,
      };
    }

    // We need to update the data - since we're using useMutation,
    // we'll create a manual update
    data.mealPlan = updatedMealPlan;

    setSwapModalOpen(false);
    setCurrentSwapMeal(null);
    toast.success("Meal swapped successfully!");
  };

  // Handle meal rating
  const handleRateMeal = (day: string, mealType: string, rating: number) => {
    const key = `${day}-${mealType}`;
    setMealRatings((prev) => ({ ...prev, [key]: rating }));
    toast.success(`Rated ${rating} stars!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const downloadAsPDF = () => {
    if (!data?.mealPlan) return;

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create printable content with enhanced styling
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Meal Plan - TIMPLA</title>
          <style>
            @page { margin: 1cm; }
            * { box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              color: #1f2937;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #059669;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #059669;
              margin-bottom: 5px;
            }
            .subtitle {
              color: #6b7280;
              font-size: 14px;
            }
            .meta-info {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              justify-content: center;
              margin: 20px 0;
              padding: 15px;
              background: #f0fdf4;
              border-radius: 8px;
            }
            .meta-item {
              text-align: center;
            }
            .meta-label {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .meta-value {
              font-weight: bold;
              color: #059669;
            }
            .day {
              margin-bottom: 25px;
              page-break-inside: avoid;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              overflow: hidden;
            }
            .day-header {
              color: white;
              background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
              padding: 12px 16px;
              font-size: 18px;
              font-weight: bold;
            }
            .day-content {
              padding: 16px;
            }
            .meal {
              margin: 10px 0;
              padding: 12px;
              background: #f9fafb;
              border-radius: 8px;
              border-left: 4px solid #10b981;
            }
            .meal-type {
              font-weight: bold;
              color: #059669;
              display: inline-block;
              min-width: 80px;
            }
            .meal-icon {
              margin-right: 8px;
            }
            .footer {
              color: #6b7280;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
            }
            .generated-date {
              font-size: 11px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TIMPLA</div>
            <p class="subtitle">Tailored Intelligent Meal Planning Lifestyle Assistant</p>
          </div>

          <div class="meta-info">
            <div class="meta-item">
              <div class="meta-label">Duration</div>
              <div class="meta-value">${formData.days} Days</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Diet Type</div>
              <div class="meta-value">${formData.dietType.charAt(0).toUpperCase() + formData.dietType.slice(1)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Daily Calories</div>
              <div class="meta-value">${formData.calories} kcal</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Cuisine</div>
              <div class="meta-value">${formData.cuisine || "Various"}</div>
            </div>
            ${formData.allergies ? `
            <div class="meta-item">
              <div class="meta-label">Restrictions</div>
              <div class="meta-value">${formData.allergies}</div>
            </div>
            ` : ""}
          </div>

          ${Object.entries(data.mealPlan)
            .map(
              ([day, meals]) => `
            <div class="day">
              <div class="day-header">${day}</div>
              <div class="day-content">
                ${Object.entries(meals)
                  .map(
                    ([mealType, meal]) => {
                      const icon = mealType.toLowerCase() === "breakfast" ? "🌅" :
                                   mealType.toLowerCase() === "lunch" ? "☀️" :
                                   mealType.toLowerCase() === "dinner" ? "🌙" : "🍎";
                      return `
                    <div class="meal">
                      <span class="meal-icon">${icon}</span>
                      <span class="meal-type">${mealType}:</span> ${meal}
                    </div>
                  `;
                    }
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}

          <div class="footer">
            <p>Generated by <strong>TIMPLA</strong> - Your AI-Powered Meal Planning Assistant</p>
            <p class="generated-date">Generated on ${today}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return "🌅";
      case "lunch":
        return "☀️";
      case "dinner":
        return "🌙";
      case "snacks":
        return "🍎";
      default:
        return "🍽️";
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return { bg: "from-amber-400 to-orange-500", light: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" };
      case "lunch":
        return { bg: "from-sky-400 to-blue-500", light: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400" };
      case "dinner":
        return { bg: "from-violet-400 to-purple-500", light: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400" };
      case "snacks":
        return { bg: "from-rose-400 to-pink-500", light: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400" };
      default:
        return { bg: "from-emerald-400 to-teal-500", light: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" };
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-5 shadow-sm">
            <SparklesIcon className="w-4 h-4" />
            AI-Powered Meal Planning
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            Create Your Perfect
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Meal Plan
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Personalized nutrition tailored to your dietary preferences, health goals, and lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Preferences
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Customize your plan</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Diet Type
                    </label>
                    <select
                      name="dietType"
                      value={formData.dietType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="balanced">Balanced</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                      <option value="mediterranean">Mediterranean</option>
                      <option value="low-carb">Low Carb</option>
                      <option value="high-protein">High Protein</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Daily Calories
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium"
                        placeholder="2000"
                        min="1000"
                        max="5000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">kcal</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Allergies & Restrictions
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white resize-none"
                      placeholder="e.g., nuts, dairy, gluten"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Preferred Cuisine
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
                      placeholder="e.g., Italian, Asian, Mexican"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Plan Duration
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["3", "5", "7", "14"].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, days }))}
                          className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            formData.days === days
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          {days}d
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, snacks: !prev.snacks }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        formData.snacks ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          formData.snacks ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Include Snacks
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:-translate-y-0.5 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:shadow-none flex items-center justify-center gap-3"
                  >
                    {isPending ? (
                      <>
                        <Spinner />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate Plan</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🍽️</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Your Meal Plan
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {data?.mealPlan ? `${Object.keys(data.mealPlan).length} days of delicious meals` : "Generate a plan to get started"}
                    </p>
                  </div>
                </div>

                {data?.mealPlan && (
                  <div className="flex flex-wrap gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-700/50 p-1">
                      <button
                        onClick={() => setViewMode("list")}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          viewMode === "list"
                            ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        List
                      </button>
                      <button
                        onClick={() => setViewMode("calendar")}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          viewMode === "calendar"
                            ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <CalendarIcon className="w-4 h-4" />
                        Calendar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {data?.mealPlan && (
                <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => saveMealPlanMutation.mutate()}
                    disabled={saveMealPlanMutation.isPending || !!savedMealPlanId}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-xl hover:shadow-lg hover:shadow-emerald-500/10 transition-all text-sm font-semibold disabled:opacity-50"
                  >
                    {savedMealPlanId ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        Saved
                      </>
                    ) : saveMealPlanMutation.isPending ? (
                      <>
                        <Spinner />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Save Plan
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => shoppingListMutation.mutate()}
                    disabled={shoppingListMutation.isPending}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all text-sm font-semibold disabled:opacity-50"
                  >
                    {shoppingListMutation.isPending ? (
                      <>
                        <Spinner />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ShoppingCartIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Shopping List
                      </>
                    )}
                  </button>

                  <button
                    onClick={downloadAsPDF}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50 text-purple-700 dark:text-purple-400 rounded-xl hover:shadow-lg hover:shadow-purple-500/10 transition-all text-sm font-semibold"
                  >
                    <DownloadIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Export PDF
                  </button>

                  <button
                    onClick={() => mutate(formData)}
                    disabled={isPending}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm font-semibold"
                  >
                    <RefreshIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Regenerate
                  </button>
                </div>
              )}

              {/* Shopping List Panel */}
              {showShoppingList && shoppingList && (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <ShoppingCartIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Shopping List</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need for your meal plan</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowShoppingList(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Object.entries(shoppingList).map(([category, items]) => (
                      <div key={category} className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          {category}
                        </h4>
                        <ul className="space-y-2">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 group">
                              <span className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0 group-hover:border-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors cursor-pointer" />
                              <span>{item.quantity} {item.unit} {item.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              {isPending ? (
                <MealPlanSkeleton />
              ) : data?.mealPlan ? (
                viewMode === "calendar" ? (
                  <CalendarView
                    mealPlan={data.mealPlan}
                    onMealClick={(day, mealType, meal) => fetchRecipeDetails(meal)}
                  />
                ) : (
                  <div className="space-y-5">
                    {Object.entries(data.mealPlan).map(([day, meals], dayIdx) => (
                      <div
                        key={day}
                        className="group bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden meal-card-animate hover:shadow-lg transition-all duration-300"
                        style={{ animationDelay: `${dayIdx * 100}ms` }}
                      >
                        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                              {dayIdx + 1}
                            </span>
                            {day}
                          </h3>
                          <span className="text-sm text-white/80 font-medium">
                            {Object.keys(meals).length} meals
                          </span>
                        </div>
                        <div className="p-5 space-y-4">
                          {Object.entries(meals).map(([mealType, meal]) => {
                            const ratingKey = `${day}-${mealType}`;
                            const currentRating = mealRatings[ratingKey] || 0;
                            const colors = getMealColor(mealType);

                            return (
                              <div
                                key={mealType}
                                className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-md group/meal"
                              >
                                <div className="flex items-start gap-4">
                                  <div className={`flex-shrink-0 w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center text-xl shadow-sm`}>
                                    {getMealIcon(mealType)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <span className={`text-sm font-bold ${colors.text}`}>
                                        {mealType}
                                      </span>
                                    </div>
                                    <p
                                      className="text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                      onClick={() => fetchRecipeDetails(meal)}
                                      title="Click to view recipe"
                                    >
                                      {meal}
                                    </p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                  <button
                                    onClick={() => fetchRecipeDetails(meal)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all hover:scale-105"
                                    title="View full recipe"
                                  >
                                    <BookOpenIcon className="w-3.5 h-3.5" />
                                    Recipe
                                  </button>

                                  <button
                                    onClick={() => fetchSwapAlternatives(day, mealType, meal)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all hover:scale-105"
                                    title="Swap this meal"
                                  >
                                    <SwapIcon className="w-3.5 h-3.5" />
                                    Swap
                                  </button>

                                  <button
                                    onClick={() =>
                                      addToFavoritesMutation.mutate({
                                        mealDay: day,
                                        mealType,
                                        mealName: meal,
                                      })
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all hover:scale-105"
                                    title="Add to favorites"
                                  >
                                    <HeartIcon className="w-3.5 h-3.5" />
                                    Save
                                  </button>

                                  {/* Star Rating */}
                                  <div className="flex items-center gap-0.5 ml-auto">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        onClick={() => handleRateMeal(day, mealType, star)}
                                        className="p-1 transition-transform hover:scale-125"
                                        title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                      >
                                        <StarIcon
                                          className={`w-4 h-4 ${
                                            star <= currentRating
                                              ? "text-amber-400"
                                              : "text-slate-200 dark:text-slate-600"
                                          }`}
                                          filled={star <= currentRating}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-20">
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-full blur-xl opacity-50" />
                    <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
                      <span className="text-6xl">🍽️</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Ready to Plan Your Meals?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
                    Fill out your preferences and let our AI create a personalized meal plan tailored just for you.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      Personalized
                    </span>
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      Nutritious
                    </span>
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 bg-purple-500 rounded-full" />
                      Delicious
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        recipe={selectedRecipe}
        isLoading={recipeLoading}
      />

      {/* Swap Meal Modal */}
      <SwapMealModal
        isOpen={swapModalOpen}
        onClose={() => {
          setSwapModalOpen(false);
          setCurrentSwapMeal(null);
        }}
        onSelect={handleSwapMeal}
        alternatives={swapAlternatives}
        isLoading={swapLoading}
        currentMeal={currentSwapMeal?.mealName || ""}
      />
    </div>
  );
}
