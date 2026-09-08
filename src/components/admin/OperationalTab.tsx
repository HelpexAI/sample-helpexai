"use client";

import React from "react";
import { StoreConfig } from "@/data/defaultCheezious";
import { Store, Phone, MessageSquare, Truck, Megaphone, MapPin, DollarSign, QrCode, Printer } from "lucide-react";

interface OperationalTabProps {
  config: StoreConfig;
  onChange: (updater: (prev: StoreConfig) => StoreConfig) => void;
  onOpenQrModal?: () => void;
}

export function OperationalTab({ config, onChange, onOpenQrModal }: OperationalTabProps) {
  const updateField = <K extends keyof StoreConfig>(key: K, value: StoreConfig[K]) => {
    onChange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-[#222631] pb-4">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-500 dark:text-cheezious-yellow" />
          Storefront & Operational Settings
        </h3>
        <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted mt-0.5">
          Configure branding, official hotline numbers, delivery fees, and top banners.
        </p>
      </div>

      {/* Printable QR Code Card Banner */}
      {onOpenQrModal && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cheezious-yellow flex items-center justify-center text-black shadow-glow shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Printable QR Standee & Menu Cards</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-cheezious-yellow px-2 py-0.5 rounded-full font-bold uppercase">
                  300 DPI Print
                </span>
              </h4>
              <p className="text-xs text-neutral-600 dark:text-cheezious-textMuted mt-0.5">
                Generate branded table standees with custom table numbers linking customers straight to your live menu.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenQrModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black text-xs font-black flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Printable QR</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Brand Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <span>Brand Name</span>
          </label>
          <input
            type="text"
            value={config.brandName}
            onChange={(e) => updateField("brandName", e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>

        {/* Slogan */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <span>Slogan / Tagline</span>
          </label>
          <input
            type="text"
            value={config.slogan}
            onChange={(e) => updateField("slogan", e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>

        {/* Hotline */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
            <span>Customer Care / Hotline</span>
          </label>
          <input
            type="text"
            value={config.hotline}
            onChange={(e) => updateField("hotline", e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>

        {/* WhatsApp Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Order Receiving WhatsApp Number (e.g. +92 314 6517960)</span>
          </label>
          <input
            type="text"
            value={config.whatsappNumber}
            onChange={(e) => updateField("whatsappNumber", e.target.value)}
            placeholder="e.g. +92 314 6517960"
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
          <p className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted">
            WhatsApp orders from customers will be sent directly to this number.
          </p>
        </div>

        {/* Delivery Fee */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
            <span>Delivery Fee ({config.currency})</span>
          </label>
          <input
            type="number"
            value={config.deliveryFee}
            onChange={(e) => updateField("deliveryFee", Number(e.target.value) || 0)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>

        {/* Selected Branch */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
            <span>Active Branch Indicator</span>
          </label>
          <input
            type="text"
            value={config.selectedBranch}
            onChange={(e) => updateField("selectedBranch", e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>

        {/* Currency Symbol */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
            <span>Currency Symbol</span>
          </label>
          <input
            type="text"
            value={config.currency}
            onChange={(e) => updateField("currency", e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>

        {/* Banner Notice */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
            <span>Top Announcement Ribbon Banner</span>
          </label>
          <input
            type="text"
            value={config.bannerNotice}
            onChange={(e) => updateField("bannerNotice", e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>
      </div>
    </div>
  );
}
