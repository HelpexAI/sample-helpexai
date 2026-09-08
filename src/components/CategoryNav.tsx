"use client";

import React, { useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CategoryNav({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: CategoryNavProps) {
  const { config } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const categories = ["All Items", ...config.categories];

  return (
    <div className="sticky top-20 z-30 bg-[#111317]/95 backdrop-blur-md border-b border-[#222631] py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cheezious-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pizza, burger, pasta..."
              className="w-full bg-[#1A1D24] text-white text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-cheezious-textMuted transition-colors"
            />
          </div>

          {/* Categories Pill Scroll Area */}
          <div className="relative flex-1 flex items-center min-w-0">
            {/* Scroll Left Button */}
            <button
              onClick={() => scroll("left")}
              className="hidden lg:flex shrink-0 w-7 h-7 rounded-full bg-[#1A1D24] border border-[#222631] text-cheezious-textMuted hover:text-white items-center justify-center mr-1 shadow-sm transition-colors"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count =
                  cat === "All Items"
                    ? config.items.length
                    : config.items.filter((item) => item.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                      isActive
                        ? "bg-cheezious-yellow text-black shadow-glow"
                        : "bg-[#1A1D24] text-cheezious-textLight hover:bg-[#222631] hover:text-white border border-[#222631]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                        isActive
                          ? "bg-black/20 text-black"
                          : "bg-[#222631] text-cheezious-textMuted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => scroll("right")}
              className="hidden lg:flex shrink-0 w-7 h-7 rounded-full bg-[#1A1D24] border border-[#222631] text-cheezious-textMuted hover:text-white items-center justify-center ml-1 shadow-sm transition-colors"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
