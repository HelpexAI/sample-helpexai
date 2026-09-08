"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StoreConfig } from "@/data/defaultCheezious";
import {
  Store,
  Phone,
  MessageSquare,
  Truck,
  Megaphone,
  MapPin,
  DollarSign,
  QrCode,
  Printer,
  Save,
  RotateCcw,
  Check,
  Loader2,
} from "lucide-react";

interface OperationalTabProps {
  config: StoreConfig;
  onChange: (
    updater: (prev: StoreConfig) => StoreConfig
  ) => Promise<{ success: boolean; message?: string }> | void;
  onOpenQrModal?: () => void;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function OperationalTab({
  config,
  onChange,
  onOpenQrModal,
  showToast,
}: OperationalTabProps) {
  // Local form state so keystrokes don't fire remote API requests until saved
  const [formData, setFormData] = useState({
    brandName: config.brandName || "",
    slogan: config.slogan || "",
    hotline: config.hotline || "",
    whatsappNumber: config.whatsappNumber || "",
    deliveryFee: config.deliveryFee ?? 150,
    selectedBranch: config.selectedBranch || "",
    currency: config.currency || "Rs.",
    bannerNotice: config.bannerNotice || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with incoming config changes (e.g. on load or remote sync)
  useEffect(() => {
    setFormData({
      brandName: config.brandName || "",
      slogan: config.slogan || "",
      hotline: config.hotline || "",
      whatsappNumber: config.whatsappNumber || "",
      deliveryFee: config.deliveryFee ?? 150,
      selectedBranch: config.selectedBranch || "",
      currency: config.currency || "Rs.",
      bannerNotice: config.bannerNotice || "",
    });
  }, [
    config.brandName,
    config.slogan,
    config.hotline,
    config.whatsappNumber,
    config.deliveryFee,
    config.selectedBranch,
    config.currency,
    config.bannerNotice,
  ]);

  // Check if form has unsaved modifications
  const isDirty = useMemo(() => {
    return (
      formData.brandName !== (config.brandName || "") ||
      formData.slogan !== (config.slogan || "") ||
      formData.hotline !== (config.hotline || "") ||
      formData.whatsappNumber !== (config.whatsappNumber || "") ||
      formData.deliveryFee !== (config.deliveryFee ?? 150) ||
      formData.selectedBranch !== (config.selectedBranch || "") ||
      formData.currency !== (config.currency || "Rs.") ||
      formData.bannerNotice !== (config.bannerNotice || "")
    );
  }, [formData, config]);

  const handleFieldChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await onChange((prev) => ({
        ...prev,
        brandName: formData.brandName.trim(),
        slogan: formData.slogan.trim(),
        hotline: formData.hotline.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
        deliveryFee: Number(formData.deliveryFee) || 0,
        selectedBranch: formData.selectedBranch.trim(),
        currency: formData.currency.trim(),
        bannerNotice: formData.bannerNotice.trim(),
      }));

      if (res?.success) {
        showToast?.("Storefront & Operational settings saved live!", "success");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      brandName: config.brandName || "",
      slogan: config.slogan || "",
      hotline: config.hotline || "",
      whatsappNumber: config.whatsappNumber || "",
      deliveryFee: config.deliveryFee ?? 150,
      selectedBranch: config.selectedBranch || "",
      currency: config.currency || "Rs.",
      bannerNotice: config.bannerNotice || "",
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#222631] pb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-500 dark:text-cheezious-yellow" />
            Storefront & Operational Settings
          </h3>
          <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted mt-0.5">
            Edit branding, official hotline numbers, delivery fees, and top banners. Changes only take effect when saved.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-neutral-700 dark:text-cheezious-textMuted hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Changes</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving || (!isDirty && !saveSuccess)}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
              saveSuccess
                ? "bg-emerald-600 text-white shadow-md"
                : isDirty
                ? "bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black shadow-glow"
                : "bg-gray-200 dark:bg-[#222631] text-neutral-500 dark:text-cheezious-textMuted cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-current" />
                <span>Saving to Database...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isDirty ? "Save Settings *" : "Settings Saved"}</span>
              </>
            )}
          </button>
        </div>
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

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Brand Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
            <span>Brand Name</span>
          </label>
          <input
            type="text"
            value={formData.brandName}
            onChange={(e) => handleFieldChange("brandName", e.target.value)}
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
            value={formData.slogan}
            onChange={(e) => handleFieldChange("slogan", e.target.value)}
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
            value={formData.hotline}
            onChange={(e) => handleFieldChange("hotline", e.target.value)}
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
            value={formData.whatsappNumber}
            onChange={(e) => handleFieldChange("whatsappNumber", e.target.value)}
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
            <span>Delivery Fee ({formData.currency})</span>
          </label>
          <input
            type="number"
            value={formData.deliveryFee}
            onChange={(e) => handleFieldChange("deliveryFee", Number(e.target.value))}
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
            value={formData.selectedBranch}
            onChange={(e) => handleFieldChange("selectedBranch", e.target.value)}
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
            value={formData.currency}
            onChange={(e) => handleFieldChange("currency", e.target.value)}
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
            value={formData.bannerNotice}
            onChange={(e) => handleFieldChange("bannerNotice", e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
          />
        </div>
      </div>

      {/* Bottom Save Bar when dirty */}
      {isDirty && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="text-xs text-amber-900 dark:text-amber-200 font-medium">
            You have unsaved changes in Storefront & Operational Settings.
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222631] dark:hover:bg-[#2D3342] text-xs font-semibold text-neutral-700 dark:text-white transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black text-xs font-black flex items-center justify-center gap-1.5 shadow-glow transition-all active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Settings Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
