"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getAdminToken, setAdminToken } from "@/lib/kvSync";
import { AdminAuthModal } from "@/components/admin/AdminAuthModal";
import { OperationalTab } from "@/components/admin/OperationalTab";
import { CategoryTab } from "@/components/admin/CategoryTab";
import { MenuItemsTab } from "@/components/admin/MenuItemsTab";
import { CloudflareSyncBar } from "@/components/admin/CloudflareSyncBar";
import {
  Crown,
  ArrowLeft,
  Lock,
  Utensils,
  Layers,
  Store,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminPage() {
  const {
    config,
    updateStoreConfig,
    resetToDefaults,
    showToast,
    refreshFromRemote,
    isLoading,
  } = useStore();

  const [token, setTokenState] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"items" | "categories" | "operations">("items");

  // Read existing token from local storage on mount
  useEffect(() => {
    const existing = getAdminToken();
    if (existing) {
      setTokenState(existing);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = (authToken: string) => {
    setTokenState(authToken);
    setAdminToken(authToken);
    setIsAuthenticated(true);
    showToast("Admin session unlocked successfully!", "success");
  };

  const handleLogout = () => {
    setTokenState("");
    setAdminToken("");
    setIsAuthenticated(false);
    showToast("Admin session locked.", "info");
  };

  if (!isAuthenticated) {
    return <AdminAuthModal onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-[#111317] text-white flex flex-col pb-28 selection:bg-cheezious-yellow selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#16181F]/95 backdrop-blur-md border-b border-[#222631]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#1A1D24] hover:bg-[#222631] text-cheezious-textMuted hover:text-white border border-[#222631] transition-colors"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cheezious-yellow flex items-center justify-center text-black shadow-glow">
                <Crown className="w-5 h-5 fill-black" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 leading-none">
                  <span>{config.brandName || "Cheezious"}</span>
                  <span className="text-cheezious-yellow text-xs font-bold bg-cheezious-yellow/10 px-2 py-0.5 rounded-full border border-cheezious-yellow/20">
                    Live Admin
                  </span>
                </h1>
                <p className="text-[10px] text-cheezious-textMuted mt-0.5 hidden sm:block">
                  Cloudflare Worker + KV Synchronized
                </p>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={refreshFromRemote}
              disabled={isLoading}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#1A1D24] hover:bg-[#222631] text-cheezious-textMuted hover:text-white border border-[#222631] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Pull latest data from Cloudflare KV"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Remote</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#1A1D24] hover:bg-[#222631] text-cheezious-textMuted hover:text-white border border-[#222631] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="View Live Store in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Store</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-[#1A1D24] hover:bg-rose-500/10 text-rose-400 border border-[#222631] transition-colors"
              title="Lock Admin Session"
              aria-label="Lock Admin Session"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#222631] pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === "items"
                ? "bg-cheezious-yellow text-black shadow-glow"
                : "text-cheezious-textMuted hover:text-white hover:bg-[#1A1D24]"
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu Items ({config.items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === "categories"
                ? "bg-cheezious-yellow text-black shadow-glow"
                : "text-cheezious-textMuted hover:text-white hover:bg-[#1A1D24]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({config.categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("operations")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === "operations"
                ? "bg-cheezious-yellow text-black shadow-glow"
                : "text-cheezious-textMuted hover:text-white hover:bg-[#1A1D24]"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store Operations & Info</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-[#16181F] border border-[#222631] rounded-2xl p-4 sm:p-6 shadow-xl">
          {activeTab === "items" && (
            <MenuItemsTab
              config={config}
              onChange={updateStoreConfig}
              showToast={showToast}
            />
          )}

          {activeTab === "categories" && (
            <CategoryTab config={config} onChange={updateStoreConfig} />
          )}

          {activeTab === "operations" && (
            <OperationalTab config={config} onChange={updateStoreConfig} />
          )}
        </div>
      </main>

      {/* Global Cloudflare KV Push Action Bar */}
      <CloudflareSyncBar
        config={config}
        token={token}
        onReset={resetToDefaults}
        showToast={showToast}
      />
    </div>
  );
}
