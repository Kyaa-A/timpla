import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full m-0 p-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen w-full flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />

        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 dark:from-emerald-600/20 dark:to-teal-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-teal-400/30 to-cyan-400/30 dark:from-teal-600/20 dark:to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-full blur-3xl" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container relative z-10 mx-auto px-6 w-full py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="mb-8 inline-block">
              <span className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-emerald-500/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                AI-Powered Lifestyle Assistant
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white mb-6 leading-none tracking-tight">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  TIMPLA
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-500/20 blur-2xl -z-10" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-4 font-medium tracking-wide">
              Tailored Intelligent Meal Planning Lifestyle Assistant
            </p>

            {/* Description */}
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your nutrition journey with AI-powered meal plans that adapt to your lifestyle,
              dietary preferences, and health goals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/mealplan"
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-3"
              >
                <span className="relative z-10">Get Started Free</span>
                <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/subscribe"
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-700 dark:text-slate-200 border-2 border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-600 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3"
              >
                <span>View Plans</span>
                <span className="text-xl group-hover:scale-110 transition-transform">💎</span>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { icon: "✨", label: "Personalized Plans" },
                { icon: "📊", label: "Nutrition Tracking" },
                { icon: "🤖", label: "AI Insights" },
                { icon: "🛒", label: "Shopping Lists" },
              ].map((feature, index) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-base">{feature.icon}</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Food Elements */}
        <div className="absolute top-24 left-[10%] text-5xl opacity-20 animate-float hidden md:block">🥗</div>
        <div className="absolute top-48 right-[15%] text-4xl opacity-15 animate-float-delayed hidden md:block">🍎</div>
        <div className="absolute bottom-32 left-[15%] text-4xl opacity-15 animate-float hidden md:block">🥑</div>
        <div className="absolute bottom-48 right-[10%] text-3xl opacity-20 animate-float-delayed hidden md:block">🥕</div>
        <div className="absolute top-1/2 left-[5%] text-3xl opacity-15 animate-float hidden lg:block">🍳</div>
        <div className="absolute top-1/3 right-[5%] text-3xl opacity-15 animate-float-delayed hidden lg:block">🥦</div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 sm:py-32 w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-white dark:bg-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent" />

        <div className="container relative z-10 mx-auto px-6 w-full">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Simple Process
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              How It <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Get your personalized meal plan in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {[
              { step: 1, icon: "👤", title: "Create Profile", description: "Sign up and tell us about your dietary preferences, health goals, and lifestyle." },
              { step: 2, icon: "⚙️", title: "Set Preferences", description: "Specify your calorie goals, dietary restrictions, and cuisine preferences." },
              { step: 3, icon: "🍽️", title: "Get Your Plan", description: "Receive your AI-generated meal plan with detailed recipes and nutrition info." },
            ].map((item, index) => (
              <div key={item.step} className="group relative">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800/50 dark:to-transparent" />
                )}

                <div className="relative text-center p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner">
                    <span className="text-4xl">{item.icon}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32 w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-6 w-full">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Features
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">TIMPLA?</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience the future of meal planning with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              { icon: "🤖", title: "AI-Powered Intelligence", description: "Advanced AI creates personalized meal plans based on your unique preferences and dietary needs.", gradient: "from-emerald-500 to-teal-500", bgGradient: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30" },
              { icon: "⚡", title: "Lightning Fast", description: "Generate complete weekly meal plans in seconds, not hours of manual planning.", gradient: "from-yellow-500 to-orange-500", bgGradient: "from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30" },
              { icon: "🎯", title: "Precision Nutrition", description: "Every meal is calculated for optimal nutrition, calories, and macro balance.", gradient: "from-red-500 to-pink-500", bgGradient: "from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30" },
              { icon: "🛒", title: "Smart Shopping Lists", description: "Automatically generate organized shopping lists from your meal plans with one click.", gradient: "from-blue-500 to-indigo-500", bgGradient: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30" },
              { icon: "❤️", title: "Save Favorites", description: "Bookmark your favorite meals and access them anytime for quick meal planning.", gradient: "from-pink-500 to-rose-500", bgGradient: "from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30" },
              { icon: "📊", title: "Track Progress", description: "View your meal planning history and track your nutrition journey over time.", gradient: "from-cyan-500 to-blue-500", bgGradient: "from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-300/50 dark:hover:border-emerald-600/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Hover Glow */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.bgGradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="relative py-24 sm:py-32 w-full overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-slate-900" />

        <div className="container relative z-10 mx-auto px-6 w-full">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-purple-500/10">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              New Features
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Just <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Released</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We&apos;ve been busy! Check out our latest features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "📖", title: "Recipe Details", description: "Click any meal to see full recipes with ingredients and step-by-step instructions.", gradient: "from-blue-500 to-indigo-500", border: "border-blue-200 dark:border-blue-800/50" },
              { icon: "🔄", title: "Meal Swapping", description: "Don't like a meal? Swap it instantly with AI-suggested alternatives.", gradient: "from-emerald-500 to-teal-500", border: "border-emerald-200 dark:border-emerald-800/50" },
              { icon: "⭐", title: "Meal Ratings", description: "Rate your meals to help us learn your preferences and improve suggestions.", gradient: "from-amber-500 to-yellow-500", border: "border-amber-200 dark:border-amber-800/50" },
              { icon: "📅", title: "Calendar View", description: "See your entire week at a glance with our beautiful calendar view.", gradient: "from-purple-500 to-pink-500", border: "border-purple-200 dark:border-purple-800/50" },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border-2 ${feature.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Gradient Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`} />

                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{feature.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "50K+", label: "Meal Plans Generated" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "24/7", label: "AI Availability" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-4xl lg:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-emerald-100 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Nutrition?
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Join thousands of users who have simplified their meal planning with TIMPLA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-3"
              >
                <span className="relative z-10">Start Free Today</span>
                <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/subscribe"
                className="group bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <span>View Pricing</span>
                <span className="text-xl">💎</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-white tracking-tight">
                TIM<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">PLA</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm">
              <Link href="/subscribe" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/mealplan" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium">
                Generate Plan
              </Link>
              <Link href="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium">
                Dashboard
              </Link>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-slate-800 w-full text-center">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} TIMPLA. Tailored Intelligent Meal Planning Lifestyle Assistant.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
