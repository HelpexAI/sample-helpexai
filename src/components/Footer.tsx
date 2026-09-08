"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Crown, Phone, MapPin, Clock, Heart, ExternalLink, ShieldAlert } from "lucide-react";

export function Footer() {
  const { config } = useStore();

  return (
    <footer className="bg-gray-100 dark:bg-[#0D0E12] border-t border-gray-200 dark:border-[#222631] text-neutral-600 dark:text-cheezious-textMuted pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cheezious-yellow flex items-center justify-center text-black shadow-glow">
                <Crown className="w-5 h-5 fill-black" />
              </div>
              <span className="text-xl font-black text-amber-500 dark:text-cheezious-yellow tracking-wider">
                {config.brandName || "CHEEZIOUS"}
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-cheezious-textLight leading-relaxed">
              {config.slogan || "Delivering Cheezy Khushiyan"} — Serving mouth-watering Crown Crust pizzas, legendary Bazinga burgers, and savory calzone chunks.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-cheezious-yellow hover:underline font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Store Admin Portal
              </Link>
            </div>
          </div>

          {/* Column 2: Branches */}
          <div className="space-y-3">
            <h4 className="text-neutral-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              Popular Branches
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow shrink-0" />
                <span>F-7 Markaz, Islamabad</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow shrink-0" />
                <span>Commercial Market, Rawalpindi</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow shrink-0" />
                <span>Blue Area, Islamabad</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow shrink-0" />
                <span>Bahria Town Phase 4 & 7</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-neutral-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              Order Hotline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow shrink-0" />
                <a
                  href={`tel:${config.hotline.replace(/[^0-9]/g, "")}`}
                  className="hover:text-neutral-900 dark:hover:text-white font-bold text-amber-600 dark:text-cheezious-yellow"
                >
                  {config.hotline}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow shrink-0" />
                <span>11:00 AM – 03:00 AM (Daily)</span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-gray-500 pt-1">
                Standard delivery fee {config.currency} {config.deliveryFee} applies to all online orders.
              </div>
            </div>
          </div>

          {/* Column 4: Helpex Agency Attribution */}
          <div className="space-y-3 md:col-span-1 bg-white dark:bg-[#16181F] p-4 rounded-xl border border-gray-200 dark:border-[#222631] shadow-sm">
            <h4 className="text-neutral-900 dark:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>Agency Development</span>
            </h4>
            <p className="text-xs text-neutral-600 dark:text-cheezious-textMuted leading-relaxed">
              Designed & developed as a showcase by{" "}
              <a
                href="https://helpexai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-cheezious-yellow font-bold hover:underline"
              >
                Helpex Solutions
              </a>
              . Built for ultra-fast digital ordering and zero marketplace commission.
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/923146517960?text=Hi%20Helpex%20Solutions!%20I%20want%20to%20know%20more%20about%20your%20restaurant%20websites."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Inquire on WhatsApp &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-[#1C202B] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-3 text-neutral-500 dark:text-cheezious-textMuted">
          <p>© {new Date().getFullYear()} Cheezious. All rights reserved. (Demo Clone by Helpex Solutions)</p>
          <div className="flex items-center gap-4">
            <a
              href="https://helpexai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              helpexai.com
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <Link href="/admin" className="hover:text-amber-600 dark:hover:text-cheezious-yellow transition-colors font-medium">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
