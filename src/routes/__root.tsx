import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
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
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
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
      { name: "twitter:description", content: "+2.000 ejercicios profesionales de fútbol por posición y categoría — método completo listo para aplicar." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/44038a08-e049-46f1-8273-eed12814fc04/id-preview-996f82b4--9688cdb4-d0ab-4c73-bd12-0c417c465517.lovable.app-1784181108713.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/44038a08-e049-46f1-8273-eed12814fc04/id-preview-996f82b4--9688cdb4-d0ab-4c73-bd12-0c417c465517.lovable.app-1784181108713.png" },
    ],
    links: [
      { rel: "preload", as: "image", href: "/src/assets/hero-product.png" },
      { rel: "preload", as: "video", href: "/__l5e/assets-v1/ee1c657d-f341-4b18-b91c-798075c31211/preview.mov", type: "video/quicktime" },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        src: "https://cdn.utmify.com.br/scripts/utms/latest.js",
        async: true,
        defer: true,
        "data-utmify-prevent-subids": "",
      },
      {
        children: `
          window.fbq_init = function() {
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '889185807027175');
            fbq('track', 'PageView');
          };
          if (window.requestIdleCallback) requestIdleCallback(window.fbq_init);
          else setTimeout(window.fbq_init, 2000);
        `,
      },
      {
        children: `
          (function () {
            function addBasicOfferCard() {
              try {
                if (document.querySelector('[data-basic-offer-card="true"]')) return true;
                var section = document.getElementById('oferta');
                if (!section) return false;
                var wrapper = Array.from(section.querySelectorAll('div')).find(function (el) {
                  return Array.from(el.classList).includes('max-w-[560px]') && el.querySelector('button');
                });
                if (!wrapper || !wrapper.firstElementChild) return false;

                wrapper.className = 'grid md:grid-cols-2 gap-5 max-w-[1100px] mx-auto items-stretch';
                var premium = wrapper.firstElementChild;
                var basic = premium.cloneNode(true);
                basic.setAttribute('data-basic-offer-card', 'true');
                basic.className = 'relative group bg-white rounded-[32px] p-6 sm:p-8 flex flex-col border-2 border-slate-300 shadow-xl transition-all duration-500 hover:scale-[1.01]';

                var badge = basic.querySelector('.absolute');
                if (badge) badge.remove();
                var title = basic.querySelector('h3');
                if (title) title.textContent = '2.000 Ejercicios';
                var subtitle = basic.querySelector('h3 + p');
                if (subtitle) subtitle.textContent = 'La biblioteca esencial para dejar de buscar material suelto';

                var yellow = basic.querySelector('p.bg-\\[\\#facc15\\]');
                if (yellow) {
                  yellow.textContent = 'Ideal si quieres acceder a los ejercicios organizados sin llevarte los extras del Plan Completo.';
                  yellow.className = 'mt-3 text-[13px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2';
                }

                var rows = basic.querySelectorAll('.space-y-4 > div');
                var items = [
                  '+2.000 entrenamientos de fútbol',
                  'Organizados por posición',
                  'Organizados por categoría',
                  'Listos para aplicar hoy',
                  'Acceso inmediato',
                  'Acceso vitalicio + actualizaciones automáticas',
                  'Garantía total de 7 días'
                ];
                items.forEach(function (text, i) {
                  if (rows[i]) {
                    var span = rows[i].querySelector('span');
                    if (span) span.textContent = text;
                  }
                });
                for (var i = items.length; i < rows.length; i++) rows[i].remove();

                var priceBox = basic.querySelector('.bg-slate-50');
                if (priceBox) {
                  var oldPrice = priceBox.querySelector('p');
                  if (oldPrice) { oldPrice.textContent = '$49.90'; oldPrice.className = 'text-slate-400 font-bold text-xl line-through leading-none'; }
                  var price = priceBox.querySelector('.text-5xl');
                  if (price) price.textContent = '$25.90';
                  var usd = priceBox.querySelector('.text-2xl');
                  if (usd) { usd.textContent = 'USD'; usd.className = 'text-2xl font-black text-slate-700'; }
                  var labels = priceBox.querySelectorAll('div.mt-4');
                  if (labels[0]) labels[0].remove();
                }

                var oldButton = basic.querySelector('button');
                if (oldButton) {
                  var link = document.createElement('a');
                  var target = new URL('https://pay.hotmart.com/B107438269A?checkoutMode=10', window.location.href);
                  var params = new URLSearchParams(window.location.search);
                  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','xcod'].forEach(function (key) {
                    var value = params.get(key);
                    if (value) target.searchParams.set(key, value);
                  });
                  var xcod = params.get('xcod');
                  if (xcod) target.searchParams.set('sck', xcod);
                  link.href = target.toString();
                  link.className = 'w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-black uppercase py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base';
                  link.textContent = 'QUIERO SESIONES LISTAS Y ORGANIZADAS →';
                  oldButton.replaceWith(link);
                }
                wrapper.appendChild(basic);
                return true;
              } catch (e) {
                console.warn('Basic offer card injection skipped', e);
                return false;
              }
            }

            function start() {
              if (addBasicOfferCard()) return;
              var observer = new MutationObserver(function () {
                if (addBasicOfferCard()) observer.disconnect();
              });
              if (document.body) observer.observe(document.body, { childList: true, subtree: true });
              var tries = 0;
              var interval = setInterval(function () {
                tries++;
                if (addBasicOfferCard() || tries >= 30) clearInterval(interval);
              }, 500);
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
            else start();
          })();
        `,
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
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
