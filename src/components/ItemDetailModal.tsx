"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MenuItem } from "@/data/defaultCheezious";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/whatsapp";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Flame,
  Sparkles,
  ShieldCheck,
  Ban,
  Utensils,
} from "lucide-react";

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const { config, addToCart, setIsCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity to 1 whenever a new item is selected
  useEffect(() => {
    if (item) {
      setQuantity(1);
    }
  }, [item]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!item) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleIncrement = () => {
    if (quantity < 50) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!item.isAvailable) return;
    addToCart(item, quantity);
    onClose();
    // Smoothly open the cart drawer so the customer can review their items
    setIsCartOpen(true);
  };

  const totalPrice = item.price * quantity;
  const isSignature = item.badge === "Signature";
  const isBestseller = item.badge === "Bestseller" || item.badge === "Most Popular";
  const isSpicy = item.badge === "Spicy" || item.badge === "Hot";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 dark:bg-black/85 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
    >
      <div
        className="relative bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl my-6 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-white/90 dark:bg-[#16181F]/90 backdrop-blur-md text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 border border-black/5 dark:border-white/10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Food Photo */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-[#111317]">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 550px"
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
            {item.badge && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1 rounded-lg shadow-lg tracking-wider ${
                  isSpicy
                    ? "bg-cheezious-red text-white"
                    : isSignature
                    ? "bg-cheezious-yellow text-black"
                    : isBestseller
                    ? "bg-amber-500 text-black"
                    : "bg-white text-black"
                }`}
              >
                {isSpicy && <Flame className="w-3.5 h-3.5 fill-white" />}
                {isSignature && <Sparkles className="w-3.5 h-3.5 fill-black" />}
                <span>{item.badge}</span>
              </span>
            )}
          </div>

          {/* Sold Out Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20">
              <Ban className="w-10 h-10 text-rose-500 mb-2" />
              <span className="text-white font-black text-sm uppercase tracking-widest bg-rose-600 px-3 py-1 rounded-md">
                Currently Sold Out
              </span>
              <p className="text-gray-300 text-xs mt-1.5">
                This item is temporarily unavailable at our branch.
              </p>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Category & Title */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-cheezious-yellow mb-1 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>{item.category}</span>
            </div>
            <h3
              id="item-modal-title"
              className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight"
            >
              {item.name}
            </h3>
          </div>

          {/* Price & Savings */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-cheezious-yellow">
              {formatPrice(item.price, config.currency)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <>
                <span className="text-sm font-medium text-neutral-400 dark:text-cheezious-textMuted line-through">
                  {formatPrice(item.originalPrice, config.currency)}
                </span>
                <span className="text-xs font-bold text-cheezious-red bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                  Save {formatPrice(item.originalPrice - item.price, config.currency)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-neutral-600 dark:text-cheezious-textMuted text-sm leading-relaxed">
            {item.description}
          </p>

          {/* Highlights / Badges */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-neutral-900 dark:text-white block leading-none">
                  100% Authentic
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted">
                  Fresh Cheezious recipe
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 dark:text-cheezious-yellow shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-neutral-900 dark:text-white block leading-none">
                  Freshly Baked
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted">
                  Hot oven preparation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar: Quantity & Add to Cart */}
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-[#14171E] border-t border-gray-200 dark:border-[#222631] flex flex-col sm:flex-row items-center gap-3">
          {/* Quantity Selector */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-white dark:bg-[#1A1D24] p-1.5 rounded-2xl border border-gray-200 dark:border-[#222631] shadow-sm">
            <button
              type="button"
              disabled={quantity <= 1 || !item.isAvailable}
              onClick={handleDecrement}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-neutral-800 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-10 text-center font-black text-base text-neutral-900 dark:text-white select-none">
              {quantity}
            </span>

            <button
              type="button"
              disabled={quantity >= 50 || !item.isAvailable}
              onClick={handleIncrement}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-neutral-800 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA Button */}
          {item.isAvailable ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full flex-1 bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-extrabold h-12 px-5 rounded-2xl text-sm flex items-center justify-between shadow-glow transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({quantity})</span>
              </div>
              <span className="bg-black/10 px-2.5 py-1 rounded-xl font-black">
                {formatPrice(totalPrice, config.currency)}
              </span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full flex-1 bg-gray-200 dark:bg-[#222631] text-neutral-400 dark:text-neutral-500 font-bold h-12 px-5 rounded-2xl text-sm flex items-center justify-center cursor-not-allowed"
            >
              Item Currently Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
