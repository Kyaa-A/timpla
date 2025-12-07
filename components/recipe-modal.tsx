"use client";

import { useState } from "react";
import { ClockIcon, UsersIcon, FireIcon, PrinterIcon } from "./icons";

interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

interface Substitution {
  original: string;
  substitute: string;
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
  ingredients: Ingredient[];
  instructions: string[];
  tips: string[];
  substitutions: Substitution[];
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  isLoading: boolean;
}

export default function RecipeModal({ isOpen, onClose, recipe, isLoading }: RecipeModalProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions" | "nutrition">("ingredients");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const handlePrint = () => {
    window.print();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              {isLoading ? (
                <div className="h-8 w-64 bg-white/20 rounded animate-pulse"></div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{recipe?.name}</h2>
                  <p className="text-emerald-100 mt-1">{recipe?.description}</p>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Stats */}
          {!isLoading && recipe && (
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                <span className="text-sm">{recipe.totalTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                <span className="text-sm">{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2">
                <FireIcon className="w-5 h-5" />
                <span className="text-sm">{recipe.calories} cal</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Generating recipe details...</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && recipe && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {(["ingredients", "instructions", "nutrition"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {activeTab === "ingredients" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Ingredients</h3>
                    <span className="text-sm text-gray-500">
                      {checkedIngredients.size}/{recipe.ingredients.length} checked
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, index) => (
                      <li
                        key={index}
                        onClick={() => toggleIngredient(index)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          checkedIngredients.has(index)
                            ? "bg-emerald-50 dark:bg-emerald-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            checkedIngredients.has(index)
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {checkedIngredients.has(index) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`flex-1 ${
                            checkedIngredients.has(index)
                              ? "line-through text-gray-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <strong>{ing.amount} {ing.unit}</strong> {ing.item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {recipe.substitutions && recipe.substitutions.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Substitutions</h4>
                      <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                        {recipe.substitutions.map((sub, index) => (
                          <li key={index}>
                            <strong>{sub.original}:</strong> {sub.substitute}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "instructions" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Instructions</h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>

                  {recipe.tips && recipe.tips.length > 0 && (
                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Chef&apos;s Tips</h4>
                      <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400 list-disc list-inside">
                        {recipe.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "nutrition" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Nutrition Facts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Per serving</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{recipe.calories}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{recipe.nutrition.protein}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Carbs", value: recipe.nutrition.carbs, color: "text-orange-600 dark:text-orange-400" },
                      { label: "Fat", value: recipe.nutrition.fat, color: "text-yellow-600 dark:text-yellow-400" },
                      { label: "Fiber", value: recipe.nutrition.fiber, color: "text-green-600 dark:text-green-400" },
                      { label: "Sugar", value: recipe.nutrition.sugar, color: "text-pink-600 dark:text-pink-400" },
                      { label: "Sodium", value: recipe.nutrition.sodium, color: "text-purple-600 dark:text-purple-400" },
                    ].map((nutrient) => (
                      <div key={nutrient.label} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                        <p className={`text-xl font-semibold ${nutrient.color}`}>{nutrient.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{nutrient.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <PrinterIcon className="w-5 h-5" />
                Print Recipe
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
