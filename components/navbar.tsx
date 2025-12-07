"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/nextjs";
import ThemeToggle from "./theme-toggle";
import { HistoryIcon, HeartIcon, ChartIcon, MenuIcon, CloseIcon, SparklesIcon } from "./icons";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isLoaded, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  if (!isLoaded) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl z-50 border-b border-white/20 dark:border-slate-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse hidden sm:block" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) => (
    <Link
      href={href}
      className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
        isActive(href)
          ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm"
          : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
      }`}
    >
      {Icon && (
        <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive(href) ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
      )}
      {children}
      {isActive(href) && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
      )}
    </Link>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20"
          : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <Image
                  src="/logo.png"
                  width={44}
                  height={44}
                  alt="TIMPLA logo"
                  className="relative rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
                />
              </div>
              <span className="font-black text-xl text-slate-900 dark:text-white hidden sm:block tracking-tight">
                TIM<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">PLA</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-1.5 border border-white/20 dark:border-slate-700/20">
              <SignedIn>
                <NavLink href="/mealplan" icon={SparklesIcon}>Generate</NavLink>
                <NavLink href="/dashboard" icon={ChartIcon}>Dashboard</NavLink>
                <NavLink href="/history" icon={HistoryIcon}>History</NavLink>
                <NavLink href="/favorites" icon={HeartIcon}>Favorites</NavLink>
              </SignedIn>

              <SignedOut>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/subscribe">Pricing</NavLink>
              </SignedOut>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <SignedIn>
                <div className="hidden md:flex items-center gap-3">
                  <ThemeToggle />

                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    className="group relative flex items-center gap-2 p-1 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
                  >
                    <div className="relative">
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          width={38}
                          height={38}
                          alt="Profile"
                          className="rounded-xl ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-all duration-300 group-hover:ring-emerald-500/50"
                        />
                      ) : (
                        <div className="w-[38px] h-[38px] bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                          {user?.firstName?.[0] || "U"}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                    </div>
                  </Link>

                  <SignOutButton>
                    <button className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 font-semibold">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                  >
                    {mobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                  </button>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="hidden md:flex items-center gap-3">
                  <ThemeToggle />
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="group relative px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>

                {/* Mobile */}
                <div className="md:hidden flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                  >
                    {mobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                  </button>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-700/50 px-4 py-4 space-y-2">
            <SignedIn>
              <Link
                href="/mealplan"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold ${
                  isActive("/mealplan")
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive("/mealplan")
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}>
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Generate</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Create meal plan</p>
                </div>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}>
                  <ChartIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Dashboard</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View statistics</p>
                </div>
              </Link>
              <Link
                href="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold ${
                  isActive("/history")
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive("/history")
                    ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}>
                  <HistoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">History</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Past meal plans</p>
                </div>
              </Link>
              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold ${
                  isActive("/favorites")
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive("/favorites")
                    ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}>
                  <HeartIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Favorites</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Saved meals</p>
                </div>
              </Link>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-3" />

              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 font-semibold"
              >
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    width={40}
                    height={40}
                    alt="Profile"
                    className="rounded-xl"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <p className="font-bold">{user?.firstName || "Profile"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Account settings</p>
                </div>
              </Link>

              <SignOutButton>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 font-semibold"
                >
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">Sign Out</p>
                    <p className="text-xs text-red-400 dark:text-red-400/70">End session</p>
                  </div>
                </button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3.5 text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 font-semibold"
              >
                Home
              </Link>
              <Link
                href="/subscribe"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3.5 text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 font-semibold"
              >
                Pricing
              </Link>
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-3" />
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3.5 text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-center font-bold shadow-lg shadow-emerald-500/30 mt-2"
              >
                Get Started Free
              </Link>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
