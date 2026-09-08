"use client";

import React, { useState } from "react";
import { StoreConfig } from "@/data/defaultCheezious";
import { Layers, Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, X } from "lucide-react";

interface CategoryTabProps {
  config: StoreConfig;
  onChange: (
    updater: (prev: StoreConfig) => StoreConfig
  ) => Promise<{ success: boolean; message?: string }> | void;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function CategoryTab({ config, onChange, showToast }: CategoryTabProps) {
  const [newCatName, setNewCatName] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [error, setError] = useState("");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setError("Please enter a category name.");
      return;
    }
    if (config.categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError("This category already exists.");
      return;
    }
    setError("");
    const res = await onChange((prev) => ({
      ...prev,
      categories: [...prev.categories, trimmed],
    }));
    if (res?.success) {
      setNewCatName("");
      setIsAddModalOpen(false);
      showToast?.(`Category "${trimmed}" created and saved live!`, "success");
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditCatName(config.categories[index]);
  };

  const handleSaveEdit = async (index: number) => {
    const trimmed = editCatName.trim();
    if (!trimmed) return;
    const oldName = config.categories[index];

    // Update categories array & update any items with the old category name
    const res = await onChange((prev) => ({
      ...prev,
      categories: prev.categories.map((c, i) => (i === index ? trimmed : c)),
      items: prev.items.map((it) =>
        it.category === oldName ? { ...it, category: trimmed } : it
      ),
    }));

    if (res?.success) {
      setEditingIndex(null);
      setEditCatName("");
      showToast?.(`Category renamed to "${trimmed}" & saved live!`, "success");
    }
  };

  const handleDeleteCategory = async (index: number) => {
    const catToDelete = config.categories[index];
    const itemsUsing = config.items.filter((it) => it.category === catToDelete).length;

    if (
      itemsUsing > 0 &&
      !window.confirm(
        `"${catToDelete}" has ${itemsUsing} menu item(s). Are you sure you want to remove this category? The items will remain but won't have a category header.`
      )
    ) {
      return;
    }

    const res = await onChange((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
    if (res?.success) {
      showToast?.(`Category "${catToDelete}" deleted & updated live!`, "info");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.categories.length) return;

    const res = await onChange((prev) => {
      const nextCategories = [...prev.categories];
      const temp = nextCategories[index];
      nextCategories[index] = nextCategories[targetIndex];
      nextCategories[targetIndex] = temp;
      return {
        ...prev,
        categories: nextCategories,
      };
    });
    if (res?.success) {
      showToast?.("Category reordered & saved live!", "info");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#222631] pb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500 dark:text-cheezious-yellow" />
            Category Manager
          </h3>
          <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted mt-0.5">
            Add new sections, rename existing categories, or reorder how they appear in the sticky menu tabs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setIsAddModalOpen(true);
          }}
          className="bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-glow self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Add New Category Modal Popup */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222631] pb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500 dark:text-cheezious-yellow" />
                <span>Add New Category</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setError("");
                }}
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#222631] text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-700 dark:text-cheezious-textLight font-semibold block mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Desserts, Beverages, Midnight Deals"
                  className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none font-medium"
                  autoFocus
                  required
                />
                {error && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setError("");
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-neutral-700 dark:text-white font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-extrabold text-xs shadow-glow transition-all active:scale-95"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Bar */}
      <form
        onSubmit={handleAddCategory}
        className="bg-gray-50 dark:bg-[#1A1D24] p-4 rounded-xl border border-gray-200 dark:border-[#222631] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <div className="flex-1">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => {
              setNewCatName(e.target.value);
              setError("");
            }}
            placeholder="Quick Add Category (e.g. Desserts, Beverages)"
            className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          className="bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-glow shrink-0 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </form>

      {/* Categories List */}
      <div className="bg-white dark:bg-[#1A1D24] rounded-xl border border-gray-200 dark:border-[#222631] overflow-hidden shadow-sm">
        <div className="p-3 bg-gray-50 dark:bg-[#16181F] border-b border-gray-200 dark:border-[#222631] text-xs font-semibold text-neutral-600 dark:text-cheezious-textMuted flex items-center justify-between">
          <span>Active Categories ({config.categories.length})</span>
          <span>Order & Controls</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#222631]">
          {config.categories.map((cat, index) => {
            const count = config.items.filter((it) => it.category === cat).length;
            const isEditing = editingIndex === index;

            return (
              <div
                key={cat}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-[#20242D] transition-colors"
              >
                {/* Category Name or Inline Editor */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono font-bold text-neutral-400 dark:text-cheezious-textMuted w-5">
                    #{index + 1}
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg border border-cheezious-yellow focus:outline-none w-full"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        title="Save name"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="p-1.5 bg-gray-200 dark:bg-[#222631] text-neutral-600 dark:text-gray-400 rounded-lg hover:text-neutral-900 dark:hover:text-white"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-neutral-900 dark:text-white font-bold text-sm truncate">{cat}</span>
                      <span className="text-[11px] bg-gray-100 dark:bg-[#222631] text-neutral-600 dark:text-cheezious-textMuted px-2 py-0.5 rounded-full font-medium">
                        {count} dish{count === 1 ? "" : "es"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions & Reordering */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Move Up */}
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === config.categories.length - 1}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(index)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] text-amber-600 dark:text-cheezious-yellow hover:bg-amber-500/10 transition-colors"
                      title="Rename category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteCategory(index)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#111317] border border-gray-200 dark:border-[#222631] text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
