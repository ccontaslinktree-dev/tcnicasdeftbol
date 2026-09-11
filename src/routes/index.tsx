import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Lock, PlayCircle, ShieldCheck, Star, X, Zap } from "lucide-react";
import heroProduct from "@/assets/hero-product.png";
import previewAsset from "@/assets/preview.mov.asset.json";
import imgArsenal from "@/assets/arsenal-completo.jpg";
import imgStackValor from "@/assets/stack-valor.jpg";
import bonus1 from "@/assets/bonus-1.jpg";
import bonus2 from "@/assets/bonus-2.jpg";
import bonus3 from "@/assets/bonus-3.jpg";
import bonusSurprise from "@/assets/bonus-surprise.png";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial-3.webp";
import testimonial4 from "@/assets/testimonial-4.jpg";
import feedbackJugador from "@/assets/feedback-jugador.mp4.asset.json";
import feedbackEntrenador from "@/assets/feedback-entrenador.mp4.asset.json";

const PREMIUM_CHECKOUT_URL = "https://pay.hotmart.com/P107284207G?checkoutMode=6";
const BASIC_CHECKOUT_URL = "https://pay.hotmart.com/B107438269A?checkoutMode=6";

function buildCheckoutUrl(baseUrl: string) {
  if (typeof window === "undefined") return baseUrl;
  const target = new URL(baseUrl);
  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "xcod"].forEach((key) => {
    const value = params.get(key);
    if (value) target.searchParams.set(key, value);
  });
  const xcod = params.get("xcod");
  if (xcod) target.searchParams.set("sck", xcod);
  else if (params.get("utm_source")) target.searchParams.set("sck", "meta_ads");
  return target.toString();
}

function scrollToOffer() {
  document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fireEvent(name: string, value?: number) {
  if (typeof window === "undefined") return;
  const event_id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // @ts-expect-error fbq global
  window.fbq?.("track", name, value ? { value, currency: "USD" } : undefined, { eventID: event_id });

  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supaUrl || !supaKey) return;
  const getCookie = (key: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : undefined;
  };
  fetch(`${supaUrl}/functions/v1/meta-capi`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: supaKey, Authorization: `Bearer ${supaKey}` },
    body: JSON.stringify({ event_name: name, event_id, event_source_url: window.location.href, user_agent: navigator.userAgent, fbp: getCookie("_fbp"), fbc: getCookie("_fbc"), value, currency: "USD" }),
    keepalive: true,
  }).catch(() => {});
}

const benefits = [
  "+2.000 entrenamientos organizados por posición y categoría",
  "Nutrición de alto rendimiento",
  "Entrenamientos individuales para hacer en casa",
  "500 entrenamientos de definición muscular",
  "4 bonos adicionales en el Plan Completo",
  "Acceso vitalicio y actualizaciones",
];

const faqs = [
  ["¿Cómo recibo el material?", "Después de la compra recibes por e-mail el acceso a la biblioteca digital y a los bonos incluidos."],
  ["¿Puedo acceder desde el móvil?", "Sí. El contenido está preparado para móvil, tablet y ordenador."],
  ["¿Sirve para jugadores y entrenadores?", "Sí. La biblioteca está organizada para facilitar el entrenamiento individual y la planificación de sesiones."],
  ["¿Cuánto tiempo tengo acceso?", "El Plan Completo incluye acceso vitalicio y las actualizaciones indicadas en la oferta."],
  ["¿El pago es seguro?", "Sí. El pago se procesa mediante Hotmart."],
  ["¿Tengo garantía?", "Sí. El Plan Completo cuenta con 7 días de garantía conforme a las condiciones de la compra."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "+2.000 Ejercicios de Fútbol · Plataforma Completa para Jugadores y Entrenadores" },
      { name: "description", content: "Más de 2.000 ejercicios de fútbol organizados por categoría, bonos, materiales y vídeos. Acceso inmediato desde el móvil, con precio promocional solo hoy." },
      { property: "og:title", content: "+2.000 Ejercicios de Fútbol · Plataforma Completa" },
      { property: "og:description", content: "Deja de improvisar: más de 2.000 ejercicios organizados por categoría, bonos, materiales y vídeos listos para aplicar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" onClick={scrollToOffer} className="w-full min-h-[56px] flex items-center justify-center gap-2 bg-[#facc15] active:scale-[0.98] text-[#090909] font-black uppercase text-[15px] leading-tight px-5 py-4 rounded-2xl shadow-[0_10px_28px_-8px_rgba(250,204,21,.6)] touch-manipulation">
      <span>{children}</span><ArrowRight className="w-5 h-5 shrink-0" />
    </button>
  );
}

function PlanCard({ basic = false, onCheckout }: { basic?: boolean; onCheckout: (plan: "premium" | "basic") => void }) {
  return (
    <div className={`w-full rounded-[24px] p-5 sm:p-7 text-left text-[#0f172a] ${basic ? "bg-white border-2 border-slate-300 shadow-xl" : "bg-white border-4 border-[#16a34a] shadow-[0_20px_60px_-20px_rgba(22,163,74,.45)]"}`}>
      <div className="text-center mb-5">
        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${basic ? "bg-slate-800 text-white" : "bg-[#16a34a] text-white"}`}>
          {!basic && <Star className="w-3 h-3 fill-current text-[#facc15]" />}
          {basic ? "Plan Básico" : "Plan Completo · Mejor valor"}
        </span>
        <h3 className="font-black uppercase text-[25px] mt-4">{basic ? "Biblioteca Básica" : "Biblioteca Completa"}</h3>
        <p className="text-slate-500 text-sm font-bold mt-1">{basic ? "La opción esencial para empezar." : "+2.000 ejercicios + complementos + 4 bonos"}</p>
      </div>

      <div className="space-y-3 mb-6">
        {(basic
          ? ["Contenido principal del Plan Básico", "Material digital para entrenar", "Acceso desde móvil, tablet u ordenador", "Compra segura por Hotmart"]
          : ["+2.000 entrenamientos organizados", "Nutrición de alto rendimiento", "Entrenamientos individuales en casa", "500 entrenamientos de definición muscular", "4 bonos adicionales", "Acceso vitalicio + actualizaciones", "7 días de garantía"]
        ).map((item) => (
          <div key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
            <span className="font-bold text-[14px] leading-snug">{item}</span>
          </div>
        ))}
      </div>

      {!basic && (
        <div className="rounded-2xl bg-[#f8fafc] border border-slate-200 p-4 text-center mb-5">
          <p className="text-slate-400 font-black line-through text-base">$29.90</p>
          <div className="flex items-baseline justify-center gap-2"><span className="text-5xl font-black">$6.50</span><span className="text-lg font-black text-[#16a34a]">USD</span></div>
          <span className="inline-block mt-1 bg-[#facc15] text-[#090909] px-3 py-1 rounded-md text-[10px] font-black uppercase">Ahorras 81%</span>
        </div>
      )}

      <button
        type="button"
        className={`w-full min-h-[58px] rounded-2xl font-black uppercase text-[16px] leading-tight px-4 py-4 flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation ${basic ? "bg-[#0f172a] text-white" : "bg-[#16a34a] text-white shadow-[0_10px_25px_-8px_rgba(22,163,74,.6)]"}`}
        onClick={() => onCheckout(basic ? "basic" : "premium")}
      >
        {basic ? "Sí, quiero el Plan Básico" : "Sí, quiero el Plan Completo"}
        <ArrowRight className="w-5 h-5 shrink-0" />
      </button>
      <p className="mt-3 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Pago seguro sin salir de esta página · Hotmart</p>
    </div>
  );
}

function Index() {
  const [checkout, setCheckout] = useState<{ plan: "premium" | "basic"; url: string } | null>(null);

  useEffect(() => { fireEvent("ViewContent"); }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = checkout ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [checkout]);

  const openCheckout = (plan: "premium" | "basic") => {
    fireEvent("InitiateCheckout", plan === "premium" ? 6.5 : 5);
    setCheckout({ plan, url: buildCheckoutUrl(plan === "premium" ? PREMIUM_CHECKOUT_URL : BASIC_CHECKOUT_URL) });
  };

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden pb-24">
      <div className="fixed top-0 inset-x-0 z-[90] bg-[#16a34a] text-white text-center font-black uppercase tracking-wide border-b-2 border-[#15803d] py-2 px-3 text-[10px] sm:text-xs leading-tight">Condición especial de acceso · Plan Completo</div>
      <div className="h-9 sm:h-10" />
      <section className="bg-white px-4 py-7 sm:px-6 sm:py-12 text-center"><div className="w-full max-w-[620px] mx-auto">
        <p className="text-[#16a34a] font-black uppercase tracking-[.12em] text-[10px] sm:text-xs mb-3">+2.000 ejercicios de fútbol</p>
        <h1 className="font-black uppercase leading-[1.03] tracking-tight text-[#080808] text-[28px] sm:text-[44px] mb-4">¿Eres jugador o entrenador? <span className="block text-[#16a34a] mt-1">Deja de improvisar.</span><span className="block text-[16px] sm:text-[22px] mt-3 normal-case font-extrabold text-[#0f172a] leading-snug">Esta plataforma tiene más de 2.000 ejercicios organizados por categoría, varios bonos, materiales y vídeos. Es el momento correcto para empezar a entrenar de la forma correcta.</span></h1>
        <p className="text-slate-600 font-medium text-[14px] sm:text-[17px] leading-relaxed mb-5">Sé lo difícil que es tener que improvisar, repetir los mismos entrenamientos o entrenar como un amateur. Ahora lo tienes <b className="text-[#090909]">todo en una sola plataforma</b>, en la palma de tu mano: en la pantalla de tu móvil, ordenador o tablet. Y con un <b className="text-[#16a34a]">precio promocional increíble que solo dura hasta hoy</b>.</p>
        <img src={heroProduct} alt="Método completo de fútbol" className="w-full max-w-[360px] mx-auto rounded-2xl shadow-xl" width={1024} height={1536} loading="eager" fetchPriority="high" decoding="async" />
        <div className="mt-5 mb-4 rounded-2xl bg-[#090909] text-white p-4 border border-[#facc15]/60"><p className="font-black uppercase text-[#facc15] text-xs mb-1">Plan Completo</p><p className="font-bold text-[13px] leading-snug">+2.000 entrenamientos + nutrición + casa + definición + 4 bonos.</p></div>
        <CTA>Quiero conocer los planes</CTA><p className="mt-3 text-[10px] text-slate-500 flex items-center justify-center gap-1"><Lock className="w-3.5 h-3.5" /> Pago seguro por Hotmart</p>
      </div></section>

      <section className="bg-[#090909] text-white px-4 py-8 sm:py-12"><div className="w-full max-w-[620px] mx-auto text-center"><p className="text-[#facc15] font-black uppercase tracking-widest text-[10px] mb-2">Mira por dentro</p><h2 className="font-black uppercase text-[25px] sm:text-[38px] leading-tight mb-3">Antes de comprar, <span className="text-[#16a34a]">ve lo que vas a recibir</span></h2><p className="text-slate-300 text-[13px] leading-relaxed mb-5">Una vista previa real de la biblioteca y de cómo está organizado el material.</p><div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl max-w-[430px] mx-auto"><video src={previewAsset.url} controls playsInline preload="metadata" className="w-full aspect-[3/4] object-cover" /></div><div className="mt-5"><CTA>Ver mis opciones de acceso</CTA></div></div></section>
      <section className="bg-white px-4 py-9 sm:py-12"><div className="w-full max-w-[700px] mx-auto"><p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-[10px] mb-2">Todo en un solo lugar</p><h2 className="text-center font-black uppercase text-[25px] sm:text-[38px] leading-tight mb-6">Lo que obtienes <span className="text-[#16a34a]">sin improvisar</span></h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{benefits.map((item) => <div key={item} className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200 flex items-start gap-3"><div className="bg-[#16a34a] rounded-full p-1 shrink-0"><CheckCircle2 className="w-4 h-4 text-white" /></div><span className="font-bold text-[13px] leading-snug">{item}</span></div>)}</div><div className="mt-6"><CTA>Quiero ver los planes</CTA></div></div></section>
      <section className="bg-[#f1f5f9] px-4 py-8 sm:py-12"><div className="w-full max-w-[760px] mx-auto text-center"><p className="text-[#16a34a] font-black uppercase tracking-widest text-[10px] mb-2">La biblioteca completa</p><h2 className="font-black uppercase text-[25px] sm:text-[38px] leading-tight mb-3">Más contenido. <span className="text-[#16a34a]">Menos tiempo perdido.</span></h2><p className="text-slate-600 text-[13px] leading-relaxed mb-5">Físico, táctico, dribles, agilidad, chutes, pases y categorías para organizar tus sesiones.</p><img src={imgArsenal} alt="Arsenal completo de entrenamientos" className="w-full rounded-2xl shadow-lg" width={1200} height={800} loading="lazy" decoding="async" /></div></section>
      <section className="bg-[#090909] text-white px-4 py-9 sm:py-12"><div className="w-full max-w-[760px] mx-auto"><p className="text-center text-[#facc15] font-black uppercase tracking-widest text-[10px] mb-2">Prueba social</p><h2 className="text-center font-black uppercase text-[25px] sm:text-[38px] leading-tight mb-3">Mira lo que <span className="text-[#16a34a]">comparten</span></h2><p className="text-center text-slate-300 text-[13px] mb-6">Feedback de jugadores y entrenadores.</p><div className="grid grid-cols-2 gap-3 max-w-[620px] mx-auto mb-5">{[{ src: feedbackJugador.url, label: "Jugador" }, { src: feedbackEntrenador.url, label: "Entrenador" }].map((item) => <div key={item.label} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5"><div className="relative"><video src={item.src} controls playsInline preload="metadata" className="w-full aspect-[9/16] object-cover bg-black" /><span className="absolute top-2 left-2 bg-[#16a34a] text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">{item.label}</span></div></div>)}</div><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{[testimonial1, testimonial2, testimonial3, testimonial4].map((src, i) => <img key={i} src={src} alt={`Testimonio ${i + 1}`} className="w-full aspect-[3/4] object-cover rounded-xl border border-white/10" loading="lazy" decoding="async" />)}</div><div className="mt-6"><CTA>Quiero ver los planes</CTA></div></div></section>
      <section className="bg-white px-4 py-9 sm:py-12"><div className="w-full max-w-[760px] mx-auto"><p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-[10px] mb-2">Incluidos en el Plan Completo</p><h2 className="text-center font-black uppercase text-[25px] sm:text-[38px] leading-tight mb-6">4 <span className="text-[#16a34a]">bonos</span> incluidos</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[{ n: "01", t: "Guía de Entrenamiento", img: bonus1 }, { n: "02", t: "50 Ejercicios de Técnica Individual", img: bonus2 }, { n: "03", t: "Circuitos de Preparación Física", img: bonus3 }, { n: "04", t: "Bono Sorpresa Exclusivo", img: bonusSurprise }].map((bonus) => <div key={bonus.n} className="flex items-center gap-3 rounded-2xl bg-[#090909] text-white p-3 border border-[#facc15]/30"><img src={bonus.img} alt={bonus.t} className="w-20 h-16 object-cover rounded-xl shrink-0" loading="lazy" /><div><p className="text-[#facc15] font-black text-[9px] uppercase tracking-widest">BONO {bonus.n}</p><h3 className="font-black text-[13px] leading-tight mt-1">{bonus.t}</h3></div></div>)}</div><div className="mt-6"><CTA>Quiero ver los planes</CTA></div></div></section>

      <section id="oferta" className="scroll-mt-10 bg-gradient-to-b from-[#090909] to-[#111827] text-white px-4 py-10 sm:py-14"><div className="w-full max-w-[620px] mx-auto text-center"><p className="text-[#facc15] font-black uppercase tracking-widest text-[10px] mb-2">Elige tu acceso</p><h2 className="font-black uppercase text-[28px] sm:text-[42px] leading-tight mb-3">Dos opciones. <span className="text-[#facc15]">Tú eliges.</span></h2><p className="text-slate-300 text-[13px] leading-relaxed mb-7">Compara los planes y elige el que mejor encaja con tu objetivo.</p><div className="space-y-5 text-left"><PlanCard /><PlanCard basic /></div></div></section>
      <section className="bg-white px-4 py-9 sm:py-12"><div className="w-full max-w-[700px] mx-auto"><h2 className="text-center font-black uppercase text-[25px] sm:text-[36px] leading-tight mb-5">Un sistema completo por una fracción de su <span className="text-[#16a34a]">valor</span></h2><img src={imgStackValor} alt="Valor del paquete completo" className="w-full max-w-[560px] mx-auto rounded-2xl shadow-lg mb-5" loading="lazy" /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="rounded-2xl bg-[#f8fafc] border border-slate-200 p-4"><p className="font-black uppercase text-[#16a34a] text-[10px] mb-2">Lo que evitas</p><p className="text-[13px] font-semibold">Horas buscando ejercicios, material desorganizado y compras por separado.</p></div><div className="rounded-2xl bg-[#090909] text-white p-4 border border-[#16a34a]"><p className="font-black uppercase text-[#facc15] text-[10px] mb-2">Lo que obtienes</p><p className="text-[13px] font-semibold">Biblioteca centralizada, bonos, acceso inmediato y organización.</p></div></div></div></section>
      <section className="bg-[#f1f5f9] px-4 py-9 sm:py-12 text-center"><ShieldCheck className="w-12 h-12 mx-auto text-[#16a34a] mb-3" /><p className="text-[#16a34a] font-black uppercase tracking-widest text-[10px] mb-2">Compra protegida</p><h2 className="font-black uppercase text-[27px] sm:text-[38px] leading-tight mb-3">7 días de garantía</h2><p className="text-slate-600 text-[13px] leading-relaxed max-w-[520px] mx-auto mb-5">Tienes 7 días para conocer el material conforme a las condiciones de garantía de la compra.</p><div className="max-w-[620px] mx-auto"><CTA>Quiero ver los planes</CTA></div></section>
      <section className="bg-white px-4 py-9 sm:py-12"><div className="w-full max-w-[700px] mx-auto"><p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-[10px] mb-2">Preguntas frecuentes</p><h2 className="text-center font-black uppercase text-[27px] sm:text-[38px] leading-tight mb-6">Antes de <span className="text-[#16a34a]">entrar</span></h2><div className="divide-y divide-slate-200 border-y border-slate-200">{faqs.map(([q, a]) => <details key={q} className="group py-4"><summary className="cursor-pointer list-none font-black text-[14px] pr-7 relative">{q}<span className="absolute right-0 top-0 text-[#16a34a] text-xl group-open:rotate-45 transition-transform">+</span></summary><p className="text-slate-600 text-[13px] leading-relaxed mt-2 pr-5">{a}</p></details>)}</div><div className="mt-6"><CTA>Quiero elegir mi plan</CTA></div></div></section>
      <section className="bg-[#090909] text-white px-4 py-10 sm:py-14 text-center"><div className="w-full max-w-[620px] mx-auto"><Zap className="w-9 h-9 text-[#facc15] mx-auto mb-3 fill-current" /><h2 className="font-black uppercase text-[28px] sm:text-[44px] leading-[1.04] mb-3">Tu próximo entrenamiento puede empezar <span className="text-[#facc15]">hoy.</span></h2><p className="text-slate-300 text-[13px] leading-relaxed mb-5">Deja de perder tiempo buscando material. Elige tu plan y empieza.</p><CTA>Elegir mi plan ahora</CTA><p className="mt-3 text-[10px] text-slate-500">Acceso digital · Pago seguro · 7 días de garantía</p></div></section>
      <footer className="bg-[#050505] text-slate-500 text-[9px] leading-relaxed text-center px-4 py-6"><p className="font-black text-white uppercase tracking-widest mb-2">2000 Ejercicios de Fútbol</p><p>Este sitio no forma parte de Facebook, Meta o Instagram, ni está patrocinado o avalado por dichas plataformas.</p><p className="mt-1">Los resultados individuales pueden variar según dedicación, contexto y aplicación del material.</p><p className="mt-1">© {new Date().getFullYear()} 2000 Ejercicios de Fútbol · Todos los derechos reservados.</p></footer>
      <div className="fixed bottom-0 inset-x-0 z-[80] bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 safe-area-bottom"><div className="w-full max-w-[620px] mx-auto"><button className="w-full min-h-[52px] bg-[#facc15] active:scale-[0.98] text-[#090909] font-black uppercase text-[13px] px-4 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 touch-manipulation"><PlayCircle className="w-5 h-5" /> Ver planes · $6.50 USD</button></div></div>
    </main>
  );
}
