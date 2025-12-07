"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function SuccessPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Success Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-emerald-500 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Payment Successful!
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
          Thank you{isLoaded && user ? `, ${user.firstName}` : ""}! Your subscription is now active.
        </p>

        <p className="text-slate-500 dark:text-slate-500 mb-8">
          You now have access to all premium features including unlimited AI meal plans.
        </p>

        {/* Features unlocked */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 mb-8 shadow-xl border border-slate-200/80 dark:border-slate-700/80">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Features Unlocked:</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Unlimited AI Meal Plans
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Recipe Details
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Shopping Lists
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Favorites & History
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02]"
          >
            Go to Dashboard
          </button>

          <p className="text-sm text-slate-500 dark:text-slate-500">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
