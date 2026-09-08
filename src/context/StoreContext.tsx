"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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
  updateStoreConfig: (
    updater: (prev: StoreConfig) => StoreConfig
  ) => Promise<{ success: boolean; message?: string }>;
  resetToDefaults: () => Promise<void>;
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
  refreshFromRemote: (options?: { showToast?: boolean; showLoading?: boolean }) => Promise<void>;
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

  const refreshFromRemote = useCallback(
    async (options?: { showToast?: boolean; showLoading?: boolean }) => {
      const showToastMsg = options?.showToast ?? false;
      const showLoadingIndicator = options?.showLoading ?? false;

      if (showLoadingIndicator) setIsLoading(true);
      try {
        const remote = await fetchRemoteStoreConfig();
        if (remote) {
          setConfigState(remote);
          if (showToastMsg) {
            showToast("Refreshed live data from database", "success");
          }
        } else if (showToastMsg) {
          showToast("Could not retrieve latest data from database", "error");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load strictly from Cloudflare Worker KV
  useEffect(() => {
    refreshFromRemote({ showLoading: true, showToast: false });
  }, [refreshFromRemote]);

  // Multi-tab synchronization and background revalidation
  useEffect(() => {
    const handleRevalidate = () => {
      refreshFromRemote({ showLoading: false, showToast: false });
    };

    // 1. Revalidate on window focus (e.g. switching back from Admin tab to Storefront tab)
    window.addEventListener("focus", handleRevalidate);

    // 2. Revalidate when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        handleRevalidate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 3. Revalidate immediately when an update occurs in another tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cheezious_sync_event") {
        handleRevalidate();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleRevalidate);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshFromRemote]);

  const setConfig = (newConfig: StoreConfig) => {
    setConfigState(newConfig);
    const session = getAdminSession();
    if (session && session.token) {
      saveRemoteStoreConfig(newConfig).catch(console.error);
    }
  };

  const updateStoreConfig = async (
    updater: (prev: StoreConfig) => StoreConfig
  ): Promise<{ success: boolean; message?: string }> => {
    const session = getAdminSession();
    if (!session || !session.token) {
      showToast("Authentication required. Please sign in to save changes.", "error");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cheezious_session_expired"));
      }
      return { success: false, message: "Authentication required" };
    }

    const nextConfig = updater(config);

    try {
      const res = await saveRemoteStoreConfig(nextConfig);
      if (res.success) {
        setConfigState(nextConfig);
        return { success: true, message: res.message };
      } else if (res.isUnauthorized) {
        showToast("Session expired. Please sign in again.", "error");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cheezious_session_expired"));
        }
        return { success: false, message: res.message };
      } else {
        showToast(res.message || "Failed to save changes to database", "error");
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      console.error("Database sync error:", err);
      showToast("Failed to sync changes with database", "error");
      return { success: false, message: err?.message || "Network error" };
    }
  };

  const resetToDefaults = async () => {
    const session = getAdminSession();
    if (!session || !session.token) {
      showToast("Authentication required to reset store settings.", "error");
      return;
    }
    try {
      const res = await saveRemoteStoreConfig(defaultCheezious);
      if (res.success) {
        setConfigState(defaultCheezious);
        showToast("Reset all store settings and synced to database", "success");
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to reset store settings", "error");
    }
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
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => {
        // Prevent duplicate toast spam
        if (prev.some((t) => t.message === message)) return prev;
        return [...prev, { id, message, type }];
      });
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

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
