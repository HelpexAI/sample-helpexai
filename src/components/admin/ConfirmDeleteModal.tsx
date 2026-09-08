"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  description?: string;
  warningNote?: string;
  confirmButtonText?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  itemName,
  description,
  warningNote,
  confirmButtonText = "Delete Permanently",
  isDeleting = false,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Icon & Close button */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm">
            <Trash2 className="w-6 h-6" />
          </div>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-neutral-500 hover:text-neutral-900 dark:text-cheezious-textMuted dark:hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-neutral-900 dark:text-white tracking-tight">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-cheezious-textMuted leading-relaxed">
            {description ? (
              description
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-bold text-neutral-900 dark:text-white">
                  &ldquo;{itemName}&rdquo;
                </span>
                ? This will immediately remove it from your live menu and database.
              </>
            )}
          </p>
        </div>

        {/* Warning Note Banner (e.g. when category has items) */}
        {warningNote && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span className="font-medium leading-relaxed">{warningNote}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-neutral-700 dark:text-cheezious-textLight hover:text-neutral-900 dark:hover:text-white text-xs sm:text-sm font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmButtonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
