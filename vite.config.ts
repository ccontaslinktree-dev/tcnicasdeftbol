// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

const performanceHeadScript = `
(function () {
  if (window.__footballPerfOptimizer) return;
  window.__footballPerfOptimizer = true;

  // Prevent the large local preview video from competing with the first paint.
  // It is still loaded automatically as soon as the user approaches the video.
  var originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if (this instanceof HTMLVideoElement && name === 'src' && /preview\\.mov/i.test(String(value))) {
      this.setAttribute('data-deferred-src', String(value));
      return;
    }
    if (this instanceof HTMLIFrameElement && name === 'src' && /youtube\\.com\\/embed/i.test(String(value))) {
      this.setAttribute('data-deferred-src', String(value));
      return;
    }
    return originalSetAttribute.call(this, name, value);
  };

  function loadDeferredMedia(el) {
    if (!el || el.getAttribute('data-deferred-loaded') === 'true') return;
    var src = el.getAttribute('data-deferred-src');
    if (!src) return;
    el.setAttribute('data-deferred-loaded', 'true');
    el.removeAttribute('data-deferred-src');
    originalSetAttribute.call(el, 'src', src);
    if (el instanceof HTMLVideoElement) {
      el.preload = 'metadata';
      try { el.load(); } catch (_) {}
    }
  }

  function scan() {
    document.querySelectorAll('video[data-deferred-src], iframe[data-deferred-src]').forEach(function (el) {
      if (el.getAttribute('data-deferred-observed') === 'true') return;
      el.setAttribute('data-deferred-observed', 'true');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadDeferredMedia(el);
            io.disconnect();
          }
        });
      }, { rootMargin: '500px 0px' });
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan, { once: true });
  } else {
    scan();
  }
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
`;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      mcpPlugin(),
      {
        name: "football-performance-head-script",
        transformIndexHtml(html: string) {
          return html.replace("</head>", `<script>${performanceHeadScript}</script></head>`);
        },
      },
    ],
  },
});
