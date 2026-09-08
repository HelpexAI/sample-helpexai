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
  Navigation,
  Clock,
  ExternalLink,
  HelpCircle,
  Eye,
} from "lucide-react";
import { extractMapEmbedUrl } from "@/components/LocationMapSection";

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
    // Google Maps Location
    showMapSection: config.showMapSection ?? true,
    mapEmbedUrl: config.mapEmbedUrl || "",
    mapTitle: config.mapTitle || "",
    mapAddress: config.mapAddress || "",
    mapTiming: config.mapTiming || "",
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
      showMapSection: config.showMapSection ?? true,
      mapEmbedUrl: config.mapEmbedUrl || "",
      mapTitle: config.mapTitle || "",
      mapAddress: config.mapAddress || "",
      mapTiming: config.mapTiming || "",
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
    config.showMapSection,
    config.mapEmbedUrl,
    config.mapTitle,
    config.mapAddress,
    config.mapTiming,
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
      formData.bannerNotice !== (config.bannerNotice || "") ||
      formData.showMapSection !== (config.showMapSection ?? true) ||
      formData.mapEmbedUrl !== (config.mapEmbedUrl || "") ||
      formData.mapTitle !== (config.mapTitle || "") ||
      formData.mapAddress !== (config.mapAddress || "") ||
      formData.mapTiming !== (config.mapTiming || "")
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
        showMapSection: Boolean(formData.showMapSection),
        mapEmbedUrl: extractMapEmbedUrl(formData.mapEmbedUrl),
        mapTitle: formData.mapTitle.trim(),
        mapAddress: formData.mapAddress.trim(),
        mapTiming: formData.mapTiming.trim(),
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
      showMapSection: config.showMapSection ?? true,
      mapEmbedUrl: config.mapEmbedUrl || "",
      mapTitle: config.mapTitle || "",
      mapAddress: config.mapAddress || "",
      mapTiming: config.mapTiming || "",
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

      {/* ------------------------------------------------------------- */}
      {/* Google Maps Location & Directions Embed Settings Card */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-[#1A1D24] p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-[#222631] space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#222631] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-cheezious-yellow">
                <Navigation className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Google Maps Clinic / Branch Embed & Directions
              </h4>
            </div>
            <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted pl-10">
              Embed your live branch or clinic map on the storefront under the Menu with interactive navigation directions.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 pl-10 sm:pl-0">
            <span className="text-xs font-bold text-neutral-700 dark:text-cheezious-textLight">
              {formData.showMapSection ? "Section Visible" : "Section Hidden"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={formData.showMapSection}
              onClick={() => handleFieldChange("showMapSection", !formData.showMapSection)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cheezious-yellow focus:ring-offset-2 ${
                formData.showMapSection ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  formData.showMapSection ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {formData.showMapSection && (
          <div className="space-y-6">
            {/* Step-by-Step Guidance Box */}
            <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs sm:text-sm">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-cheezious-yellow shrink-0" />
                <span>How to get your Google Maps Embed Code (Step-by-Step)</span>
              </div>
              <ol className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1.5 list-decimal list-inside leading-relaxed font-medium pl-1">
                <li>
                  Open{" "}
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 dark:text-cheezious-yellow underline font-bold inline-flex items-center gap-0.5"
                  >
                    Google Maps <ExternalLink className="w-2.5 h-2.5" />
                  </a>{" "}
                  and search for your restaurant, branch, or clinic location.
                </li>
                <li>
                  Click the <strong>&quot;Share&quot;</strong> button on your location&apos;s details panel.
                </li>
                <li>
                  In the popup dialog, click the <strong>&quot;Embed a map&quot;</strong> tab.
                </li>
                <li>
                  Click the <strong>&quot;COPY HTML&quot;</strong> button.
                </li>
                <li>
                  Paste it into the <strong>Google Maps Embed Code</strong> input below (you can paste the full <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">&lt;iframe ...&gt;</code> code or just the URL — our system extracts the clean link automatically!).
                </li>
              </ol>
            </div>

            {/* Embed Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Embed Code / URL */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
                    <span>Google Maps Embed Code or URL</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    Supports raw URL or full &lt;iframe&gt; paste
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={formData.mapEmbedUrl}
                  onChange={(e) => {
                    const cleaned = extractMapEmbedUrl(e.target.value);
                    handleFieldChange("mapEmbedUrl", cleaned);
                  }}
                  placeholder='Paste https://www.google.com/maps/embed?... or full <iframe src="..." ...></iframe>'
                  className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs sm:text-sm font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow resize-none"
                />
              </div>

              {/* Map Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
                  <span>Section Display Title</span>
                </label>
                <input
                  type="text"
                  value={formData.mapTitle}
                  onChange={(e) => handleFieldChange("mapTitle", e.target.value)}
                  placeholder="e.g. Visit Our Main Branch / Clinic"
                  className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
                />
              </div>

              {/* Map Physical Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
                  <span>Physical Address / Directions Landmark</span>
                </label>
                <input
                  type="text"
                  value={formData.mapAddress}
                  onChange={(e) => handleFieldChange("mapAddress", e.target.value)}
                  placeholder="e.g. Shop 1-4, Block 13-E, Jinnah Super, F-7 Markaz, Islamabad"
                  className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
                />
              </div>

              {/* Operating Hours / Timings */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
                  <span>Working / Clinic Hours Note</span>
                </label>
                <input
                  type="text"
                  value={formData.mapTiming}
                  onChange={(e) => handleFieldChange("mapTiming", e.target.value)}
                  placeholder="e.g. Open Daily: 11:00 AM – 03:00 AM (Dine-in, Takeaway & Delivery)"
                  className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow"
                />
              </div>
            </div>

            {/* Live Admin Interactive Map Preview */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
                  <span>Live Map Preview</span>
                </span>
                {formData.mapEmbedUrl && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid embed URL ready
                  </span>
                )}
              </div>

              {formData.mapEmbedUrl ? (
                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 dark:border-[#222631] bg-gray-100 dark:bg-[#111317]">
                  <iframe
                    title="Admin Preview Google Map"
                    src={extractMapEmbedUrl(formData.mapEmbedUrl)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-200 dark:border-[#222631] flex flex-col items-center justify-center p-4 text-center text-xs text-neutral-500 dark:text-cheezious-textMuted space-y-1">
                  <Navigation className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="font-semibold">No embed code provided yet</span>
                  <span>Follow the steps above to copy and paste your Google Map embed code.</span>
                </div>
              )}
            </div>
          </div>
        )}
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
