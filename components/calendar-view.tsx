"use client";

import { useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}

interface MealPlanData {
  [day: string]: DailyMealPlan;
}

interface CalendarViewProps {
  mealPlan: MealPlanData;
  onMealClick?: (day: string, mealType: string, meal: string) => void;
}

// Add missing icon components
function ChevronLeftIconLocal({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIconLocal({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

const MEAL_COLORS = {
  Breakfast: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Lunch: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Dinner: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  Snacks: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800",
};

const MEAL_ICONS = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
  Snacks: "🍎",
};

export default function CalendarView({ mealPlan, onMealClick }: CalendarViewProps) {
  const days = Object.keys(mealPlan);
  const [currentWeekStart, setCurrentWeekStart] = useState(0);
  const daysPerPage = 7;

  const visibleDays = days.slice(currentWeekStart, currentWeekStart + daysPerPage);
  const canGoPrev = currentWeekStart > 0;
  const canGoNext = currentWeekStart + daysPerPage < days.length;

  const getMealPreview = (meal: string) => {
    // Get the meal name before " - " or truncate
    const parts = meal.split(" - ");
    const name = parts[0];
    return name.length > 30 ? name.substring(0, 27) + "..." : name;
  };

  const getCalories = (meal: string) => {
    const match = meal.match(/(\d+)\s*calories?/i);
    return match ? `${match[1]} cal` : null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold">Calendar View</h3>
              <p className="text-purple-100 text-sm">Your weekly meal schedule</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeekStart(Math.max(0, currentWeekStart - daysPerPage))}
              disabled={!canGoPrev}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIconLocal className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium px-3">
              {visibleDays[0]} - {visibleDays[visibleDays.length - 1]}
            </span>
            <button
              onClick={() => setCurrentWeekStart(currentWeekStart + daysPerPage)}
              disabled={!canGoNext}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIconLocal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 overflow-x-auto">
        {/* Days Header */}
        <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(140px, 1fr))` }}>
          {visibleDays.map((day) => (
            <div
              key={day}
              className="text-center py-2 px-3 bg-slate-100 dark:bg-slate-700 rounded-lg"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Meals Grid */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(140px, 1fr))` }}>
          {visibleDays.map((day) => (
            <div key={day} className="space-y-2">
              {Object.entries(mealPlan[day] || {}).map(([mealType, meal]) => (
                <button
                  key={`${day}-${mealType}`}
                  onClick={() => onMealClick?.(day, mealType, meal)}
                  className={`w-full text-left p-3 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-md ${
                    MEAL_COLORS[mealType as keyof typeof MEAL_COLORS] || "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{MEAL_ICONS[mealType as keyof typeof MEAL_ICONS] || "🍽️"}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
                      {mealType}
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-tight mb-1">
                    {getMealPreview(meal)}
                  </p>
                  {getCalories(meal) && (
                    <span className="text-xs opacity-60">{getCalories(meal)}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-wrap items-center gap-4 justify-center text-xs">
          {Object.entries(MEAL_ICONS).map(([mealType, icon]) => (
            <div key={mealType} className="flex items-center gap-1.5">
              <span>{icon}</span>
              <span className="text-slate-600 dark:text-slate-400">{mealType}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
