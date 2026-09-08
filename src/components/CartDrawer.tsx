"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice, getWhatsAppOrderUrl, CustomerDetails } from "@/lib/whatsapp";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Bike,
  UtensilsCrossed,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export function CartDrawer() {
  const {
    config,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
  } = useStore();

  const [orderType, setOrderType] = useState<"Delivery" | "Dine-In">("Delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!isCartOpen) return null;

  const deliveryFee = orderType === "Delivery" ? config.deliveryFee : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      setValidationError("Your cart is empty!");
      return;
    }
    if (!name.trim()) {
      setValidationError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setValidationError("Please enter your phone number.");
      return;
    }
    if (orderType === "Delivery" && !address.trim()) {
      setValidationError("Please provide your delivery address.");
      return;
    }
    if (orderType === "Dine-In" && !tableNumber.trim()) {
      setValidationError("Please enter your table number.");
      return;
    }

    setValidationError("");

    const customer: CustomerDetails = {
      name: name.trim(),
      phone: phone.trim(),
      orderType,
      address: address.trim(),
      landmark: landmark.trim(),
      tableNumber: tableNumber.trim(),
      notes: notes.trim(),
    };

    const url = getWhatsAppOrderUrl({
      config,
      cartItems: cart,
      customer,
    });

    // Open WhatsApp in new tab
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#16181F] text-neutral-900 dark:text-white border-l border-gray-200 dark:border-[#222631] shadow-2xl flex flex-col justify-between transition-colors duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#222631] bg-gray-50 dark:bg-[#1A1D24] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-cheezious-yellow/10 flex items-center justify-center text-amber-600 dark:text-cheezious-yellow">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-neutral-900 dark:text-white font-bold text-base">Your Cheezy Bag</h3>
                <p className="text-neutral-500 dark:text-cheezious-textMuted text-xs">
                  {cart.length} unique item{cart.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-[#222631] hover:bg-gray-300 dark:hover:bg-[#2D3342] text-neutral-600 dark:text-cheezious-textMuted hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] flex items-center justify-center text-amber-600 dark:text-cheezious-yellow">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-neutral-900 dark:text-white font-bold text-lg">Your bag is empty</h4>
                  <p className="text-neutral-500 dark:text-cheezious-textMuted text-xs mt-1 max-w-xs">
                    Satisfy your cravings with our Crown Crust, Bazinga Burgers, and Cheezy Loaded Fries!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-glow"
                >
                  Browse Full Menu
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((ci) => (
                    <div
                      key={ci.item.id}
                      className="bg-gray-50 dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-[#111317]">
                        <Image
                          src={ci.item.imageUrl}
                          alt={ci.item.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-neutral-900 dark:text-white font-bold text-xs truncate">
                          {ci.item.name}
                        </h4>
                        <div className="text-amber-600 dark:text-cheezious-yellow font-extrabold text-xs mt-0.5">
                          {formatPrice(ci.item.price * ci.quantity, config.currency)}
                        </div>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#111317] border border-gray-200 dark:border-[#222631] rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                          className="w-6 h-6 rounded bg-gray-100 dark:bg-[#1A1D24] hover:bg-gray-200 dark:hover:bg-[#222631] text-neutral-800 dark:text-white flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white w-5 text-center">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                          className="w-6 h-6 rounded bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black flex items-center justify-center font-bold transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(ci.item.id)}
                        className="text-neutral-400 hover:text-rose-500 dark:text-cheezious-textMuted dark:hover:text-rose-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Type Selector */}
                <div className="bg-gray-50 dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-xl p-3 space-y-2">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-cheezious-textMuted uppercase tracking-wider block">
                    Select Order Type
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType("Delivery")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        orderType === "Delivery"
                          ? "bg-cheezious-yellow text-black border-cheezious-yellow shadow-glow"
                          : "bg-white dark:bg-[#111317] text-neutral-700 dark:text-cheezious-textLight border-gray-200 dark:border-[#222631] hover:bg-gray-100 dark:hover:bg-[#16181F]"
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("Dine-In")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        orderType === "Dine-In"
                          ? "bg-cheezious-yellow text-black border-cheezious-yellow shadow-glow"
                          : "bg-white dark:bg-[#111317] text-neutral-700 dark:text-cheezious-textLight border-gray-200 dark:border-[#222631] hover:bg-gray-100 dark:hover:bg-[#16181F]"
                      }`}
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Dine-In / Takeaway</span>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="bg-gray-50 dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-xl p-3.5 space-y-3">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-cheezious-textMuted uppercase tracking-wider block">
                    Customer Information
                  </span>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-medium text-neutral-700 dark:text-cheezious-textLight mb-1 block">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Hamza Malik"
                        className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-neutral-700 dark:text-cheezious-textLight mb-1 block">
                        WhatsApp Contact Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0321-9876543"
                        className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted"
                      />
                    </div>

                    {orderType === "Delivery" ? (
                      <>
                        <div>
                          <label className="text-[11px] font-medium text-neutral-700 dark:text-cheezious-textLight mb-1 block">
                            Full Street Address *
                          </label>
                          <textarea
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="House #, Street #, Sector / Area..."
                            className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-neutral-700 dark:text-cheezious-textLight mb-1 block">
                            Nearest Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="e.g. Near Shell Pump, Opposite Park"
                            className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-[11px] font-medium text-neutral-700 dark:text-cheezious-textLight mb-1 block">
                          Table Number or Pickup Note *
                        </label>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder="e.g. Table #4 or Counter Pickup"
                          className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-medium text-neutral-700 dark:text-cheezious-textLight mb-1 block">
                        Special Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Extra chili garlic, no onions, etc."
                        className="w-full bg-white dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none focus:ring-1 focus:ring-cheezious-yellow placeholder:text-neutral-400 dark:placeholder:text-cheezious-textMuted"
                      />
                    </div>
                  </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-[#222631] bg-gray-50 dark:bg-[#1A1D24] space-y-3">
              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-neutral-600 dark:text-cheezious-textMuted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {formatPrice(cartSubtotal, config.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-600 dark:text-cheezious-textMuted">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {orderType === "Delivery"
                      ? formatPrice(deliveryFee, config.currency)
                      : "Free (Dine-In)"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-neutral-900 dark:text-white pt-2 border-t border-gray-200 dark:border-[#222631]">
                  <span>Grand Total</span>
                  <span className="text-amber-600 dark:text-cheezious-yellow text-base">
                    {formatPrice(grandTotal, config.currency)}
                  </span>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>Place Order on WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-neutral-500 dark:text-cheezious-textMuted">
                Direct WhatsApp integration with automated receipt formatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
