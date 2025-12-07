export interface Plan {
  name: string;
  amount: number;
  currency: string;
  interval: string;
  isPopular?: boolean;
  description: string;
  features: string[];
}

export const availablePlans: Plan[] = [
  {
    name: "Weekly Plan",
    amount: 49,
    currency: "PHP",
    interval: "week",
    description:
      "Great if you want to try the service before committing longer.",
    features: [
      "Unlimited AI meal plans",
      "AI Nutrition Insights",
      "Cancel Anytime",
    ],
  },
  {
    name: "Monthly Plan",
    amount: 149,
    currency: "PHP",
    interval: "month",
    isPopular: true,
    description:
      "Perfect for ongoing, month-to-month meal planning and features.",
    features: [
      "Unlimited AI meal plans",
      "Priority AI support",
      "Cancel Anytime",
    ],
  },
  {
    name: "Yearly Plan",
    amount: 999,
    currency: "PHP",
    interval: "year",
    description:
      "Best value for those committed to improving their diet long-term",
    features: [
      "Unlimited AI meal plans",
      "All premium features",
      "Cancel Anytime",
    ],
  },
];

// Get plan details by type
export const getPlanByType = (planType: string) => {
  return availablePlans.find((plan) => plan.interval === planType);
};

// Convert amount to centavos for PayMongo (PHP)
export const getAmountInCentavos = (planType: string): number => {
  const plan = getPlanByType(planType);
  if (!plan) return 0;
  // PayMongo requires amount in centavos (smallest currency unit)
  return plan.amount * 100; // Convert PHP to centavos
};
