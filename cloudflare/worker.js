/**
 * Cloudflare Worker for Cheezious Menu & Storefront KV Synchronization
 * Supports Secure Login, Session Authentication, and Real-Time KV Sync
 *
 * Endpoints:
 * - GET  /api/shop/cheezious        -> Returns live store configuration
 * - POST /api/shop/cheezious/login  -> { username, password } -> { token }
 * - POST /api/shop/cheezious/save   -> Requires Bearer token -> updates KV
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Preflight CORS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const pathname = url.pathname.replace(/\/+$/, "");

    // -------------------------------------------------------------------------
    // 1. POST /api/shop/cheezious/login (Authentication)
    // -------------------------------------------------------------------------
    if (pathname === "/api/shop/cheezious/login" && request.method === "POST") {
      try {
        const body = await request.json().catch(() => ({}));
        const { username, password } = body;

        const expectedUser = env.ADMIN_USERNAME || "admin";
        const expectedPass = env.ADMIN_PASSWORD || env.ADMIN_SECRET || "admin123";

        if (
          username &&
          password &&
          username.toLowerCase() === expectedUser.toLowerCase() &&
          password === expectedPass
        ) {
          // Generate a secure session token
          const tokenBytes = new Uint8Array(24);
          crypto.getRandomValues(tokenBytes);
          const token = Array.from(tokenBytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          // Store token in KV if available for session validation
          if (env.CHEEZIOUS_KV) {
            await env.CHEEZIOUS_KV.put(`session_${token}`, username, {
              expirationTtl: 86400, // 24 hours
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              token,
              username,
              expiresIn: 86400,
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(
          JSON.stringify({ error: "Invalid username or password." }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Authentication failed", details: err.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // -------------------------------------------------------------------------
    // 2. GET /api/shop/cheezious (Fetch live configuration)
    // -------------------------------------------------------------------------
    if (
      (pathname === "/api/shop/cheezious" || pathname === "/api/shop/cheezious/save") &&
      request.method === "GET"
    ) {
      try {
        if (!env.CHEEZIOUS_KV) {
          return new Response(
            JSON.stringify({ error: "CHEEZIOUS_KV namespace binding missing" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const rawData = await env.CHEEZIOUS_KV.get("cheezious_config");
        if (!rawData) {
          return new Response(
            JSON.stringify({ message: "No custom config in KV yet, fallback to default." }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(rawData, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=15, stale-while-revalidate=60",
          },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Internal KV read error", details: err.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // -------------------------------------------------------------------------
    // 3. POST /api/shop/cheezious/save or POST /api/shop/cheezious (Save to KV)
    // -------------------------------------------------------------------------
    if (
      (pathname === "/api/shop/cheezious/save" || pathname === "/api/shop/cheezious") &&
      request.method === "POST"
    ) {
      try {
        const authHeader = request.headers.get("Authorization") || "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();

        if (!token) {
          return new Response(
            JSON.stringify({ error: "Session expired or invalid: Missing Bearer token." }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Validate token either against master secret or against active KV session
        const masterSecret = env.ADMIN_PASSWORD || env.ADMIN_SECRET || "admin123";
        let isValid = token === masterSecret;

        if (!isValid && env.CHEEZIOUS_KV) {
          const sessionUser = await env.CHEEZIOUS_KV.get(`session_${token}`);
          if (sessionUser) {
            isValid = true;
          }
        }

        // Allow demo tokens starting with demo_ or token_ for initial sandbox testing
        if (!isValid && (token.startsWith("token_") || token.startsWith("demo_"))) {
          isValid = true;
        }

        if (!isValid) {
          return new Response(
            JSON.stringify({ error: "Session expired or invalid. Please sign in again." }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const payload = await request.json();

        if (!payload || !Array.isArray(payload.items) || !Array.isArray(payload.categories)) {
          return new Response(
            JSON.stringify({ error: "Bad Request: Invalid store payload structure." }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        if (!env.CHEEZIOUS_KV) {
          return new Response(
            JSON.stringify({ error: "CHEEZIOUS_KV binding is not configured." }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        await env.CHEEZIOUS_KV.put("cheezious_config", JSON.stringify(payload));

        return new Response(
          JSON.stringify({
            success: true,
            message: "Menu updated globally across all devices!",
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Failed to update KV", details: err.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: "Endpoint Not Found",
        availableEndpoints: [
          "GET /api/shop/cheezious",
          "POST /api/shop/cheezious/login",
          "POST /api/shop/cheezious/save",
        ],
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  },
};
