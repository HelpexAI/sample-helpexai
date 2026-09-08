"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem, StoreConfig, defaultCheezious } from "@/data/defaultCheezious";
import {
  getLocalStoreConfig,
  saveLocalStoreConfig,
  fetchRemoteStoreConfig,
} from "@/lib/kvSync";
import { CartItem } from "@/lib/whatsapp";

interface ToastInfo {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface StoreContextType {
  config: StoreConfig;
  setConfig: (config: StoreConfig) => void;
  updateStoreConfig: (updater: (prev: StoreConfig) => StoreConfig) => void;
  resetToDefaults: () => void;
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  // Sync
  isLoading: boolean;
  refreshFromRemote: () => Promise<void>;
  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<StoreConfig>(defaultCheezious);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  // Initialize theme on client mount - default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("cheezious_theme") as "light" | "dark" | null;
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setThemeState(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("cheezious_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Initial load
  useEffect(() => {
    // 1. First load from local storage
    const localConfig = getLocalStoreConfig();
    setConfigState(localConfig);

    // 2. Fetch remote Cloudflare KV in background
    fetchRemoteStoreConfig()
      .then((remoteConfig) => {
        if (remoteConfig) {
          setConfigState(remoteConfig);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setConfig = (newConfig: StoreConfig) => {
    setConfigState(newConfig);
    saveLocalStoreConfig(newConfig);
  };

  const updateStoreConfig = (updater: (prev: StoreConfig) => StoreConfig) => {
    setConfigState((prev) => {
      const next = updater(prev);
      saveLocalStoreConfig(next);
      return next;
    });
  };

  const resetToDefaults = () => {
    setConfig(defaultCheezious);
    showToast("Reset all store settings and menu items to Cheezious defaults", "info");
  };

  const refreshFromRemote = async () => {
    setIsLoading(true);
    const remote = await fetchRemoteStoreConfig();
    if (remote) {
      setConfigState(remote);
      showToast("Updated from Cloudflare KV", "success");
    } else {
      showToast("No remote updates found. Using local configuration.", "info");
    }
    setIsLoading(false);
  };

  // Cart Management
  const addToCart = (item: MenuItem, qty = 1) => {
    if (!item.isAvailable) {
      showToast(`${item.name} is currently sold out.`, "error");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + qty }
            : ci
        );
      }
      return [...prev, { item, quantity: qty }];
    });
    showToast(`Added ${item.name} to cart!`, "success");
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  // Toast System
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        config,
        setConfig,
        updateStoreConfig,
        resetToDefaults,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        refreshFromRemote,
        toasts,
        showToast,
        removeToast,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
