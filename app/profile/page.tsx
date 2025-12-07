"use client";

import { Spinner } from "@/components/spinner";
import { ProfileSkeleton } from "@/components/skeleton";
import { useUser, useClerk } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { availablePlans } from "@/lib/plans";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, FireIcon, ChartIcon, CheckIcon, HeartIcon, SparklesIcon } from "@/components/icons";
import Link from "next/link";

interface UserPreferences {
  defaultDietType: string;
  defaultCalories: number;
  allergies: string;
  preferredCuisine: string;
  includeSnacks: boolean;
  defaultPlanDays: number;
}

async function fetchSubscriptionStatus() {
  const response = await fetch("/api/profile/subscription-status");
  return response.json();
}

async function updatePlan(newPlan: string) {
  const response = await fetch("/api/profile/change-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPlan }),
  });
  return response.json();
}

async function unsubscribe() {
  const response = await fetch("/api/profile/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export default function Profile() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const { isLoaded, isSignedIn, user } = useUser();
  const { openUserProfile } = useClerk();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultDietType: "balanced",
    defaultCalories: 2000,
    allergies: "",
    preferredCuisine: "",
    includeSnacks: true,
    defaultPlanDays: 7,
  });

  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    enabled: isLoaded && isSignedIn,
  });

  // Fetch user preferences
  const { data: preferencesData, isLoading: preferencesLoading } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await fetch("/api/preferences");
      if (!response.ok) throw new Error("Failed to fetch preferences");
      return response.json();
    },
    enabled: isLoaded && isSignedIn,
  });

  // Update preferences state when data is fetched
  useEffect(() => {
    if (preferencesData?.preferences) {
      setPreferences(preferencesData.preferences);
    }
  }, [preferencesData]);

  // Mutation to save preferences
  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!response.ok) throw new Error("Failed to save preferences");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
      toast.success("Preferences saved!");
    },
    onError: () => {
      toast.error("Failed to save preferences");
    },
  });

  const { mutate: updatePlanMutation, isPending: isUpdatePlanPending } = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("Plan updated successfully!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update plan. Please try again.");
    },
  });

  const { mutate: unsubscribeMutation, isPending: isUnsubscribePending } = useMutation({
    mutationFn: unsubscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      router.push("/subscribe");
    },
    onError: () => {
      toast.error("Error Unsubscribing");
    },
  });

  const currentPlan = availablePlans.find(
    (plan) => plan.interval === subscription?.subscription.subscriptionTier
  );

  function handleUpdatePlan() {
    if (selectedPlan) {
      updatePlanMutation(selectedPlan);
    }
    setSelectedPlan("");
  }

  function handleUnsubscribe() {
    if (
      confirm(
        "Are you sure you want to unsubscribe? You will lose access to premium features at the end of your billing period."
      )
    ) {
      unsubscribeMutation();
    }
  }

  if (!isLoaded) {
    return <ProfileSkeleton />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sign In Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Please sign in to view your profile.</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Profile Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your account, subscription, and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
                {/* Profile Header */}
                <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-8 text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative">
                    {user.imageUrl ? (
                      <div className="relative w-24 h-24 mx-auto mb-4 group">
                        <Image
                          src={user.imageUrl}
                          alt="User Avatar"
                          width={96}
                          height={96}
                          className="rounded-full ring-4 ring-white/30 shadow-xl"
                        />
                        <button
                          onClick={() => openUserProfile()}
                          className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openUserProfile()}
                        className="relative w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-3xl text-white font-bold group cursor-pointer hover:bg-white/30 transition-all"
                      >
                        <span className="group-hover:opacity-0 transition-opacity">{user.firstName?.[0] || "U"}</span>
                        <svg className="w-6 h-6 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    )}
                    <h2 className="text-xl font-bold text-white mb-1">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-emerald-100 text-sm">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                    <button
                      onClick={() => openUserProfile()}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                {stats?.stats && (
                  <div className="p-6">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                      Your Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between group">
                        <span className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                          <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm">Total Plans</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">
                          {stats.stats.totalMealPlans}
                        </span>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                          <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FireIcon className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="text-sm">Avg. Calories</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">
                          {stats.stats.avgCalories}
                        </span>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                          <div className="w-9 h-9 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <HeartIcon className="w-4 h-4 text-rose-500" filled />
                          </div>
                          <span className="text-sm">Favorites</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">
                          {stats.stats.favoritesCount}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-all text-sm font-semibold"
                    >
                      <ChartIcon className="w-4 h-4" />
                      View Dashboard
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 p-6">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/mealplan"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                      <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Generate Plan</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Create a new meal plan</p>
                    </div>
                  </Link>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                      <HeartIcon className="w-5 h-5 text-white" filled />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Favorites</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">View saved meals</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-12">
                <div className="flex flex-col items-center justify-center">
                  <Spinner />
                  <span className="mt-4 text-slate-600 dark:text-slate-400">
                    Loading subscription details...
                  </span>
                </div>
              </div>
            ) : isError ? (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Failed to Load</h3>
                <p className="text-red-600 dark:text-red-400/80">{error?.message || "Error loading subscription"}</p>
              </div>
            ) : subscription ? (
              <>
                {/* Current Plan Card */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Current Plan
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Your active subscription</p>
                    </div>
                  </div>

                  {currentPlan ? (
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
                      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-3">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Active
                          </div>
                          <p className="text-3xl font-bold mb-1">
                            {currentPlan.name}
                          </p>
                          <p className="text-emerald-100">
                            ${currentPlan.amount} {currentPlan.currency} / {currentPlan.interval}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-5xl font-bold opacity-20">
                            ${currentPlan.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-6 text-center">
                      <p className="text-slate-600 dark:text-slate-400">Current plan not found.</p>
                    </div>
                  )}
                </div>

                {/* Change Plan Card */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Change Plan
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Switch to a different billing cycle</p>
                    </div>
                  </div>

                  {currentPlan && (
                    <div className="space-y-4">
                      <select
                        defaultValue={currentPlan?.interval}
                        className="w-full px-4 py-3.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                        disabled={isUpdatePlanPending}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                      >
                        <option value="" disabled>
                          Select New Plan
                        </option>
                        {availablePlans.map((plan, key) => (
                          <option key={key} value={plan.interval}>
                            {plan.name} - ${plan.amount} / {plan.interval}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleUpdatePlan}
                        disabled={!selectedPlan || isUpdatePlanPending}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        {isUpdatePlanPending ? (
                          <>
                            <Spinner />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Dietary Preferences Card */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Dietary Preferences
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Set your default meal plan settings
                        </p>
                      </div>
                    </div>
                    {preferencesLoading && <Spinner />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Diet Type */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Default Diet Type
                      </label>
                      <select
                        value={preferences.defaultDietType}
                        onChange={(e) => setPreferences({ ...preferences, defaultDietType: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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

                    {/* Daily Calories */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Daily Calories Target
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={preferences.defaultCalories}
                          onChange={(e) => setPreferences({ ...preferences, defaultCalories: parseInt(e.target.value) || 2000 })}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          min="1000"
                          max="5000"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">kcal</span>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Allergies & Restrictions
                      </label>
                      <textarea
                        value={preferences.allergies}
                        onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                        placeholder="e.g., nuts, dairy, gluten"
                        rows={2}
                      />
                    </div>

                    {/* Preferred Cuisine */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Cuisine
                      </label>
                      <input
                        type="text"
                        value={preferences.preferredCuisine}
                        onChange={(e) => setPreferences({ ...preferences, preferredCuisine: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="e.g., Italian, Asian, Mexican"
                      />
                    </div>

                    {/* Plan Duration */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Default Plan Duration
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[3, 5, 7, 14].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setPreferences({ ...preferences, defaultPlanDays: days })}
                            className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                              preferences.defaultPlanDays === days
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                            }`}
                          >
                            {days}d
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Include Snacks */}
                    <div className="md:col-span-2 flex items-center gap-3 py-2">
                      <button
                        type="button"
                        onClick={() => setPreferences({ ...preferences, includeSnacks: !preferences.includeSnacks })}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          preferences.includeSnacks ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            preferences.includeSnacks ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Include Snacks in Meal Plans
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => savePreferencesMutation.mutate(preferences)}
                      disabled={savePreferencesMutation.isPending}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      {savePreferencesMutation.isPending ? (
                        <>
                          <Spinner />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-red-200 dark:border-red-900/50 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                        Danger Zone
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Irreversible actions
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                    Once you unsubscribe, you will lose access to premium features at the end of your billing period. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleUnsubscribe}
                    disabled={isUnsubscribePending}
                    className={`px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 flex items-center justify-center gap-2 ${
                      isUnsubscribePending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isUnsubscribePending ? (
                      <>
                        <Spinner />
                        Unsubscribing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Unsubscribe
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  No Active Subscription
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Subscribe to unlock AI-powered meal planning, recipe details, shopping lists, and more.
                </p>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02]"
                >
                  <SparklesIcon className="w-5 h-5" />
                  View Plans
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
