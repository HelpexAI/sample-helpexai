"use client";

import React, { useState } from "react";
import Link from "next/link";
import { loginAdmin } from "@/lib/kvSync";
import {
  Lock,
  Crown,
  ShieldAlert,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";

interface AdminAuthModalProps {
  onAuthenticated: (token: string, username: string) => void;
}

export function AdminAuthModal({ onAuthenticated }: AdminAuthModalProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your admin username.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await loginAdmin(username, password);
      if (res.success && res.token) {
        onAuthenticated(res.token, res.username || username);
      } else {
        setError(res.message || "Invalid username or password.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md">
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 transition-colors duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 dark:bg-cheezious-yellow/10 border border-amber-500/30 dark:border-cheezious-yellow/30 text-amber-600 dark:text-cheezious-yellow mx-auto flex items-center justify-center shadow-glow">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Cheezious Admin Portal
          </h2>
          <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted max-w-xs mx-auto">
            Sign in with your Cloudflare KV credentials to manage menu dishes, prices, and store settings.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-slide-in">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
              <span>Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="e.g. admin"
              className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted"
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password (default: admin123)"
                className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted pr-10"
                required
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
            <p className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted mt-1">
              💡 Demo credentials: <code className="text-amber-600 dark:text-cheezious-yellow font-bold">admin</code> / <code className="text-amber-600 dark:text-cheezious-yellow font-bold">admin123</code>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-glow active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 fill-black" />
                <span>Sign In to Dashboard</span>
              </>
            )}
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
