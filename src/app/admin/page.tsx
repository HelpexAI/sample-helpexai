"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  getAdminSession,
  setAdminSession,
  clearAdminSession,
} from "@/lib/kvSync";
import { AdminAuthModal } from "@/components/admin/AdminAuthModal";
import { OperationalTab } from "@/components/admin/OperationalTab";
import { CategoryTab } from "@/components/admin/CategoryTab";
import { MenuItemsTab } from "@/components/admin/MenuItemsTab";
import { LiveSyncBar } from "@/components/admin/LiveSyncBar";
import { PrintableQrModal } from "@/components/admin/PrintableQrModal";
import {
  Crown,
  ArrowLeft,
  LogOut,
  Utensils,
  Layers,
  Store,
  RefreshCw,
  ExternalLink,
  Sun,
  Moon,
  UserCheck,
  ShieldCheck,
  QrCode,
} from "lucide-react";

export default function AdminPage() {
  const {
    config,
    updateStoreConfig,
    resetToDefaults,
    showToast,
    refreshFromRemote,
    isLoading,
    theme,
    toggleTheme,
  } = useStore();

  const [username, setUsername] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"items" | "categories" | "operations">("items");
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Read isolated sessionStorage on mount to verify session validity
  useEffect(() => {
    const session = getAdminSession();
    if (session && session.token) {
      setUsername(session.username);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsCheckingSession(false);
  }, []);

  const handleAuthenticated = (token: string, authedUser: string) => {
    setUsername(authedUser);
    setAdminSession(token, authedUser);
    setIsAuthenticated(true);
    showToast(`Signed in as ${authedUser}`, "success");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the Cheezious Admin Portal?")) {
      clearAdminSession();
      setUsername("");
      setIsAuthenticated(false);
      showToast("Signed out. Session destroyed.", "info");
    }
  };

  const handleSessionExpired = () => {
    clearAdminSession();
    setUsername("");
    setIsAuthenticated(false);
    showToast("Your session has expired. Please sign in again.", "error");
  };

  // Prevent flash while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111317] flex items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500 dark:text-cheezious-textMuted text-sm font-medium">
          <div className="w-5 h-5 border-2 border-cheezious-yellow border-t-transparent rounded-full animate-spin" />
          <span>Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  // State 1: Admin Login View when not authenticated
  if (!isAuthenticated) {
    return <AdminAuthModal onAuthenticated={handleAuthenticated} />;
  }

  // State 2: Authenticated Dashboard
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111317] text-neutral-900 dark:text-white flex flex-col pb-28 selection:bg-cheezious-yellow selection:text-black transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#16181F]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#222631] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-600 hover:text-neutral-900 dark:text-cheezious-textMuted dark:hover:text-white border border-gray-200 dark:border-[#222631] transition-colors"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cheezious-yellow flex items-center justify-center text-black shadow-glow">
                <Crown className="w-5 h-5 fill-black" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5 leading-none">
                  <span>{config.brandName || "Cheezious"}</span>
                  <span className="text-amber-600 dark:text-cheezious-yellow text-xs font-bold bg-amber-500/15 dark:bg-cheezious-yellow/10 px-2 py-0.5 rounded-full border border-amber-500/30 dark:border-cheezious-yellow/20">
                    Live Admin
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Center: User Status */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <UserCheck className="w-3.5 h-3.5" />
            <span>
              Signed in as <strong>{username || "admin"}</strong>
            </span>
            <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Session Active
            </span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-700 dark:text-cheezious-yellow border border-gray-200 dark:border-[#222631] transition-all active:scale-95"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* Refresh Remote */}
            <button
              onClick={refreshFromRemote}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-700 dark:text-cheezious-textMuted dark:hover:text-white border border-gray-200 dark:border-[#222631] transition-all active:scale-95"
              title="Pull latest live data from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Live Store in new tab */}
            <Link
              href="/"
              target="_blank"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-700 hover:text-neutral-900 dark:text-cheezious-textMuted dark:hover:text-white border border-gray-200 dark:border-[#222631] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="View Live Store in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            {/* Printable QR Code Standee */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-cheezious-yellow border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Generate Printable Table Standee & Menu QR with Branding"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-600 dark:text-cheezious-yellow" />
              <span className="hidden sm:inline">Print QR</span>
            </button>

            {/* Explicit Logout with Confirmation */}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Logout and destroy session token"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#222631] pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === "items"
                ? "bg-cheezious-yellow text-black shadow-glow"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-gray-100 dark:text-cheezious-textMuted dark:hover:text-white dark:hover:bg-[#1A1D24]"
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu & Price Management ({config.items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === "categories"
                ? "bg-cheezious-yellow text-black shadow-glow"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-gray-100 dark:text-cheezious-textMuted dark:hover:text-white dark:hover:bg-[#1A1D24]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Category Management ({config.categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("operations")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === "operations"
                ? "bg-cheezious-yellow text-black shadow-glow"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-gray-100 dark:text-cheezious-textMuted dark:hover:text-white dark:hover:bg-[#1A1D24]"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store & Contact Info</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white dark:bg-[#16181F] border border-gray-200 dark:border-[#222631] rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
          {activeTab === "items" && (
            <MenuItemsTab
              config={config}
              onChange={updateStoreConfig}
              showToast={showToast}
            />
          )}

          {activeTab === "categories" && (
            <CategoryTab config={config} onChange={updateStoreConfig} showToast={showToast} />
          )}

          {activeTab === "operations" && (
            <OperationalTab
              config={config}
              onChange={updateStoreConfig}
              onOpenQrModal={() => setIsQrModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Live Sync Action Bar */}
      <LiveSyncBar
        config={config}
        onReset={resetToDefaults}
        showToast={showToast}
        onSessionExpired={handleSessionExpired}
      />

      {/* Printable QR Code Modal */}
      <PrintableQrModal
        config={config}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
}
