import { createFileRoute } from "@tanstack/react-router";

// TikTok Events API relay (server-side)
// Called from the landing page after the TikTok Pixel fires so events
// dedupe with the shared event_id. The access token never reaches the client.

const PIXEL_CODE = "DBP2EDJC77UBQ4PDR4R0";

export const Route = createFileRoute("/api/public/tiktok-events")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const token = process.env["TIKTOK_ACCESS_TOKEN"];
          if (!token) {
            return Response.json(
              { error: "missing_tiktok_config" },
              { status: 500 },
            );
          }

          const body = (await request.json().catch(() => ({}))) as Record<
            string,
            unknown
          >;
          const {
            event = "Pageview",
            event_id,
            event_source_url,
            user_agent,
            ttp,
            ttclid,
            value,
            currency,
          } = body ?? {};

          const ip =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            undefined;

          const properties: Record<string, unknown> = {};
          if (value !== undefined) {
            properties.value = value;
            properties.currency = currency || "USD";
          }

          const payload = {
            pixel_code: PIXEL_CODE,
            event,
            event_id,
            timestamp: new Date().toISOString(),
            context: {
              page: { url: event_source_url },
              user: {
                user_agent:
                  user_agent || request.headers.get("user-agent") || undefined,
                ip,
                ttp: ttp || undefined,
              },
              ad: ttclid ? { callback: ttclid } : undefined,
            },
            properties: Object.keys(properties).length
              ? properties
              : undefined,
          };

          const res = await fetch(
            "https://business-api.tiktok.com/open_api/v1.3/event/track/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Token": token,
              },
              body: JSON.stringify(payload),
            },
          );
          const json = (await res.json().catch(() => ({}))) as {
            code?: number;
          };
          const ok = res.ok && json?.code === 0;
          return Response.json({ ok, tiktok: json }, { status: ok ? 200 : 502 });
        } catch (e) {
          return Response.json(
            { error: e instanceof Error ? e.message : "unknown" },
            { status: 500 },
          );
        }
      },
    },
  },
});
