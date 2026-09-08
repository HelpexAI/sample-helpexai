"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/data/defaultCheezious";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/whatsapp";
import { Plus, Flame, Sparkles, Check, Heart, Ban } from "lucide-react";

interface FoodCardProps {
  item: MenuItem;
}

export function FoodCard({ item }: FoodCardProps) {
  const { config, addToCart, cart } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  // Check how many of this item is in the cart
  const cartItem = cart.find((ci) => ci.item.id === item.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  // Badge stylings
  const isSignature = item.badge === "Signature";
  const isBestseller = item.badge === "Bestseller" || item.badge === "Most Popular";
  const isSpicy = item.badge === "Spicy" || item.badge === "Hot";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#1A1D24] border border-[#222631] overflow-hidden transition-all duration-300 hover:border-cheezious-borderLight hover:shadow-card hover:-translate-y-1 ${
        !item.isAvailable ? "opacity-75 grayscale-[0.5]" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16181F]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Dark Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D24] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {item.badge && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-md shadow-md tracking-wider ${
                isSpicy
                  ? "bg-cheezious-red text-white"
                  : isSignature
                  ? "bg-cheezious-yellow text-black"
                  : isBestseller
                  ? "bg-amber-500 text-black"
                  : "bg-white text-black"
              }`}
            >
              {isSpicy && <Flame className="w-3 h-3 fill-white" />}
              {isSignature && <Sparkles className="w-3 h-3 fill-black" />}
              {item.badge}
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center z-20">
            <Ban className="w-7 h-7 text-rose-500 mb-1" />
            <span className="text-white font-black text-xs sm:text-sm uppercase tracking-widest bg-rose-600/80 px-2.5 py-1 rounded-md">
              Sold Out
            </span>
            <span className="text-gray-400 text-[10px] mt-1">
              Currently unavailable
            </span>
          </div>
        )}

        {/* Quantity in Cart indicator */}
        {inCartQty > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-cheezious-yellow text-black font-extrabold text-xs px-2 py-0.5 rounded-full shadow-lg z-10">
            {inCartQty} in cart
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cheezious-yellow/80 mb-1">
            {item.category}
          </div>
          <h4 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-cheezious-yellow transition-colors">
            {item.name}
          </h4>
          <p className="text-cheezious-textMuted text-xs mt-1.5 line-clamp-2 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#222631] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-cheezious-yellow font-black text-base sm:text-lg">
                {formatPrice(item.price, config.currency)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-cheezious-textMuted text-xs line-through">
                  {formatPrice(item.originalPrice, config.currency)}
                </span>
              )}
            </div>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-[10px] font-bold text-cheezious-red">
                Save {formatPrice(item.originalPrice - item.price, config.currency)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {item.isAvailable ? (
            <button
              onClick={handleAdd}
              className={`h-9 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
                justAdded
                  ? "bg-emerald-500 text-white"
                  : "bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black shadow-glow"
              }`}
              aria-label={`Add ${item.name} to cart`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span className="hidden xs:inline">Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="h-9 px-3 rounded-xl font-medium text-xs bg-[#222631] text-gray-500 cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
