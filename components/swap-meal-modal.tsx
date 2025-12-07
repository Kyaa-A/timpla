"use client";

import { SwapIcon } from "./icons";

interface Alternative {
  name: string;
  calories: number;
  quickDescription: string;
}

interface SwapMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (meal: string) => void;
  alternatives: Alternative[];
  isLoading: boolean;
  currentMeal: string;
}

export default function SwapMealModal({
  isOpen,
  onClose,
  onSelect,
  alternatives,
  isLoading,
  currentMeal,
}: SwapMealModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <SwapIcon className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Swap Meal</h2>
                <p className="text-blue-100 text-sm mt-1">Choose an alternative</p>
              </div>
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
        </div>

        {/* Current Meal */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Current meal</p>
          <p className="text-gray-700 dark:text-gray-300 font-medium">{currentMeal}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Finding alternatives...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select one of these alternatives:
              </p>
              {alternatives.map((alt, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(alt.name)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {alt.name.split(" - ")[0]}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {alt.quickDescription}
                      </p>
                    </div>
                    <span className="ml-4 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full whitespace-nowrap">
                      {alt.calories} cal
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
