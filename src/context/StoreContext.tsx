"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem, StoreConfig, defaultCheezious } from "@/data/defaultCheezious";
import {
  fetchRemoteStoreConfig,
  saveRemoteStoreConfig,
  getAdminSession,
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
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("cheezious_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
      return next;
    });
  };

  // Initial load strictly from Cloudflare Worker KV
  useEffect(() => {
    fetchRemoteStoreConfig()
      .then((remoteConfig) => {
        if (remoteConfig) {
          setConfigState(remoteConfig);
        }
      })
      .catch((err) => {
        console.error("Failed to load initial data from Cloudflare Worker KV:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setConfig = (newConfig: StoreConfig) => {
    setConfigState(newConfig);
    const session = getAdminSession();
    if (session && session.token) {
      saveRemoteStoreConfig(newConfig).catch(console.error);
    }
  };

  const updateStoreConfig = (updater: (prev: StoreConfig) => StoreConfig) => {
    setConfigState((prev) => {
      const next = updater(prev);

      // Automatically sync with remote Worker/KV whenever authenticated
      const session = getAdminSession();
      if (session && session.token) {
        saveRemoteStoreConfig(next)
          .then((res) => {
            if (res.success) {
              console.log("Auto-synced update to database:", res.message);
            } else if (res.isUnauthorized) {
              showToast("Session expired. Please sign in again.", "error");
            } else {
              showToast(res.message, "error");
            }
          })
          .catch((err) => {
            console.error("Database sync error:", err);
            showToast("Failed to sync changes with database", "error");
          });
      }

      return next;
    });
  };

  const resetToDefaults = () => {
    setConfigState(defaultCheezious);
    const session = getAdminSession();
    if (session && session.token) {
      saveRemoteStoreConfig(defaultCheezious)
        .then((res) => {
          if (res.success) {
            showToast("Reset all store settings and synced to database", "success");
          } else {
            showToast(res.message, "error");
          }
        })
        .catch(console.error);
    } else {
      showToast("Reset menu items to default state.", "info");
    }
  };

  const refreshFromRemote = async () => {
    setIsLoading(true);
    const remote = await fetchRemoteStoreConfig();
    if (remote) {
      setConfigState(remote);
      showToast("Refreshed live data from database", "success");
    } else {
      showToast("Could not retrieve latest data from database", "error");
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
