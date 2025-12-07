"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import { availablePlans } from "@/lib/plans";
import { Spinner } from "@/components/spinner";
import { SparklesIcon, CheckIcon } from "@/components/icons";

export default function SubscribePage() {
  const { user } = useUser();

  const checkoutMutation = useMutation({
    mutationFn: async (planType: string) => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
          userId: user?.id,
          email: user?.emailAddresses[0]?.emailAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const { url } = await response.json();
      window.location.href = url;
    },
    onSuccess: () => {
      toast.success("Redirecting to checkout...");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleSubscribe = (planType: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }
    checkoutMutation.mutate(planType);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-12 sm:py-20">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <SparklesIcon className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Unlock AI-powered meal planning with unlimited access to all premium features
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {availablePlans.map((plan, index) => (
            <div
              key={plan.interval}
              className={`relative group ${plan.isPopular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl shadow-emerald-500/25">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`relative h-full bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl transition-all duration-500 ${
                  plan.isPopular
                    ? "border-2 border-emerald-500 shadow-emerald-500/10 hover:shadow-emerald-500/20"
                    : "border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-2xl"
                } group-hover:-translate-y-2`}
              >
                {/* Decorative Background */}
                {plan.isPopular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-3xl" />
                )}

                <div className="relative p-8 sm:p-10">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      plan.isPopular
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                        : "bg-slate-100 dark:bg-slate-700"
                    }`}>
                      <span className="text-2xl">
                        {index === 0 ? "🌱" : index === 1 ? "⭐" : "💎"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-slate-900 dark:text-white">₱{plan.amount}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-2 text-lg">/{plan.interval}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.isPopular
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : "bg-slate-100 dark:bg-slate-700"
                        }`}>
                          <CheckIcon className={`w-3 h-3 ${
                            plan.isPopular
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-600 dark:text-slate-400"
                          }`} />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.interval)}
                    disabled={checkoutMutation.isPending}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600"
                    }`}
                  >
                    {checkoutMutation.isPending ? (
                      <>
                        <Spinner />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Started</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="text-center mt-16 sm:mt-20">
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
            All plans include a 30-day money-back guarantee
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 px-5 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 px-5 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Secure payment</span>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 px-5 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">24/7 support</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Yes! You can upgrade or downgrade your plan at any time from your profile settings.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                We accept GCash, GrabPay, Maya, and all major credit/debit cards through our secure payment provider.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                How does the money-back guarantee work?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                If you&apos;re not satisfied within the first 30 days, contact us for a full refund - no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
