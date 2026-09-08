import { StoreConfig, defaultCheezious } from "@/data/defaultCheezious";

const CUSTOM_API_URL_KEY = "cheezious_custom_api_url";

export const SESSION_TOKEN_KEY = "helpex_admin_token";
export const SESSION_USER_KEY = "helpex_admin_user";

export function getEffectiveApiUrl(): string {
  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem(CUSTOM_API_URL_KEY);
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim().replace(/\/+$/, "");
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "https://helpexai.muhammadarslan0111.workers.dev/api/shop/cheezious";
}

export function setCustomApiUrl(url: string) {
  if (typeof window !== "undefined") {
    if (url.trim()) {
      localStorage.setItem(CUSTOM_API_URL_KEY, url.trim().replace(/\/+$/, ""));
    } else {
      localStorage.removeItem(CUSTOM_API_URL_KEY);
    }
  }
}

// ---------------------------------------------------------------------------
// Session & Anti-Hijack Guard (sessionStorage isolation)
// ---------------------------------------------------------------------------

export function getAdminSession(): { token: string; username: string } | null {
  if (typeof window === "undefined") return null;
  try {
    let token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    let username = sessionStorage.getItem(SESSION_USER_KEY);
    if (!token || !token.trim()) {
      token = localStorage.getItem(SESSION_TOKEN_KEY);
      username = localStorage.getItem(SESSION_USER_KEY);
    }
    if (token && token.trim().length > 0) {
      return { token: token.trim(), username: username || "admin" };
    }
  } catch (err) {
    console.error("Failed to read admin session:", err);
  }
  return null;
}

export function setAdminSession(token: string, username: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_USER_KEY, username);
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    localStorage.setItem(SESSION_USER_KEY, username);
  } catch (err) {
    console.error("Failed to write admin session:", err);
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
  } catch (err) {
    console.error("Failed to clear admin session:", err);
  }
}

// ---------------------------------------------------------------------------
// Remote Authentication (POST [API_URL]/login)
// ---------------------------------------------------------------------------

export async function loginAdmin(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; token?: string; username?: string; message: string }> {
  const username = usernameInput.trim();
  const password = passwordInput.trim();

  if (!username || !password) {
    return { success: false, message: "Please enter both username and password." };
  }

  const baseUrl = getEffectiveApiUrl();
  const loginUrl = `${baseUrl}/login`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        setAdminSession(data.token, username);
        return {
          success: true,
          token: data.token,
          username,
          message: "Signed in successfully with Backend!",
        };
      }
    }

    const errorData = await res.json().catch(() => ({}));
    const errMsg = errorData.error || errorData.message || "Invalid username or password.";
    return { success: false, message: errMsg };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Backend: ${err?.message || "Network error"}. Check API URL.`,
    };
  }
}

// ---------------------------------------------------------------------------
// Remote Fetch (GET [API_URL] - Purely from Cloudflare Worker KV)
// ---------------------------------------------------------------------------

export async function fetchRemoteStoreConfig(): Promise<StoreConfig | null> {
  const baseUrl = getEffectiveApiUrl();
  const fetchUrl = `${baseUrl}?_t=${Date.now()}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && Array.isArray(data.categories)) {
        return data;
      }
    } else {
      console.warn(`Cloudflare Worker returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to fetch from Cloudflare Worker KV:", err);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Remote Save Action (POST [API_URL]/save)
// ---------------------------------------------------------------------------

export async function saveRemoteStoreConfig(
  config: StoreConfig
): Promise<{ success: boolean; isUnauthorized?: boolean; message: string }> {
  const session = getAdminSession();
  if (!session || !session.token) {
    clearAdminSession();
    return {
      success: false,
      isUnauthorized: true,
      message: "Your session has expired. Please sign in again.",
    };
  }

  const baseUrl = getEffectiveApiUrl();
  const saveUrl = `${baseUrl}/save`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const payload = {
      ...config,
      shopId: "cheezious",
    };

    let res = await fetch(saveUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    // If /save returned 404, fallback to base URL for backwards compatibility
    if (res.status === 404) {
      res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    }

    clearTimeout(timeoutId);

    if (res.status === 401) {
      clearAdminSession();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cheezious_session_expired"));
      }
      return {
        success: false,
        isUnauthorized: true,
        message: "Your session has expired or is invalid. Please sign in again.",
      };
    }

    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cheezious_sync_event", Date.now().toString());
      }
      return {
        success: true,
        message: "Changes saved live to database!",
      };
    } else {
      const errText = await res.text().catch(() => "");
      return {
        success: false,
        message: `Server responded with ${res.status}: ${
          errText || "Authorization failed or endpoint unreachable."
        }`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to persist to database: ${err?.message || "Network error"}`,
    };
  }
}
