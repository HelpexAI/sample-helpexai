"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Crown, ShieldAlert, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface AdminAuthModalProps {
  onAuthenticated: (token: string) => void;
}

export function AdminAuthModal({ onAuthenticated }: AdminAuthModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }
    // Accept standard default passwords or custom bearer token
    onAuthenticated(password.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md">
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 transition-colors duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 dark:bg-cheezious-yellow/10 border border-amber-500/30 dark:border-cheezious-yellow/30 text-amber-600 dark:text-cheezious-yellow mx-auto flex items-center justify-center shadow-glow">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Cheezious Admin Access
          </h2>
          <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted max-w-xs mx-auto">
            Enter your Admin Secret or Cloudflare Bearer Token to manage menu items, prices, and store settings.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight block mb-1.5">
              Admin Password / Secret Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter secret (default: admin123)"
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:text-cheezious-textMuted dark:hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
            <p className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted mt-1.5">
              💡 Tip: Default demo key is <code className="text-amber-600 dark:text-cheezious-yellow font-bold">admin123</code> or any password.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-glow active:scale-95 flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 fill-black" />
            <span>Unlock Dashboard</span>
          </button>
        </form>

        {/* Back Link */}
        <div className="pt-2 text-center border-t border-gray-200 dark:border-[#222631]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:text-cheezious-textMuted dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Cheezious Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
