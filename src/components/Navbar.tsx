"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/whatsapp";
import { Phone, ShoppingBag, Crown, ShieldAlert, Sun, Moon } from "lucide-react";

export function Navbar() {
  const { config, cartCount, cartSubtotal, setIsCartOpen, theme, toggleTheme } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111317]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#222631] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Crown Motif */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cheezious-yellow to-amber-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Crown className="w-6 h-6 text-black fill-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-amber-500 dark:text-cheezious-yellow uppercase font-sans">
                {config.brandName || "CHEEZIOUS"}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-cheezious-textMuted font-medium tracking-tight -mt-1 hidden sm:block">
              {config.slogan || "Delivering Cheezy Khushiyan"}
            </span>
          </div>
        </Link>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Hotline Quick Dial */}
          <a
            href={`tel:${config.hotline.replace(/[^0-9]/g, "")}`}
            className="hidden md:flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-900 dark:text-white px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] text-xs font-semibold transition-all group"
            title="Call Cheezious Hotline"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 dark:bg-cheezious-yellow/10 flex items-center justify-center text-amber-600 dark:text-cheezious-yellow group-hover:bg-cheezious-yellow group-hover:text-black transition-colors">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-neutral-500 dark:text-cheezious-textMuted uppercase tracking-wider leading-none">
                UAN Hotline
              </p>
              <p className="font-bold text-amber-600 dark:text-cheezious-yellow text-sm leading-tight">
                {config.hotline}
              </p>
            </div>
          </a>

          {/* Admin Portal Link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-700 hover:text-neutral-900 dark:text-cheezious-textMuted dark:hover:text-white border border-gray-200 dark:border-[#222631] text-xs font-medium transition-all"
            title="Manage Store in Admin Portal"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
            <span className="hidden sm:inline">Admin Portal</span>
          </Link>

          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-700 dark:text-cheezious-yellow border border-gray-200 dark:border-[#222631] transition-all active:scale-95 flex items-center gap-1.5"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold hidden lg:inline text-neutral-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-neutral-700" />
                <span className="text-xs font-bold hidden lg:inline text-neutral-700">Dark</span>
              </>
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-glow active:scale-95 group"
            aria-label="View Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-cheezious-red text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-black/15 px-2 py-0.5 rounded-md font-extrabold text-xs">
                {formatPrice(cartSubtotal, config.currency)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
