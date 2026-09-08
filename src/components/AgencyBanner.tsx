"use client";

import React from "react";
import { MessageSquare, ExternalLink, Sparkles, MapPin } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function AgencyHeaderBanner() {
  const { config } = useStore();

  return (
    <div>
      {/* Helpex Solutions Agency Demonstration Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-black py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold shadow-md flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-4 h-4 shrink-0 text-black animate-pulse" />
          <span>
            <strong>Sample Restaurant by Helpex Solutions</strong> — Want a high-speed ordering website like this for your brand?
          </span>
        </div>
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <a
            href="https://wa.me/923146517960?text=Hi%20Helpex%20Solutions!%20I%20saw%20your%20Cheezious%20demo%20and%20want%20to%20build%20a%20website%20for%20my%20restaurant."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-black text-amber-400 hover:bg-neutral-900 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Build Your Website</span>
          </a>
        </div>
      </div>

      {/* Cheezious Brand Announcement Ribbon */}
      <div className="bg-amber-50/90 dark:bg-[#1A1D24] border-b border-amber-200/60 dark:border-[#222631] text-xs py-2 px-4 text-amber-950 dark:text-cheezious-textMuted flex items-center justify-between flex-wrap gap-2 transition-colors">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-cheezious-yellow animate-ping" />
          <span className="text-neutral-900 dark:text-white font-semibold">
            {config.bannerNotice || "🔥 Delivering Cheezy Khushiyan across Islamabad & Rawalpindi!"}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-neutral-600 dark:text-cheezious-textMuted text-xs ml-auto">
          <MapPin className="w-3.5 h-3.5 text-cheezious-yellow" />
          <span>Selected Branch: <strong className="text-neutral-900 dark:text-white font-semibold">{config.selectedBranch}</strong></span>
        </div>
      </div>
    </div>
  );
}

export function AgencyFooterBanner() {
  return (
    <div className="bg-amber-50/60 dark:bg-[#16181F] border-t border-amber-200/50 dark:border-[#222631] py-8 px-4 text-center transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cheezious-yellow/20 border border-cheezious-yellow/40 text-amber-900 dark:text-cheezious-yellow text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Showcase by Helpex Solutions
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
          Ready to supercharge your restaurant’s online sales?
        </h3>
        <p className="text-neutral-600 dark:text-cheezious-textMuted text-sm max-w-xl">
          Get an ultra-fast, zero-commission digital menu website with automated WhatsApp checkout, real-time live stock management, and custom cloud sync.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <a
            href="https://wa.me/923146517960?text=Hi%20Helpex%20Solutions!%20I%20want%20to%20order%20a%20restaurant%20website%20system."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-glow active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            Talk with Us on WhatsApp
          </a>
          <a
            href="https://helpexai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white dark:bg-[#222631] hover:bg-gray-100 dark:hover:bg-[#2D3342] text-neutral-900 dark:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border border-gray-200 dark:border-[#2D3342] shadow-sm"
          >
            Visit Helpex Solutions
            <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
