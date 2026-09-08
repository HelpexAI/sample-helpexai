// Universal Web-Crypto HMAC-SHA256 Signer & Verifier
async function createToken(payloadObj, secretKey) {
  const enc = new TextEncoder();
  const payloadStr = JSON.stringify(payloadObj);
  const payloadBase64 = btoa(payloadStr);

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payloadBase64));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${payloadBase64}.${signatureBase64}`;
}

async function verifyToken(tokenStr, secretKey) {
  try {
    const [payloadBase64, signatureBase64] = tokenStr.split(".");
    if (!payloadBase64 || !signatureBase64) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secretKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payloadBase64));
    if (!isValid) return null;

    const payload = JSON.parse(atob(payloadBase64));
    if (payload.exp && Date.now() > payload.exp) return null; // Expired

    return payload;
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/").filter(Boolean);

      // Expected endpoints:
      // 1. GET  /api/shop/:shop_id         -> Public store data
      // 2. POST /api/shop/:shop_id/login   -> Returns signed session token
      // 3. POST /api/shop/:shop_id/save    -> Saves store data (Requires Bearer token)
      if (pathParts[0] !== "api" || pathParts[1] !== "shop" || !pathParts[2]) {
        return new Response(JSON.stringify({ error: "Invalid path format" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const shopId = pathParts[2].toLowerCase();
      const action = pathParts[3]; // undefined, "login", or "save"
      const dataKey = `shop:${shopId}:data`;
      const authKey = `shop:${shopId}:auth`;

      if (!env.RESTAURANT_KV) {
        return new Response(JSON.stringify({ error: "KV binding RESTAURANT_KV not found." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- ENDPOINT 1: PUBLIC GET STORE DATA ---
      if (request.method === "GET") {
        const storeData = await env.RESTAURANT_KV.get(dataKey);
        if (!storeData) {
          return new Response(JSON.stringify({ error: `Store '${shopId}' not found.` }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(storeData, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
      }

      // --- ENDPOINT 2: SECURE LOGIN (Issues Token) ---
      if (request.method === "POST" && action === "login") {
        const { username, password } = await request.json();
        const authDataRaw = await env.RESTAURANT_KV.get(authKey);

        if (!authDataRaw) {
          return new Response(JSON.stringify({ error: "Shop credentials not found in KV." }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const authData = JSON.parse(authDataRaw);
        if (username !== authData.username || password !== authData.password) {
          return new Response(JSON.stringify({ error: "Invalid username or password" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Generate signed token valid for 8 hours
        const sessionPayload = {
          shopId,
          user: username,
          exp: Date.now() + 8 * 60 * 60 * 1000,
        };

        const secretKey = authData.password + "_helpex_secure_salt";
        const sessionToken = await createToken(sessionPayload, secretKey);

        return new Response(
          JSON.stringify({
            success: true,
            token: sessionToken,
            expiresIn: "8 hours",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // --- ENDPOINT 3: SECURE SAVE / MUTATION (Requires Valid Signed Token) ---
      if (request.method === "POST" && action === "save") {
        const authHeader = request.headers.get("Authorization") || "";
        const token = authHeader.replace("Bearer ", "").trim();

        if (!token) {
          return new Response(JSON.stringify({ error: "Unauthorized: Missing session token" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const authDataRaw = await env.RESTAURANT_KV.get(authKey);
        const authData = JSON.parse(authDataRaw || "{}");
        const secretKey = (authData.password || "") + "_helpex_secure_salt";

        const validSession = await verifyToken(token, secretKey);
        if (!validSession || validSession.shopId !== shopId) {
          return new Response(
            JSON.stringify({ error: "Session expired or invalid. Please login again." }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Authorized: Save payload to KV
        const body = await request.json();
        body.shopId = shopId;
        await env.RESTAURANT_KV.put(dataKey, JSON.stringify(body));

        return new Response(JSON.stringify({ success: true, message: "Changes saved live!" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
