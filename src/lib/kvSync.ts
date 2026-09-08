import { StoreConfig, defaultCheezious } from "@/data/defaultCheezious";

const STORAGE_KEY = "cheezious_store_config";
const AUTH_TOKEN_KEY = "cheezious_admin_token";
const CUSTOM_API_URL_KEY = "cheezious_custom_api_url";

export function getEffectiveApiUrl(): string {
  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem(CUSTOM_API_URL_KEY);
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim();
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://restaurant-api.helpexai.workers.dev/api/shop/cheezious"
  );
}

export function setCustomApiUrl(url: string) {
  if (typeof window !== "undefined") {
    if (url.trim()) {
      localStorage.setItem(CUSTOM_API_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(CUSTOM_API_URL_KEY);
    }
  }
}

export function getAdminToken(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_TOKEN_KEY) || "";
  }
  return "";
}

export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function getLocalStoreConfig(): StoreConfig {
  if (typeof window === "undefined") {
    return defaultCheezious;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.items) && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read local store config:", err);
  }
  return defaultCheezious;
}

export function saveLocalStoreConfig(config: StoreConfig): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.error("Failed to save local store config:", err);
    }
  }
}

export async function fetchRemoteStoreConfig(): Promise<StoreConfig | null> {
  const url = getEffectiveApiUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && Array.isArray(data.categories)) {
        saveLocalStoreConfig(data);
        return data;
      }
    }
  } catch (err) {
    // Graceful fallback to default/local storage without crashing UI
    console.warn("Could not fetch remote Cloudflare KV config, using local fallback:", err);
  }
  return null;
}

export async function pushRemoteStoreConfig(
  config: StoreConfig,
  token: string
): Promise<{ success: boolean; message: string }> {
  // Always save locally first so user never loses state
  saveLocalStoreConfig(config);

  const url = getEffectiveApiUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return {
        success: true,
        message: "Changes synced globally to Cloudflare KV across all devices!",
      };
    } else {
      const errText = await res.text().catch(() => "");
      return {
        success: false,
        message: `Saved locally! Cloudflare Worker responded with status ${res.status}: ${
          errText || "Authorization failed or endpoint unreachable."
        }`,
      };
    }
  } catch (err: any) {
    return {
      success: true, // Saved locally
      message: `Saved locally in browser! (Cloudflare Worker at ${url} was unreachable: ${
        err?.message || "Network error"
      })`,
    };
  }
}
