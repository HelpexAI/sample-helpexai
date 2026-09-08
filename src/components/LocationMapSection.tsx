"use client";

import React, { useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import {
  MapPin,
  Clock,
  Navigation,
  Phone,
  MessageSquare,
  ExternalLink,
  Sparkles,
} from "lucide-react";

/**
 * Extracts a clean Google Maps iframe embed URL from either:
 * 1. Raw URL: "https://www.google.com/maps/embed?pb=..."
 * 2. Full iframe snippet: '<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
 */
export function extractMapEmbedUrl(input?: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (trimmed.startsWith("<iframe")) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }
  return trimmed;
}

export function LocationMapSection() {
  const { config } = useStore();

  // If map section is toggled off in store settings, do not render
  if (config.showMapSection === false) {
    return null;
  }

  const embedUrl = useMemo(() => {
    return extractMapEmbedUrl(config.mapEmbedUrl);
  }, [config.mapEmbedUrl]);

  // Direct directions link for Google Maps
  const directionsQuery = config.mapAddress || config.selectedBranch || config.brandName;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    directionsQuery
  )}`;

  const cleanHotline = (config.hotline || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (config.whatsappNumber || "").replace(/[^\d]/g, "");

  return (
    <section
      id="location-map"
      className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-[#222631] bg-white/60 dark:bg-[#12141A]/60 backdrop-blur-sm transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 dark:bg-cheezious-yellow/10 border border-amber-500/30 dark:border-cheezious-yellow/30 text-amber-800 dark:text-cheezious-yellow text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 fill-current" />
            <span>Store Location & Directions</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            {config.mapTitle || "Visit Our Branch & Dine-In"}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-cheezious-textMuted font-medium">
            Find us easily, get real-time navigation directions, or contact our branch counter directly.
          </p>
        </div>

        {/* Responsive Two-Column Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left / Info Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1A1D24] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-[#222631] shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Branch Tag */}
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-[#222631] pb-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-cheezious-yellow">
                    Active Branch
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight mt-0.5">
                    {config.selectedBranch || config.brandName}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-cheezious-yellow shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#12141A] border border-gray-200/60 dark:border-[#222631]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-cheezious-yellow flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-neutral-500 dark:text-cheezious-textMuted uppercase tracking-wider">
                    Physical Address
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                    {config.mapAddress || config.selectedBranch || "Visit our official outlet for hot & fresh dine-in!"}
                  </div>
                </div>
              </div>

              {/* Branch / Clinic Timings */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#12141A] border border-gray-200/60 dark:border-[#222631]">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-neutral-500 dark:text-cheezious-textMuted uppercase tracking-wider">
                    Working Hours
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                    {config.mapTiming || "Open Daily: 11:00 AM – 03:00 AM (Dine-in, Takeaway & Delivery)"}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-[#222631]">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4 fill-black" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                {config.hotline && (
                  <a
                    href={`tel:${cleanHotline}`}
                    className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-[#222631] hover:bg-gray-200 dark:hover:bg-[#2D3342] text-neutral-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-500 dark:text-cheezious-yellow" />
                    <span>Call Hotline</span>
                  </a>
                )}
                {config.whatsappNumber && (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=Hi%20${encodeURIComponent(
                      config.brandName
                    )}!%20I%20need%20directions%20to%20your%20branch.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right / Interactive Map Column (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1A1D24] rounded-3xl p-3 sm:p-4 border border-gray-200 dark:border-[#222631] shadow-lg flex flex-col justify-between overflow-hidden relative group">
            {embedUrl ? (
              <div className="w-full h-[340px] sm:h-[420px] lg:h-full min-h-[340px] rounded-2xl overflow-hidden relative bg-gray-100 dark:bg-[#111317]">
                <iframe
                  title="Branch Google Map"
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full rounded-2xl"
                />

                {/* Floating Interactive Badge */}
                <div className="absolute top-3 right-3 pointer-events-none bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                  <Navigation className="w-3 h-3 text-amber-400" />
                  <span>Interactive Map • Pinch / Drag to Zoom</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-[340px] sm:h-[420px] rounded-2xl bg-gray-50 dark:bg-[#12141A] border-2 border-dashed border-gray-300 dark:border-[#2D3342] flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-cheezious-yellow">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Google Map Embed Pending
                </h4>
                <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted max-w-sm">
                  Add your Google Maps embed URL or iframe code in the Admin Store Settings to display your branch map here.
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-cheezious-yellow underline"
                >
                  <span>Open {config.selectedBranch || "Branch"} in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
