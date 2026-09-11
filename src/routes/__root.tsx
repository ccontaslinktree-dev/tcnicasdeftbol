import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const PREMIUM_CHECKOUT_URL = "https://pay.hotmart.com/P107284207G?checkoutMode=2";
const BASIC_CHECKOUT_URL = "https://pay.hotmart.com/B107438269A?checkoutMode=2";

function loadHotmartWidget() {
  if (typeof document === "undefined") return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>('script[data-hotmart-widget="true"]');
  if (existing) {
    return existing.dataset.loaded === "true"
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => resolve(), { once: true });
        });
  }

  const imported = document.createElement("script");
  imported.src = "https://static.hotmart.com/checkout/widget.min.js";
  imported.async = true;
  imported.dataset.hotmartWidget = "true";

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://static.hotmart.com/css/hotmart-fb.min.css";
  if (!document.head.querySelector('link[data-hotmart-widget-style="true"]')) {
    link.dataset.hotmartWidgetStyle = "true";
    document.head.appendChild(link);
  }

  return new Promise<void>((resolve) => {
    imported.addEventListener("load", () => {
      imported.dataset.loaded = "true";
      resolve();
    }, { once: true });
    imported.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(imported);
  });
}

function buildHotmartCheckoutUrl(baseUrl: string) {
  if (typeof window === "undefined") return baseUrl;

  const targetUrl = new URL(baseUrl);
  const searchParams = new URLSearchParams(window.location.search);
  const trackingParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "xcod",
  ];

  trackingParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) targetUrl.searchParams.set(param, value);
  });

  const xcod = searchParams.get("xcod");
  if (xcod) targetUrl.searchParams.set("sck", xcod);

  return targetUrl.toString();
}

function fireHotmartInitiateCheckout(value?: number) {
  if (typeof window === "undefined") return;

  const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // @ts-expect-error fbq global
  window.fbq?.(
    "track",
    "InitiateCheckout",
    value ? { value, currency: "USD" } : undefined,
    { eventID: eventId },
  );

  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supaUrl || !supaKey) return;

  const getCookie = (key: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : undefined;
  };

  fetch(`${supaUrl}/functions/v1/meta-capi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supaKey,
      Authorization: `Bearer ${supaKey}`,
    },
    body: JSON.stringify({
      event_name: "InitiateCheckout",
      event_id: eventId,
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

function getButtonText(button: HTMLButtonElement) {
  return button.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
}

function isPremiumPlanButton(button: HTMLButtonElement) {
  return getButtonText(button).includes("sí, quiero el plan completo");
}

function isBasicPlanButton(button: HTMLButtonElement) {
  return getButtonText(button).includes("sí, quiero el plan básico");
}

function injectBasicPlanCard() {
  const offer = document.getElementById("oferta");
  if (!offer || document.getElementById("plano-basico-card")) return;

  const premiumCard = offer.querySelector("div.max-w-\\[560px\\]");
  if (!premiumCard) return;

  const wrapper = document.createElement("div");
  wrapper.id = "plano-basico-card";
  wrapper.className = "max-w-[560px] mx-auto mt-6 bg-white text-[#0f172a] rounded-[30px] p-6 sm:p-8 border-2 border-slate-300 shadow-xl text-left";
  wrapper.innerHTML = `
    <div class="text-center mb-6">
      <span class="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
        Plan Básico · Acceso esencial
      </span>
      <h3 class="font-black uppercase text-2xl sm:text-3xl mt-4">Biblioteca Básica</h3>
      <p class="text-slate-500 text-sm font-bold mt-1">Una opción más simple para empezar a entrenar.</p>
    </div>
    <div class="space-y-3 mb-7">
      <div class="flex items-start gap-2.5"><span class="text-[#16a34a] font-black">✓</span><span class="font-bold text-sm">Acceso al contenido principal del plan básico</span></div>
      <div class="flex items-start gap-2.5"><span class="text-[#16a34a] font-black">✓</span><span class="font-bold text-sm">Material digital para entrenar desde móvil, tablet u ordenador</span></div>
      <div class="flex items-start gap-2.5"><span class="text-[#16a34a] font-black">✓</span><span class="font-bold text-sm">Compra segura procesada por Hotmart</span></div>
    </div>
    <button type="button" data-hotmart-basic="true" class="w-full bg-[#0f172a] hover:bg-[#020617] active:scale-[0.98] text-white font-black uppercase py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg">
      Sí, quiero el Plan Básico
      <span aria-hidden="true">→</span>
    </button>
    <p class="mt-3 text-center text-[11px] text-slate-500">Compra procesada por Hotmart</p>
  `;

  premiumCard.insertAdjacentElement("afterend", wrapper);
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "+2.000 Ejercicios de Fútbol — Método Completo para Jugadores y Entrenadores" },
      { name: "description", content: "+2.000 ejercicios profesionales de fútbol por posición y categoría — método completo listo para aplicar." },
      { property: "og:title", content: "+2.000 Ejercicios de Fútbol — Método Completo para Jugadores y Entrenadores" },
      { property: "og:description", content: "+2.000 ejercicios profesionales de fútbol por posición y categoría — método completo listo para aplicar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "+2.000 Ejercicios de Fútbol — Método Completo para Jugadores y Entrenadores" },
      { name: "twitter:description", content: "+2.000 ejercicios profissionais de fútbol por posición y categoría — método completo listo para aplicar." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/44038a08-e049-46f1-8273-eed12814fc04/id-preview-996f82b4--9688cdb4-d0ab-4c73-bd12-0c417c465517.lovable.app-1784181108713.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/44038a08-e049-46f1-8273-eed12814fc04/id-preview-996f82b4--9688cdb4-d0ab-4c73-bd12-0c417c465517.lovable.app-1784181108713.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        src: "https://cdn.utmify.com.br/scripts/utms/latest.js",
        async: true,
        defer: true,
        "data-utmify-prevent-subids": "",
      },
      {
        children: `window.fbq_init=function(){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','889185807027175');fbq('track','PageView');};if(window.requestIdleCallback)requestIdleCallback(window.fbq_init);else setTimeout(window.fbq_init,2000);`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    let disposed = false;
    const anchors = new Map<string, HTMLAnchorElement>();

    const createAnchor = (id: string, href: string) => {
      const existing = document.getElementById(id);
      if (existing instanceof HTMLAnchorElement) return existing;

      const anchor = document.createElement("a");
      anchor.id = id;
      anchor.href = href;
      anchor.className = "hotmart-fb hotmart__button-checkout";
      anchor.style.display = "none";
      anchor.setAttribute("aria-hidden", "true");
      anchor.setAttribute("onclick", "return false;");
      document.body.appendChild(anchor);
      anchors.set(id, anchor);
      return anchor;
    };

    const setup = async () => {
      if (disposed) return;
      createAnchor("hotmart-widget-premium-trigger", PREMIUM_CHECKOUT_URL);
      createAnchor("hotmart-widget-basic-trigger", BASIC_CHECKOUT_URL);
      await loadHotmartWidget();
      injectBasicPlanCard();
    };

    const scrollToOffer = () => {
      const offer = document.getElementById("oferta");
      if (!offer) return;
      offer.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const openWidget = (plan: "premium" | "basic") => {
      const baseUrl = plan === "premium" ? PREMIUM_CHECKOUT_URL : BASIC_CHECKOUT_URL;
      const value = plan === "premium" ? 6.5 : undefined;
      fireHotmartInitiateCheckout(value);
      const checkoutUrl = buildHotmartCheckoutUrl(baseUrl);

      void loadHotmartWidget().then(() => {
        if (disposed) return;
        const id = plan === "premium" ? "hotmart-widget-premium-trigger" : "hotmart-widget-basic-trigger";
        const trigger = createAnchor(id, checkoutUrl);
        trigger.href = checkoutUrl;
        trigger.click();
      });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const button = target?.closest("button");
      if (!(button instanceof HTMLButtonElement)) return;

      if (isPremiumPlanButton(button)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openWidget("premium");
        return;
      }

      if (isBasicPlanButton(button)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openWidget("basic");
        return;
      }

      if (button.closest("#plano-basico-card")) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      scrollToOffer();
    };

    document.addEventListener("click", handleClick, true);
    void setup();

    return () => {
      disposed = true;
      document.removeEventListener("click", handleClick, true);
      anchors.forEach((anchor) => anchor.remove());
      document.getElementById("plano-basico-card")?.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
