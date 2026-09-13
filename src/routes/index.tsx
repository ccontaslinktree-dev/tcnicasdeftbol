import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  Lock,
  PlayCircle,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import hero from "@/assets/hero-product.png";
import arsenal from "@/assets/arsenal-completo.jpg";
import stack from "@/assets/stack-valor.jpg";
import preview from "@/assets/preview.mov.asset.json";
import tecnica from "@/assets/feature-dribles.jpg";
import fisico from "@/assets/feature-fisico.jpg";
import nutricion from "@/assets/nutricion-atleta.jpg";
import casa from "@/assets/entrenamiento-casa.jpg";
import definicion from "@/assets/bono-definicion.jpg";
import bonus1 from "@/assets/bonus-1.jpg";
import bonus2 from "@/assets/bonus-2.jpg";
import bonus3 from "@/assets/bonus-3.jpg";
import bonus4 from "@/assets/bonus-surprise.png";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial-3.webp";
import testimonial4 from "@/assets/testimonial-4.jpg";
import feedbackJugador from "@/assets/feedback-jugador.mp4.asset.json";
import feedbackEntrenador from "@/assets/feedback-entrenador.mp4.asset.json";

const CHECKOUT = {
  premium: "https://pay.hotmart.com/P107284207G?checkoutMode=2",
  basic: "https://pay.hotmart.com/B107438269A?checkoutMode=2",
};
type Plan = keyof typeof CHECKOUT;

function checkoutUrl(base: string) {
  if (typeof window === "undefined") return base;
  const url = new URL(base),
    incoming = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "xcod"].forEach((k) => {
    const v = incoming.get(k);
    if (v) url.searchParams.set(k, v);
  });
  const xcod = incoming.get("xcod");
  if (xcod) url.searchParams.set("sck", xcod);
  else if (incoming.get("utm_source")) url.searchParams.set("sck", "meta_ads");
  return url.toString();
}

function track(name: string, value?: number) {
  if (typeof window === "undefined") return;
  const event_id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // @ts-expect-error Meta Pixel global
  window.fbq?.("track", name, value ? { value, currency: "USD" } : undefined, {
    eventID: event_id,
  });
  const url = import.meta.env.VITE_SUPABASE_URL,
    key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;
  const cookie = (k: string) => document.cookie.match(new RegExp(`(^| )${k}=([^;]+)`))?.[2];
  fetch(`${url}/functions/v1/meta-capi`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      event_name: name,
      event_id,
      event_source_url: location.href,
      user_agent: navigator.userAgent,
      fbp: cookie("_fbp"),
      fbc: cookie("_fbc"),
      value,
      currency: "USD",
    }),
    keepalive: true,
  }).catch(() => {});
}

const deliveries = [
  ["+2.000 entrenamientos", "Ejercicios listos para variar cada sesión sin improvisar.", arsenal],
  ["Técnica organizada", "Dribles, pases, remates, agilidad, físico y trabajo táctico.", tecnica],
  ["Nutrición deportiva", "Orientación práctica para rendimiento y recuperación.", nutricion],
  ["Entrena en casa", "Rutinas individuales para evolucionar incluso sin equipo.", casa],
  [
    "500 rutinas de definición",
    "Un bloque completo para fuerza y definición muscular.",
    definicion,
  ],
  ["Acceso vitalicio", "Consulta desde cualquier dispositivo e incluye actualizaciones.", fisico],
] as const;
const faqs = [
  [
    "¿Cómo recibo el material?",
    "Después de la compra, Hotmart envía por e-mail las instrucciones de acceso al contenido de tu plan.",
  ],
  ["¿Puedo verlo desde el móvil?", "Sí. Puedes acceder desde móvil, tablet u ordenador."],
  [
    "¿Es para jugadores o entrenadores?",
    "Para ambos: entrenamiento individual y planificación de sesiones.",
  ],
  [
    "¿El acceso caduca?",
    "El Plan Completo incluye acceso vitalicio y actualizaciones, sin mensualidad.",
  ],
  ["¿La compra es segura?", "Sí. El pago se realiza en el entorno seguro de Hotmart."],
  [
    "¿Y si no es para mí?",
    "El Plan Completo tiene 7 días de garantía conforme a las condiciones de Hotmart.",
  ],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "+2.000 Entrenamientos de Fútbol · Método Completo" },
      {
        name: "description",
        content:
          "+2.000 ejercicios, nutrición, entrenamientos en casa, definición muscular y 4 bonos para jugadores y entrenadores.",
      },
      { property: "og:title", content: "+2.000 Entrenamientos de Fútbol · Método Completo" },
      {
        property: "og:description",
        content: "Todo lo que necesitas para entrenar mejor, organizado y listo para aplicar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Heading({
  tag,
  children,
  dark = false,
}: {
  tag: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-6 max-w-2xl text-center">
      <p
        className={`mb-2 text-[10px] font-black uppercase tracking-[.2em] ${dark ? "text-yellow-400" : "text-green-600"}`}
      >
        {tag}
      </p>
      <h2
        className={`text-[27px] font-black uppercase leading-[1.08] sm:text-[40px] ${dark ? "text-white" : "text-zinc-950"}`}
      >
        {children}
      </h2>
    </div>
  );
}
function CTA({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" })}
      className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-[15px] font-black uppercase text-zinc-950 shadow-[0_12px_30px_-10px_rgba(250,204,21,.7)] active:scale-[.98]"
    >
      {children}
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}

function PlanCard({ plan, choose }: { plan: Plan; choose: (p: Plan) => void }) {
  const full = plan === "premium";
  const items = full
    ? [
        "+2.000 entrenamientos organizados",
        "Contenido por posición y categoría",
        "Nutrición de alto rendimiento",
        "Entrenamientos individuales en casa",
        "500 rutinas de definición muscular",
        "4 bonos adicionales",
        "Acceso vitalicio + actualizaciones",
        "Garantía de 7 días",
      ]
    : [
        "Biblioteca básica de fútbol",
        "Material digital para entrenar",
        "Acceso desde cualquier dispositivo",
      ];
  return (
    <article
      className={`relative rounded-[28px] bg-white text-slate-900 ${full ? "border-4 border-green-500 p-5 shadow-[0_26px_70px_-22px_rgba(34,197,94,.7)] sm:p-8" : "border border-slate-300 p-5 opacity-90 sm:p-7"}`}
    >
      {full && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">
          La elección inteligente
        </div>
      )}
      <div className="text-center">
        <div
          className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full ${full ? "bg-green-600 text-white" : "bg-slate-200"}`}
        >
          {full ? <Crown /> : <Target />}
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-green-600">
          Plan {full ? "Completo" : "Básico"}
        </p>
        <h3 className="mt-1 text-[26px] font-black uppercase">
          {full ? "Todo incluido" : "Solo lo esencial"}
        </h3>
      </div>
      <div className="my-5 space-y-3">
        {items.map((i) => (
          <div key={i} className="flex gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <span className="text-[14px] font-bold">{i}</span>
          </div>
        ))}
      </div>
      <div
        className={`mb-5 rounded-2xl p-4 text-center ${full ? "bg-[#07130b] text-white" : "bg-slate-100"}`}
      >
        {full && <p className="text-xs text-slate-400 line-through">Valor separado: US$ 29,90</p>}
        <div className="flex items-end justify-center gap-1">
          <span className="text-xs font-bold">US$</span>
          <span className="text-5xl font-black leading-none">{full ? "6,50" : "5,00"}</span>
        </div>
        <p
          className={`mt-2 text-[10px] font-black uppercase ${full ? "text-yellow-400" : "text-slate-500"}`}
        >
          {full ? "Por solo US$ 1,50 más, llevas todo" : "Ahorra US$ 1,50 y renuncia a los extras"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => choose(plan)}
        className={`min-h-[60px] w-full rounded-2xl px-4 py-4 text-[15px] font-black uppercase text-white active:scale-[.98] ${full ? "bg-green-600 shadow-lg" : "bg-slate-800"}`}
      >
        {full ? "Quiero todo por US$ 6,50" : "Elegir Básico por US$ 5,00"}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1 text-[10px] text-slate-500">
        <Lock className="h-3 w-3" /> Primero verás todos los detalles
      </p>
    </article>
  );
}

function Index() {
  const [plan, setPlan] = useState<Plan | null>(null);
  useEffect(() => {
    track("ViewContent");
  }, []);
  useEffect(() => {
    document.body.style.overflow = plan ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [plan]);
  const choose = (p: Plan) => {
    track("InitiateCheckout", p === "premium" ? 6.5 : 5);
    setPlan(p);
  };
  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-24 text-slate-900 antialiased">
      <div className="fixed inset-x-0 top-0 z-[90] border-b border-yellow-400/40 bg-[#07130b] px-3 py-2 text-center text-[10px] font-black uppercase text-white sm:text-xs">
        Acceso inmediato · Sin mensualidad · 7 días de garantía
      </div>
      <div className="h-9" />
      <section className="relative overflow-hidden bg-[#07130b] px-4 py-9 text-white sm:py-14">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_80%_25%,#22c55e_0,transparent_38%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-500/50 bg-green-600/15 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-green-300">
              <Trophy className="h-4 w-4" /> Para jugadores y entrenadores
            </span>
            <h1 className="mt-4 text-[35px] font-black uppercase leading-[.98] sm:text-[54px]">
              Deja de buscar ejercicios.{" "}
              <span className="text-yellow-400">Entrena con método.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-relaxed text-slate-200 sm:text-xl lg:mx-0">
              Ten en tu móvil <strong className="text-white">más de 2.000 entrenamientos</strong>,
              nutrición, rutinas en casa, definición muscular y bonos listos para aplicar.
            </p>
            <div className="mx-auto mt-5 grid max-w-xl grid-cols-3 gap-2 lg:mx-0">
              {[
                ["+2.000", "ejercicios"],
                ["4", "bonos"],
                ["Vitalicio", "acceso"],
              ].map(([a, b]) => (
                <div
                  key={b}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <b className="block text-lg text-yellow-400">{a}</b>
                  <span className="text-[9px] font-bold uppercase">{b}</span>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-6 max-w-xl lg:mx-0">
              <CTA>Ver todo lo que recibo</CTA>
              <p className="mt-3 flex items-center justify-center gap-1 text-[10px] text-slate-400 lg:justify-start">
                <Lock className="h-3 w-3" /> Pago seguro por Hotmart
              </p>
            </div>
          </div>
          <div className="relative mx-auto max-w-[430px]">
            <div className="absolute inset-6 bg-green-500/30 blur-3xl" />
            <img
              src={hero}
              alt="Método completo de fútbol"
              className="relative w-full rounded-3xl shadow-2xl"
              fetchPriority="high"
            />
            <div className="absolute -bottom-4 inset-x-3 rounded-2xl border border-yellow-400/50 bg-black/90 p-3 text-center">
              <p className="text-[10px] font-black uppercase text-yellow-400">Plan Completo</p>
              <p className="font-black">Todo por solo US$ 6,50</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-4 py-9">
        <div className="mx-auto max-w-5xl">
          <Heading tag="La transformación">
            Más claridad. Más variedad. <span className="text-green-600">Más evolución.</span>
          </Heading>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Ahorra horas", "No busques ejercicios sueltos."],
              ["Entrena con dirección", "Encuentra el trabajo para cada objetivo."],
              ["Aplica hoy", "Contenido práctico y listo para usar."],
            ].map(([a, b]) => (
              <div key={a} className="rounded-2xl border bg-white p-4 text-center">
                <Zap className="mx-auto text-green-600" />
                <h3 className="mt-2 font-black uppercase">{a}</h3>
                <p className="mt-1 text-xs text-slate-600">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Tu arsenal completo">
            No compras archivos sueltos. <span className="text-green-600">Recibes un sistema.</span>
          </Heading>
          <img
            src={arsenal}
            alt="Biblioteca completa"
            className="w-full rounded-3xl shadow-xl"
            loading="lazy"
          />
          <div className="mx-auto mt-6 max-w-xl">
            <CTA>Quiero acceder al sistema</CTA>
          </div>
        </div>
      </section>
      <section className="bg-[#07130b] px-4 py-10 text-white sm:py-14">
        <div className="mx-auto max-w-4xl">
          <Heading tag="Mira por dentro" dark>
            Comprueba lo que tendrás <span className="text-green-400">en tus manos</span>
          </Heading>
          <p className="mx-auto -mt-3 mb-6 max-w-xl text-center text-sm text-slate-300">
            Dale play y mira cómo está organizado antes de elegir.
          </p>
          <div className="mx-auto max-w-[430px] overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
            <video
              src={preview.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Todo lo que recibes">
            Una biblioteca para cada parte <span className="text-green-600">de tu evolución</span>
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deliveries.map(([a, b, img]) => (
              <article key={a} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <img
                  src={img}
                  alt={a}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="flex gap-2 font-black uppercase">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    {a}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">{b}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-7 max-w-xl">
            <CTA>Quiero todo organizado</CTA>
          </div>
        </div>
      </section>
      <section className="bg-zinc-950 px-4 py-10 text-white sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Prueba social" dark>
            Jugadores y entrenadores <span className="text-green-400">ya lo usan</span>
          </Heading>
          <div className="mx-auto grid max-w-[660px] grid-cols-2 gap-3">
            {[
              [feedbackJugador.url, "Jugador"],
              [feedbackEntrenador.url, "Entrenador"],
            ].map(([src, label]) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-2xl border border-white/10"
              >
                <video
                  src={src}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[9/16] w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-1 text-[9px] font-black uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[testimonial1, testimonial2, testimonial3, testimonial4].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Testimonio ${i + 1}`}
                className="aspect-[3/4] w-full rounded-xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Extras del Plan Completo">
            Además, llevas <span className="text-green-600">4 bonos</span>
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["01", "Guía de Entrenamiento", bonus1],
              ["02", "50 Ejercicios de Técnica Individual", bonus2],
              ["03", "Circuitos de Preparación Física", bonus3],
              ["04", "Bono Sorpresa Exclusivo", bonus4],
            ].map(([n, t, img]) => (
              <article
                key={n as string}
                className="flex items-center gap-4 rounded-2xl bg-[#07130b] p-3 text-white"
              >
                <img
                  src={img}
                  alt={t as string}
                  className="h-24 w-28 rounded-xl object-cover"
                  loading="lazy"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-yellow-400">
                    Bono {n as string} · Incluido
                  </span>
                  <h3 className="mt-1 text-sm font-black">{t as string}</h3>
                  <p className="mt-1 text-[10px] text-slate-400">Gratis en el Plan Completo</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="oferta"
        className="scroll-mt-10 bg-gradient-to-b from-[#07130b] to-slate-900 px-4 py-12 text-white sm:py-16"
      >
        <div className="mx-auto max-w-5xl">
          <Heading tag="Elige tu acceso" dark>
            Por US$ 1,50 más, <span className="text-yellow-400">te llevas mucho más</span>
          </Heading>
          <p className="mx-auto -mt-3 mb-8 max-w-xl text-center text-sm text-slate-300">
            El Completo adiciona nutrición, casa, definición, 4 bonos, acceso vitalicio,
            actualizaciones y garantía.
          </p>
          <div className="mx-auto grid max-w-4xl items-start gap-7 md:grid-cols-2">
            <PlanCard plan="premium" choose={choose} />
            <PlanCard plan="basic" choose={choose} />
          </div>
        </div>
      </section>
      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Heading tag="Valor total">
            Una entrega enorme por <span className="text-green-600">menos de US$ 7</span>
          </Heading>
          <img
            src={stack}
            alt="Valor del paquete"
            className="w-full rounded-3xl shadow-xl"
            loading="lazy"
          />
        </div>
      </section>
      <section className="bg-green-50 px-4 py-10 text-center">
        <ShieldCheck className="mx-auto h-14 w-14 text-green-600" />
        <h2 className="mt-3 text-3xl font-black uppercase">Prueba durante 7 días</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
          Conoce el Plan Completo con 7 días de garantía, conforme a las condiciones de Hotmart.
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <CTA>Quiero acceder sin riesgo</CTA>
        </div>
      </section>
      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Heading tag="Preguntas frecuentes">
            Todo claro antes <span className="text-green-600">de decidir</span>
          </Heading>
          <div className="divide-y border-y">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="cursor-pointer list-none pr-6 font-black">
                  {q}
                  <span className="float-right text-green-600">+</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#07130b] px-4 py-12 text-center text-white">
        <h2 className="text-3xl font-black uppercase">
          Tu próximo entrenamiento puede empezar <span className="text-yellow-400">hoy.</span>
        </h2>
        <div className="mx-auto mt-6 max-w-xl">
          <CTA>Elegir mi plan ahora</CTA>
        </div>
      </section>
      <footer className="bg-black px-4 py-7 text-center text-[9px] text-slate-500">
        <p className="font-black text-white">+2.000 ENTRENAMIENTOS DE FÚTBOL</p>
        <p className="mt-2">
          Este sitio no forma parte de Facebook, Meta o Instagram. Los resultados pueden variar.
        </p>
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-[80] border-t bg-white/95 p-2.5 backdrop-blur">
        <button
          type="button"
          onClick={() => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" })}
          className="mx-auto flex min-h-[54px] w-full max-w-xl items-center justify-center gap-2 rounded-xl bg-yellow-400 text-[13px] font-black uppercase"
        >
          <PlayCircle className="h-5 w-5" /> Ver Completo · US$ 6,50
        </button>
      </div>
      {plan && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/85 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <button className="absolute inset-0" onClick={() => setPlan(null)} aria-label="Cerrar" />
          <div className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-[540px] sm:rounded-3xl">
            <div className="sticky top-0 flex items-center justify-between bg-[#07130b] px-5 py-4 text-white">
              <div>
                <p className="text-[9px] font-black uppercase text-yellow-400">
                  Confirma tu elección
                </p>
                <p className="font-black">Plan {plan === "premium" ? "Completo" : "Básico"}</p>
              </div>
              <button onClick={() => setPlan(null)} aria-label="Cerrar">
                <X />
              </button>
            </div>
            <div className="p-5 text-center sm:p-7">
              {plan === "premium" ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-2 text-[10px] font-black uppercase">
                    <Star className="h-3 w-3 fill-current" /> Mejor elección
                  </span>
                  <h2 className="mt-4 text-[27px] font-black uppercase">
                    Por US$ 1,50 más, no dejas nada fuera
                  </h2>
                  <img
                    src={hero}
                    alt="Plan Completo"
                    className="mx-auto mt-4 max-h-[220px] rounded-2xl"
                  />
                  <div className="mt-4 rounded-2xl bg-[#07130b] p-4 text-white">
                    <p className="text-xs line-through text-slate-400">US$ 29,90</p>
                    <p className="text-5xl font-black">US$ 6,50</p>
                    <p className="text-[10px] font-black uppercase text-yellow-400">
                      Pago único · Acceso vitalicio
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-[27px] font-black uppercase">Plan Básico</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    No incluye todos los complementos del Plan Completo.
                  </p>
                  <p className="mt-4 text-5xl font-black">US$ 5,00</p>
                  <button
                    onClick={() => setPlan("premium")}
                    className="mt-4 text-sm font-black text-green-600 underline"
                  >
                    Llevar todo por solo US$ 1,50 más
                  </button>
                </>
              )}
              <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-left">
                {(plan === "premium"
                  ? [
                      "+2.000 entrenamientos",
                      "Nutrición + entrenamientos en casa",
                      "500 rutinas de definición",
                      "4 bonos + acceso vitalicio",
                      "Actualizaciones + garantía",
                    ]
                  : ["Biblioteca básica", "Material digital", "Acceso multidispositivo"]
                ).map((i) => (
                  <p key={i} className="flex gap-2 text-sm font-bold">
                    <Check className="h-5 w-5 text-green-600" />
                    {i}
                  </p>
                ))}
              </div>
              <a
                href={checkoutUrl(CHECKOUT[plan])}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-[62px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-[16px] font-black uppercase text-white"
              >
                Ir al checkout seguro <ArrowRight />
              </a>
              <p className="mt-3 flex justify-center gap-1 text-[10px] text-slate-500">
                <Lock className="h-3 w-3" /> Hotmart abrirá en una nueva pestaña
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
