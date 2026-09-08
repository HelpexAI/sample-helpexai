"use client";

import React from "react";
import { Check, MessageSquare, Sparkles } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  buttonText: string;
  badge?: string | null;
  whatsappMsg: string;
}

export const AGENCY_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Website",
    price: "PKR 5,000",
    frequency: "(One-Time)",
    description: "Ideal for single-location cafes, cloud kitchens, and home chefs starting online.",
    features: [
      "Ultra-Fast Responsive Menu Website",
      "Automated WhatsApp Cart Checkout",
      "Mobile-First Touch & Tap Ordering",
      "Google Maps & Hotline Integration",
      "Free Cloud Hosting & Setup",
      "Zero Monthly Fees / Zero Commissions",
    ],
    buttonText: "Get Starter Website",
    badge: null,
    whatsappMsg: "Hi Helpex Solutions! I want to order the Starter Website (PKR 5,000).",
  },
  {
    id: "pro",
    name: "Pro Dynamic Menu",
    price: "PKR 10,000",
    frequency: "(One-Time)",
    description: "Full dynamic control with real-time live database sync and secure admin portal.",
    features: [
      "Everything in Starter Website",
      "Secure Admin Dashboard (/admin)",
      "Live Database Sync (Instant Updates)",
      "Real-Time 'In Stock / Sold Out' Toggles",
      "1-Click Dish & Category Price Editor",
      "Printable 300 DPI QR Table Standee Maker",
      "Interactive Dish Detail Modal with Add-ons",
    ],
    buttonText: "Get Pro Dynamic Menu",
    badge: null,
    whatsappMsg: "Hi Helpex Solutions! I want to order the Pro Dynamic Menu (PKR 10,000).",
  },
  {
    id: "premium",
    name: "Premium Business",
    price: "PKR 15,000",
    frequency: "(One-Time)",
    description: "Turnkey enterprise solution for multi-branch restaurants & expanding franchises.",
    features: [
      "Everything in Pro Dynamic Menu",
      "Multi-Branch Store Routing",
      "Custom Domain (.com / .pk) Setup",
      "Branded Graphic Assets & Standees",
      "Local SEO & Search Engine Indexing",
      "Automated Database Backup & Restore",
      "24/7 VIP WhatsApp Priority Support",
    ],
    buttonText: "Get Premium Business",
    badge: null,
    whatsappMsg: "Hi Helpex Solutions! I want to order the Premium Business Plan (PKR 15,000).",
  },
];

export function ComparePlansSection() {
  return (
    <section
      id="compare-plans"
      className="w-full py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/70 border-t border-amber-200/80 text-black"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-black text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-black text-black" />
            <span>Helpex Solutions • Transparent Pricing</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
            Compare Website Packages
          </h2>

          <p className="text-xs sm:text-sm text-black font-medium leading-relaxed">
            One-time affordable investment. Zero monthly marketplace commissions, zero hidden costs, and you own 100% of your customer relationship.
          </p>
        </div>

        {/* Responsive Plans Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {AGENCY_PLANS.map((plan) => {
            const waUrl = `https://wa.me/923146517960?text=${encodeURIComponent(
              plan.whatsappMsg
            )}`;

            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-neutral-200 hover:border-amber-400 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-black relative group"
              >
                {/* Top Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-black tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-black font-medium mt-1 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 pb-3 border-b border-neutral-200">
                    <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                      {plan.price}
                    </div>
                    <div className="text-xs font-bold text-black uppercase tracking-wider mt-0.5">
                      {plan.frequency}
                    </div>
                  </div>

                  {/* Feature Bullets */}
                  <ul className="space-y-2.5 text-xs text-black font-medium pt-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-black">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-black font-semibold leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-6 mt-6 border-t border-neutral-100">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4 fill-black" />
                    <span>{plan.buttonText}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help / Custom Inquiries Footnote */}
        <div className="text-center pt-2">
          <p className="text-xs text-black font-semibold">
            Need a custom package with POS or Payment Gateway integration?{" "}
            <a
              href="https://wa.me/923146517960?text=Hi%20Helpex%20Solutions!%20I%20have%20custom%20restaurant%20requirements."
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline font-black hover:opacity-80 ml-1"
            >
              Chat directly on WhatsApp (+92 314 6517960) →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
