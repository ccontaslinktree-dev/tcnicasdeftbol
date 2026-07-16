// Meta Conversions API relay (server-side)
// Called from the client after Pixel fires so we can dedupe with event_id.
// Do NOT expose the access token to the client.

// deno-lint-ignore-file no-explicit-any
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
    const TOKEN = Deno.env.get("META_CAPI_TOKEN");
    if (!PIXEL_ID || !TOKEN) {
      return new Response(JSON.stringify({ error: "missing_meta_config" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const {
      event_name = "PageView",
      event_id,
      event_source_url,
      user_agent,
      email,
      phone,
      fbp,
      fbc,
      value,
      currency,
    } = body ?? {};

    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      undefined;

    const user_data: Record<string, unknown> = {
      client_user_agent: user_agent || req.headers.get("user-agent") || undefined,
      client_ip_address: ip,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    };
    if (email) user_data.em = [await sha256(String(email))];
    if (phone) user_data.ph = [await sha256(String(phone).replace(/\D/g, ""))];

    const event: Record<string, unknown> = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      event_source_url,
      action_source: "website",
      user_data,
    };
    if (value !== undefined) {
      event.custom_data = { value, currency: currency || "USD" };
    }

    const url = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event] }),
    });
    const json = await res.json().catch(() => ({}));
    return new Response(JSON.stringify({ ok: res.ok, meta: json }), {
      status: res.ok ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});