import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-7xl font-bold text-foreground">404</h1><h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2><p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p><div className="mt-6"><Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link></div></div></div>;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1><p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p><div className="mt-6 flex flex-wrap justify-center gap-2"><button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Try again</button><a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Go home</a></div></div></div>;
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
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      { src: "https://cdn.utmify.com.br/scripts/utms/latest.js", async: true, defer: true, "data-utmify-prevent-subids": "" },
      { children: `
        window.fbq_init = function() {
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '889185807027175'); fbq('track', 'PageView');
        };
        if (window.requestIdleCallback) requestIdleCallback(window.fbq_init); else setTimeout(window.fbq_init, 2000);
      ` },
      { children: `
        (function () {
          function optimizeAfterPaint() {
            try {
              var sections = document.querySelectorAll('section');
              var hero = sections[0];
              if (hero) {
                var paragraphs = hero.querySelectorAll('p');
                if (paragraphs.length) paragraphs[paragraphs.length - 1].textContent = 'EU SEI O QUANTO É DIFICIL VOCE TER QUE IMPROVISAR, REPETIR TREINOS OU TREINAR IGUAL UM AMADOR, VOCE TEM TUDO AGORA EM UMA SO PLATAFORMA NA PALMA DA SUA MAO NA TELA DO SEU CELULAR, COMPUTADOR OU TABLET, E ESTA COM UM PRECO PROMOCIONAL MARAVILHOSO E QUE SO IRA DURAR ATE HOJE.';
              }
              document.querySelectorAll('video[src], iframe[src*="youtube.com/embed"]').forEach(function (el) {
                var src = el.getAttribute('src');
                if (!src) return;
                el.setAttribute('data-media-src', src);
                el.removeAttribute('src');
                if (el instanceof HTMLVideoElement) el.preload = 'none';
                if (el instanceof HTMLIFrameElement) el.loading = 'lazy';
                var load = function () {
                  var mediaSrc = el.getAttribute('data-media-src');
                  if (mediaSrc && !el.getAttribute('src')) el.setAttribute('src', mediaSrc);
                  if (el instanceof HTMLVideoElement) { el.preload = 'metadata'; try { el.load(); } catch (_) {} }
                };
                if ('IntersectionObserver' in window) {
                  var io = new IntersectionObserver(function (entries) { if (entries.some(function (entry) { return entry.isIntersecting; })) { load(); io.disconnect(); } }, { rootMargin: '400px 0px' });
                  io.observe(el);
                } else load();
              });
            } catch (_) {}
          }
          if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(optimizeAfterPaint, 50); }, { once: true });
          else setTimeout(optimizeAfterPaint, 50);
        })();
      ` },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) { return <html lang="es"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>; }
