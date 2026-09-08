"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { AgencyHeaderBanner, AgencyFooterBanner } from "@/components/AgencyBanner";
import { Navbar } from "@/components/Navbar";
import { CategoryNav } from "@/components/CategoryNav";
import { FoodCard } from "@/components/FoodCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
  ShoppingBag,
  ArrowRight,
  Pizza,
} from "lucide-react";

export default function HomePage() {
  const { config, setIsCartOpen, cartCount } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter items based on active category and search
  const filteredItems = useMemo(() => {
    return config.items.filter((item) => {
      const matchesCategory =
        activeCategory === "All Items" || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [config.items, activeCategory, searchQuery]);

  // Group items by category when viewing "All Items" with no search
  const groupedCategories = useMemo(() => {
    if (activeCategory !== "All Items" || searchQuery.trim() !== "") {
      return null;
    }
    return config.categories.map((category) => ({
      name: category,
      items: config.items.filter((item) => item.category === category),
    }));
  }, [config.categories, config.items, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-cheezious-bg text-neutral-900 dark:text-white flex flex-col selection:bg-cheezious-yellow selection:text-black transition-colors duration-200">
      {/* Top Announcements & Agency Ribbon */}
      <AgencyHeaderBanner />

      {/* Main Header & Branding */}
      <Navbar />

      {/* Hero Visual Promo Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-[#F8F9FA] dark:from-[#191D26] dark:to-cheezious-bg border-b border-gray-200 dark:border-[#222631] py-8 sm:py-12 transition-colors duration-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-cheezious-yellow/10 border border-amber-500/30 dark:border-cheezious-yellow/30 text-amber-800 dark:text-cheezious-yellow text-xs font-bold tracking-wide">
                <Flame className="w-3.5 h-3.5 fill-current text-amber-600 dark:text-cheezious-yellow" />
                <span>OFFICIAL CHEEZIOUS TASTE & FAST ONLINE CHECKOUT</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
                Delivering <span className="text-amber-500 dark:text-cheezious-yellow">Cheezy Khushiyan</span> Right to Your Doorstep!
              </h1>
              <p className="text-neutral-600 dark:text-cheezious-textMuted text-sm sm:text-base leading-relaxed">
                Enjoy hot & fresh Crown Crust pizzas, double-crispy Bazinga burgers, fiery wings, and mouth-watering calzone chunks. Order in seconds directly via WhatsApp.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("menu-catalog");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black px-6 py-3 rounded-xl font-black text-sm transition-all shadow-glow flex items-center gap-2 active:scale-95"
                >
                  <Pizza className="w-4 h-4" />
                  <span>Explore Menu</span>
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-white hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-900 dark:text-white px-5 py-3 rounded-xl font-bold text-sm transition-all border border-gray-200 dark:border-[#222631] flex items-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-500 dark:text-cheezious-yellow" />
                  <span>View Cart ({cartCount})</span>
                </button>
              </div>
            </div>

            {/* Quick Promo Highlights */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto shrink-0">
              <div className="bg-white/90 dark:bg-[#1A1D24]/80 backdrop-blur-sm border border-gray-200 dark:border-[#222631] p-4 rounded-2xl flex flex-col justify-center shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-cheezious-yellow mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-neutral-900 dark:text-white font-extrabold text-sm sm:text-base">Hot & Quick</div>
                <div className="text-neutral-500 dark:text-cheezious-textMuted text-xs mt-0.5">30-45 mins delivery</div>
              </div>
              <div className="bg-white/90 dark:bg-[#1A1D24]/80 backdrop-blur-sm border border-gray-200 dark:border-[#222631] p-4 rounded-2xl flex flex-col justify-center shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-neutral-900 dark:text-white font-extrabold text-sm sm:text-base">100% Authentic</div>
                <div className="text-neutral-500 dark:text-cheezious-textMuted text-xs mt-0.5">Original recipes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Category Navigation & Filter */}
      <div id="menu-catalog">
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Menu Grid Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* If viewing All Items without search, display category by category */}
        {groupedCategories ? (
          <div className="space-y-12">
            {groupedCategories.map((group) => {
              if (group.items.length === 0) return null;
              return (
                <section key={group.name} id={`cat-${group.name.replace(/\s+/g, "-")}`} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222631] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-cheezious-yellow" />
                      <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                        {group.name}
                      </h2>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-cheezious-textMuted font-medium">
                      {group.items.length} item{group.items.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {group.items.map((item) => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Filtered or Searched view */
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222631] pb-3 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory}
                </h2>
                <span className="text-xs text-amber-700 dark:text-cheezious-yellow font-bold bg-amber-500/15 dark:bg-cheezious-yellow/10 px-2 py-0.5 rounded-full">
                  {filteredItems.length}
                </span>
              </div>
              {(activeCategory !== "All Items" || searchQuery) && (
                <button
                  onClick={() => {
                    setActiveCategory("All Items");
                    setSearchQuery("");
                  }}
                  className="text-xs text-amber-600 dark:text-cheezious-yellow hover:underline font-semibold"
                >
                  Reset filters
                </button>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-white dark:bg-[#1A1D24]/50 border border-gray-200 dark:border-[#222631] rounded-2xl p-8 shadow-sm">
                <div className="text-4xl">🍕</div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No dishes found</h3>
                <p className="text-neutral-500 dark:text-cheezious-textMuted text-xs max-w-sm mx-auto">
                  We could not find any items matching your search. Try another keyword or browse all categories!
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All Items");
                    setSearchQuery("");
                  }}
                  className="bg-cheezious-yellow text-black text-xs font-bold px-4 py-2 rounded-xl mt-2 shadow-sm"
                >
                  Show All Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar for Mobile */}
      {cartCount > 0 && (
        <div className="sm:hidden fixed bottom-4 inset-x-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-cheezious-yellow text-black font-extrabold py-3.5 px-5 rounded-2xl shadow-glow flex items-center justify-between active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center font-black">
                {cartCount}
              </div>
              <span className="text-sm">View Cheezy Bag</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-black">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer Modal */}
      <CartDrawer />

      {/* Agency Showcase Callout at Footer */}
      <AgencyFooterBanner />

      {/* Official Cheezious Footer */}
      <Footer />
    </div>
  );
}
