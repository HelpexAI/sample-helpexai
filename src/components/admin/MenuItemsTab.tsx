"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { MenuItem, StoreConfig } from "@/data/defaultCheezious";
import { DishModal } from "./DishModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import {
  Utensils,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Ban,
  Filter,
  Loader2,
} from "lucide-react";

interface MenuItemsTabProps {
  config: StoreConfig;
  onChange: (
    updater: (prev: StoreConfig) => StoreConfig
  ) => Promise<{ success: boolean; message?: string }> | void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function MenuItemsTab({ config, onChange, showToast }: MenuItemsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalItem, setModalItem] = useState<MenuItem | null | "NEW">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // Quick inline price editor state
  const handlePriceChange = async (itemId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const res = await onChange((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === itemId ? { ...it, price: newPrice } : it
      ),
    }));
    if (res?.success) {
      showToast("Price updated in database", "success");
    }
  };

  // Quick toggle stock
  const handleToggleStock = async (itemId: string) => {
    const item = config.items.find((it) => it.id === itemId);
    const nextAvailability = !item?.isAvailable;
    const res = await onChange((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === itemId ? { ...it, isAvailable: !it.isAvailable } : it
      ),
    }));
    if (res?.success && item) {
      showToast(
        `${item.name} is now ${nextAvailability ? "IN STOCK" : "marked SOLD OUT"}`,
        "info"
      );
    }
  };

  // Confirm delete item in modal
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const item = itemToDelete;
    setDeletingId(item.id);
    try {
      const res = await onChange((prev) => ({
        ...prev,
        items: prev.items.filter((it) => it.id !== item.id),
      }));
      if (res?.success) {
        showToast(`Deleted "${item.name}" from database`, "info");
        setItemToDelete(null);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Save dish from modal (add or edit)
  const handleSaveDish = async (dish: MenuItem) => {
    const res = await onChange((prev) => {
      const exists = prev.items.some((it) => it.id === dish.id);
      if (exists) {
        return {
          ...prev,
          items: prev.items.map((it) => (it.id === dish.id ? dish : it)),
        };
      } else {
        return {
          ...prev,
          items: [dish, ...prev.items],
        };
      }
    });
    if (res?.success) {
      showToast(`Saved dish: ${dish.name}`, "success");
      setModalItem(null);
    }
  };

  const handleAddCategoryFromDishModal = async (newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (!config.categories.includes(trimmed)) {
      const res = await onChange((prev) => ({
        ...prev,
        categories: [...prev.categories, trimmed],
      }));
      if (res?.success) {
        showToast(`Created category: "${trimmed}"`, "success");
      }
    }
  };

  // Filtered list
  const filteredItems = useMemo(() => {
    return config.items.filter((it) => {
      const matchesCat =
        selectedCategory === "All" || it.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === "" ||
        it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [config.items, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#222631] pb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-500 dark:text-cheezious-yellow" />
            Menu Items Manager
          </h3>
          <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted mt-0.5">
            Inline price editing, quick stock toggle (In Stock / Sold Out), and dish creator.
          </p>
        </div>

        <button
          onClick={() => setModalItem("NEW")}
          className="bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-glow self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gray-50 dark:bg-[#1A1D24] p-3.5 rounded-xl border border-gray-200 dark:border-[#222631]">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-cheezious-textMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name or description..."
            className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400 dark:text-cheezious-textMuted shrink-0 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none w-full sm:w-auto"
          >
            <option value="All">All Categories ({config.items.length})</option>
            {config.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({config.items.filter((it) => it.category === cat).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Table / Cards */}
      <div className="bg-white dark:bg-[#1A1D24] rounded-xl border border-gray-200 dark:border-[#222631] overflow-hidden shadow-sm">
        <div className="p-3 bg-gray-50 dark:bg-[#16181F] border-b border-gray-200 dark:border-[#222631] text-xs font-semibold text-neutral-600 dark:text-cheezious-textMuted grid grid-cols-12 gap-3 items-center">
          <span className="col-span-6 sm:col-span-5">Dish Details</span>
          <span className="col-span-3 sm:col-span-3">Inline Price ({config.currency})</span>
          <span className="col-span-3 sm:col-span-2 text-center">Status</span>
          <span className="hidden sm:block sm:col-span-2 text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#222631]">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 dark:text-cheezious-textMuted">
              No menu items match your search or filter.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 grid grid-cols-12 gap-3 items-center hover:bg-gray-50 dark:hover:bg-[#20242D] transition-colors ${
                  !item.isAvailable ? "opacity-70 bg-gray-50/50 dark:bg-black/20" : ""
                }`}
              >
                {/* Details Column */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-[#111317] border border-gray-200 dark:border-[#222631]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Ban className="w-4 h-4 text-rose-500" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-neutral-900 dark:text-white font-bold text-xs sm:text-sm truncate">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/15 dark:bg-cheezious-yellow/10 text-amber-700 dark:text-cheezious-yellow border border-amber-500/30 dark:border-cheezious-yellow/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-cheezious-textMuted block truncate">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Inline Price Editor */}
                <div className="col-span-3 sm:col-span-3 flex items-center gap-1.5">
                  <span className="text-xs text-neutral-500 dark:text-cheezious-textMuted font-bold">
                    {config.currency}
                  </span>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handlePriceChange(item.id, Number(e.target.value))
                    }
                    className="w-20 sm:w-24 bg-white dark:bg-[#111317] text-neutral-900 dark:text-white font-black text-xs sm:text-sm px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
                  />
                </div>

                {/* Stock Switch Toggle */}
                <div className="col-span-3 sm:col-span-2 flex flex-col sm:flex-row items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStock(item.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                      item.isAvailable
                        ? "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-500/40 hover:bg-emerald-500/25"
                        : "bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 dark:border-rose-500/40 hover:bg-rose-500/25"
                    }`}
                  >
                    {item.isAvailable ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3 h-3" />
                        <span>Sold Out</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Actions Column */}
                <div className="col-span-12 sm:col-span-2 flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-[#222631]">
                  <button
                    onClick={() => setModalItem(item)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] text-amber-600 dark:text-cheezious-yellow hover:bg-amber-500/10 transition-colors"
                    title="Edit dish"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] text-rose-500 hover:bg-rose-500/10 disabled:opacity-50 transition-colors"
                    title="Delete dish"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dish Modal (Add / Edit) */}
      {modalItem && (
        <DishModal
          initialItem={modalItem === "NEW" ? null : modalItem}
          categories={config.categories}
          currency={config.currency}
          onSave={handleSaveDish}
          onClose={() => setModalItem(null)}
          onAddCategory={handleAddCategoryFromDishModal}
        />
      )}

      {/* Themed Confirm Delete Modal */}
      {itemToDelete && (
        <ConfirmDeleteModal
          isOpen={!!itemToDelete}
          title="Delete Menu Dish"
          itemName={itemToDelete.name}
          isDeleting={deletingId === itemToDelete.id}
          onConfirm={handleConfirmDelete}
          onClose={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
}
