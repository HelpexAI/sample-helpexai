"use client";

import React, { useState } from "react";
import { StoreConfig } from "@/data/defaultCheezious";
import {
  pushRemoteStoreConfig,
  getEffectiveApiUrl,
  setCustomApiUrl,
} from "@/lib/kvSync";
import {
  Cloud,
  CheckCircle2,
  RotateCcw,
  Settings,
  X,
} from "lucide-react";

interface CloudflareSyncBarProps {
  config: StoreConfig;
  token: string;
  onReset: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function CloudflareSyncBar({
  config,
  token,
  onReset,
  showToast,
}: CloudflareSyncBarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getEffectiveApiUrl());

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await pushRemoteStoreConfig(config, token);
      if (result.success) {
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || "Failed to sync"}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiUrl(apiUrlInput);
    setShowSettings(false);
    showToast("Cloudflare Worker Endpoint updated!", "success");
  };

  return (
    <>
      {/* Floating Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#16181F]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#222631] py-3.5 px-4 sm:px-6 shadow-2xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-900 dark:text-white font-semibold">
              Changes auto-saved in local browser cache.
            </span>
            <span className="text-neutral-500 dark:text-cheezious-textMuted hidden md:inline">
              Ready to publish globally to Cloudflare KV.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Reset to Cheezious Defaults */}
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all items, prices, and categories back to official Cheezious defaults?"
                  )
                ) {
                  onReset();
                }
              }}
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#222631] hover:bg-gray-200 dark:hover:bg-[#2D3342] text-neutral-700 dark:text-cheezious-textMuted hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset to default Cheezious menu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            {/* Configure Endpoint */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#222631] hover:bg-gray-200 dark:hover:bg-[#2D3342] text-neutral-700 dark:text-cheezious-textMuted hover:text-neutral-900 dark:hover:text-white text-xs font-semibold transition-colors"
              title="Worker Endpoint Settings"
              aria-label="Worker Endpoint Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Push Live CTA */}
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cheezious-yellow to-amber-500 hover:from-cheezious-yellowHover hover:to-amber-600 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95 disabled:opacity-50"
            >
              <Cloud className="w-4 h-4 text-black" />
              <span>
                {isSaving ? "Publishing to KV..." : "Save & Push Live to Cloudflare"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloudflare Endpoint Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222631] pb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-500 dark:text-cheezious-yellow" />
                <span>Cloudflare KV Worker Sync Configuration</span>
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#222631] text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-700 dark:text-cheezious-textLight font-semibold block mb-1">
                  Worker API Endpoint URL
                </label>
                <input
                  type="url"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  placeholder="https://restaurant-api.<your-subdomain>.workers.dev/api/shop/cheezious"
                  className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
                />
                <p className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted mt-1">
                  This endpoint receives GET requests to load menu items and POST requests with Authorization Bearer header when saving.
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#111317] rounded-xl border border-gray-200 dark:border-[#222631] space-y-1 text-neutral-600 dark:text-cheezious-textMuted">
                <div className="text-neutral-900 dark:text-white font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Deployment Worker Template</span>
                </div>
                <p className="text-[11px]">
                  A pre-configured Cloudflare Worker script is included in the project under <code className="text-amber-600 dark:text-cheezious-yellow font-bold">cloudflare/worker.js</code>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] text-neutral-700 dark:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cheezious-yellow text-black font-extrabold shadow-glow"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
