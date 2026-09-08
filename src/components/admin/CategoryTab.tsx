"use client";

import React, { useState } from "react";
import { StoreConfig } from "@/data/defaultCheezious";
import { Layers, Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, X } from "lucide-react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface CategoryTabProps {
  config: StoreConfig;
  onChange: (
    updater: (prev: StoreConfig) => StoreConfig
  ) => Promise<{ success: boolean; message?: string }> | void;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function CategoryTab({ config, onChange, showToast }: CategoryTabProps) {
  const [newCatName, setNewCatName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [error, setError] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<{
    index: number;
    name: string;
    itemsCount: number;
  } | null>(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);

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

  const handleRequestDeleteCategory = (index: number) => {
    const catToDelete = config.categories[index];
    const itemsUsing = config.items.filter((it) => it.category === catToDelete).length;
    setCategoryToDelete({
      index,
      name: catToDelete,
      itemsCount: itemsUsing,
    });
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeletingCat(true);
    try {
      const res = await onChange((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== categoryToDelete.index),
      }));
      if (res?.success) {
        showToast?.(`Category "${categoryToDelete.name}" deleted live from database!`, "info");
        setCategoryToDelete(null);
      }
    } finally {
      setIsDeletingCat(false);
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
      <div className="border-b border-gray-200 dark:border-[#222631] pb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500 dark:text-cheezious-yellow" />
            Category Manager
          </h3>
          <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted mt-0.5">
            Add new sections, rename existing categories, or reorder how they appear in the sticky menu tabs.
          </p>
        </div>
      </div>

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
                    type="button"
                    onClick={() => handleRequestDeleteCategory(index)}
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

      {/* Themed Confirm Delete Modal */}
      {categoryToDelete && (
        <ConfirmDeleteModal
          isOpen={!!categoryToDelete}
          title="Delete Category"
          itemName={categoryToDelete.name}
          warningNote={
            categoryToDelete.itemsCount > 0
              ? `This category currently contains ${categoryToDelete.itemsCount} menu dish(es). Deleting the category will not delete the dishes, but they will no longer appear under this category header.`
              : undefined
          }
          isDeleting={isDeletingCat}
          onConfirm={handleConfirmDeleteCategory}
          onClose={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}
