"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/data/defaultCheezious";
import { X, Sparkles, AlertCircle } from "lucide-react";

interface DishModalProps {
  initialItem?: MenuItem | null;
  categories: string[];
  currency: string;
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}

export function DishModal({
  initialItem,
  categories,
  currency,
  onSave,
  onClose,
}: DishModalProps) {
  const isEditing = !!initialItem;

  const [id] = useState(initialItem?.id || `cz-${Date.now()}`);
  const [name, setName] = useState(initialItem?.name || "");
  const [category, setCategory] = useState(
    initialItem?.category || (categories[0] ?? "Special Pizza")
  );
  const [description, setDescription] = useState(initialItem?.description || "");
  const [price, setPrice] = useState<number>(initialItem?.price || 0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(
    initialItem?.originalPrice
  );
  const [badge, setBadge] = useState(initialItem?.badge || "");
  const [imageUrl, setImageUrl] = useState(
    initialItem?.imageUrl ||
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
  );
  const [isAvailable, setIsAvailable] = useState(
    initialItem ? initialItem.isAvailable : true
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a dish name.");
      return;
    }
    if (!category.trim()) {
      setError("Please select a category.");
      return;
    }
    if (price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Please provide an image URL.");
      return;
    }

    onSave({
      id,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      badge: badge.trim() ? badge.trim() : undefined,
      imageUrl: imageUrl.trim(),
      isAvailable,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl my-8 transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222631] pb-3.5 mb-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 dark:text-cheezious-yellow" />
            <span>{isEditing ? "Edit Menu Dish" : "Add New Cheezious Dish"}</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#222631] hover:bg-gray-200 dark:hover:bg-[#2D3342] text-neutral-600 dark:text-cheezious-textMuted hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Dish Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight">
                Dish Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Crown Crust Pizza (Small)"
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Badge */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Signature, Bestseller, Spicy, New..."
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight">
                Price ({currency}) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
                required
              />
            </div>

            {/* Original Price */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight">
                Original Price (for Strikethrough)
              </label>
              <input
                type="number"
                value={originalPrice ?? ""}
                onChange={(e) =>
                  setOriginalPrice(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="Optional"
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight">
                Description / Ingredients
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Delicious pizza crust topped with..."
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight">
                Image URL (Unsplash or direct URL) *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
                required
              />
            </div>

            {/* Image Preview & Stock Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#111317] border border-gray-200 dark:border-[#222631]">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-neutral-800 border border-gray-200 dark:border-[#222631] shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      sizes="48px"
                      className="object-cover"
                      onError={() => setError("Image URL failed to load preview.")}
                    />
                  ) : null}
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                    Stock Availability
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted">
                    {isAvailable ? "Item is in stock and orderable" : "Item marked as Sold Out"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAvailable ? "bg-emerald-500" : "bg-gray-300 dark:bg-[#222631]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAvailable ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 dark:border-[#222631] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-neutral-700 dark:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black text-xs font-black transition-all shadow-glow active:scale-95"
            >
              {isEditing ? "Save Changes" : "Create Dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
