import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { FootballOffer } from "@/components/football-offer";
import { plans, type PlanId } from "@/lib/offer";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fútbol con Plan | Entrenadores y jugadores · US$ 10" },
      {
        name: "description",
        content:
          "Organiza tus sesiones de equipo y tu trabajo individual con más de 2.000 ejercicios, guía de planificación y 4 bonos. Pago único de US$ 10.",
      },
      { property: "og:title", content: "Fútbol con Plan · Entrena con una dirección clara" },
      {
        property: "og:description",
        content:
          "Para entrenadores y jugadores: biblioteca organizada, técnica individual y preparación física. US$ 10. Pago único.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
function eid() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const TIKTOK_EVENT_MAP: Record<string, string> = {
  PageView: "Pageview",
  ViewContent: "ViewContent",
  InitiateCheckout: "InitiateCheckout",
};

function fireEvent(name: string, value?: number) {
  if (typeof window === "undefined") return;
  const event_id = eid();
  const pixels = window as Window & {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track?: (
        event: string,
        properties: Record<string, unknown>,
        options: { event_id: string },
      ) => void;
    };
  };
  // A blocked or failing pixel must never interrupt the page or checkout.
  try {
    if (typeof pixels.fbq === "function") {
      pixels.fbq("track", name, value !== undefined ? { value, currency: "USD" } : undefined, {
        eventID: event_id,
      });
    }
  } catch {
    // Continue with the remaining tracking channels.
  }
  // TikTok exposes a queue with methods, not a callable function.
  const tiktokEvent = TIKTOK_EVENT_MAP[name] || name;
  try {
    if (typeof pixels.ttq?.track === "function") {
      pixels.ttq.track(tiktokEvent, value !== undefined ? { value, currency: "USD" } : {}, {
        event_id,
      });
    }
  } catch {
    // Continue to the server relays even if the browser pixel fails.
  }
  const getCookie = (k: string) => {
    const m = document.cookie.match(new RegExp("(^| )" + k + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : undefined;
  };
  // Meta CAPI relay via edge function (dedup by event_id)
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (supaUrl && supaKey) {
    fetch(`${supaUrl}/functions/v1/meta-capi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supaKey,
        Authorization: `Bearer ${supaKey}`,
      },
      body: JSON.stringify({
        event_name: name,
        event_id,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        value,
        currency: "USD",
      }),
      keepalive: true,
    }).catch(() => {});
  }
  // TikTok Events API relay via server route (dedup by event_id)
  fetch("/api/public/tiktok-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: tiktokEvent,
      event_id,
      event_source_url: window.location.href,
      user_agent: navigator.userAgent,
      ttp: getCookie("_ttp"),
      ttclid:
        getCookie("ttclid") ||
        new URLSearchParams(window.location.search).get("ttclid") ||
        undefined,
      value,
      currency: "USD",
    }),
    keepalive: true,
  }).catch(() => {});
}

function goCheckout(source: string, plan: PlanId = "completo") {
  const selected = plans[plan];
  if (!selected.checkoutUrl) return false;
  fireEvent("InitiateCheckout", selected.price);
  try {
    sessionStorage.setItem("cta_source", source);
  } catch {
    // Continue to checkout even when browser storage is unavailable.
  }
  const checkoutUrl = new URL(selected.checkoutUrl);
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (!checkoutUrl.searchParams.has(key)) {
      checkoutUrl.searchParams.append(key, value);
    }
  });
  window.location.href = checkoutUrl.toString();
  return true;
}

function Index() {
  useEffect(() => {
    fireEvent("ViewContent");
  }, []);
  return <FootballOffer onPurchase={goCheckout} />;
}
