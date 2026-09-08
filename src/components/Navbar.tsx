"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/whatsapp";
import { Phone, ShoppingBag, Crown, ShieldAlert } from "lucide-react";

export function Navbar() {
  const { config, cartCount, cartSubtotal, setIsCartOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-[#111317]/95 backdrop-blur-md border-b border-[#222631]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Crown Motif */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cheezious-yellow to-amber-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Crown className="w-6 h-6 text-black fill-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-cheezious-yellow uppercase font-sans">
                {config.brandName || "CHEEZIOUS"}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-cheezious-textMuted font-medium tracking-tight -mt-1 hidden sm:block">
              {config.slogan || "Delivering Cheezy Khushiyan"}
            </span>
          </div>
        </Link>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hotline Quick Dial */}
          <a
            href={`tel:${config.hotline.replace(/[^0-9]/g, "")}`}
            className="hidden md:flex items-center gap-2.5 bg-[#1A1D24] hover:bg-[#222631] text-white px-3.5 py-2 rounded-xl border border-[#222631] text-xs font-semibold transition-all group"
            title="Call Cheezious Hotline"
          >
            <div className="w-7 h-7 rounded-lg bg-cheezious-yellow/10 flex items-center justify-center text-cheezious-yellow group-hover:bg-cheezious-yellow group-hover:text-black transition-colors">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-cheezious-textMuted uppercase tracking-wider leading-none">
                UAN Hotline
              </p>
              <p className="font-bold text-cheezious-yellow text-sm leading-tight">
                {config.hotline}
              </p>
            </div>
          </a>

          {/* Admin Portal Link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#222631] text-cheezious-textMuted hover:text-white border border-[#222631] text-xs font-medium transition-all"
            title="Manage Store in Admin Portal"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cheezious-yellow" />
            <span className="hidden sm:inline">Admin Portal</span>
          </Link>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-glow active:scale-95 group"
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
