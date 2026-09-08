/**
 * Cloudflare Worker for Cheezious Menu & Storefront KV Synchronization
 *
 * Deploy with Cloudflare Wrangler:
 *   npx wrangler deploy
 *
 * Requirements:
 * 1. KV Namespace binding: CHEEZIOUS_KV
 * 2. Environment Variable / Secret: ADMIN_SECRET (e.g. "admin123" or custom token)
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

    // Path matching
    if (url.pathname === "/api/shop/cheezious" || url.pathname === "/api/shop/cheezious/") {
      // 1. GET: Return current menu & store settings
      if (request.method === "GET") {
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

      // 2. POST: Update store config with Bearer authentication
      if (request.method === "POST") {
        try {
          const authHeader = request.headers.get("Authorization") || "";
          const token = authHeader.replace(/^Bearer\s+/i, "").trim();

          const expectedSecret = env.ADMIN_SECRET || "admin123";

          if (token !== expectedSecret) {
            return new Response(
              JSON.stringify({ error: "Unauthorized: Invalid admin secret key." }),
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
              message: "Store configuration saved and synced across Cloudflare KV edge!",
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
    }

    return new Response(
      JSON.stringify({ error: "Endpoint Not Found", availableEndpoints: ["/api/shop/cheezious"] }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  },
};
