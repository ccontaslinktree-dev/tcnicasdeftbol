import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/P107284207G?checkoutMode=2";

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

function buildHotmartCheckoutUrl() {
  if (typeof window === "undefined") return HOTMART_CHECKOUT_URL;

  const targetUrl = new URL(HOTMART_CHECKOUT_URL);
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

function fireHotmartInitiateCheckout() {
  if (typeof window === "undefined") return;

  const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // @ts-expect-error fbq global
  window.fbq?.(
    "track",
    "InitiateCheckout",
    { value: 6.5, currency: "USD" },
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
      value: 6.5,
      currency: "USD",
    }),
    keepalive: true,
  }).catch(() => {});
}

function isSalesCta(button: HTMLButtonElement) {
  const text = button.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
  return [
    "quiero el plan completo ahora",
    "quiero acceder a la biblioteca",
    "quiero entrenar con el método completo",
    "quiero formar parte",
    "quiero los 4 bonos incluidos",
    "sí, quiero el plan completo",
    "quiero acceder sin complicarme",
    "quiero mi plan completo",
    "desbloquear el plan completo",
    "plan completo · $6.50 usd",
  ].some((label) => text.includes(label));
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
    let anchor: HTMLAnchorElement | null = null;

    const createAnchor = () => {
      if (anchor) return anchor;
      anchor = document.createElement("a");
      anchor.id = "hotmart-widget-trigger";
      anchor.href = HOTMART_CHECKOUT_URL;
      anchor.className = "hotmart-fb hotmart__button-checkout";
      anchor.style.display = "none";
      anchor.setAttribute("aria-hidden", "true");
      anchor.setAttribute("onclick", "return false;");
      document.body.appendChild(anchor);
      return anchor;
    };

    const setup = async () => {
      if (disposed) return;
      createAnchor();
      await loadHotmartWidget();
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const button = target?.closest("button");
      if (!(button instanceof HTMLButtonElement) || !isSalesCta(button)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      fireHotmartInitiateCheckout();
      const checkoutUrl = buildHotmartCheckoutUrl();

      void loadHotmartWidget().then(() => {
        if (disposed) return;
        const trigger = createAnchor();
        trigger.href = checkoutUrl;
        trigger.click();
      });
    };

    document.addEventListener("click", handleClick, true);
    void setup();

    return () => {
      disposed = true;
      document.removeEventListener("click", handleClick, true);
      anchor?.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
